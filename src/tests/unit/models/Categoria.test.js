import mongoose from 'mongoose';
import Categoria from '../../../../src/models/Categoria.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

describe('Modelo de Categoria', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await Categoria.deleteMany({});
    });

    it('deve criar uma categoria válida', async () => {
        const cat = new Categoria({ nome: 'Resistores' });
        await cat.save();
        expect(cat._id).toBeDefined();
        expect(cat.nome).toBe('Resistores');
    });

    it('não deve criar categoria sem nome', async () => {
        const cat = new Categoria({});
        await expect(cat.save()).rejects.toThrow();
    });

    it('não deve criar categoria com nome duplicado', async () => {
        await Categoria.create({ nome: 'Capacitores' });
        const cat2 = new Categoria({ nome: 'Capacitores' });
        await expect(cat2.save()).rejects.toThrow();
    });

    it('deve retornar todas as categorias cadastradas', async () => {
        await Categoria.create([{ nome: 'A' }, { nome: 'B' }]);
        const cats = await Categoria.find();
        expect(cats.length).toBe(2);
        expect(cats.map(c => c.nome)).toEqual(expect.arrayContaining(['A', 'B']));
    });

    it('deve buscar categoria por id', async () => {
        const cat = await Categoria.create({ nome: 'Indutores' });
        const found = await Categoria.findById(cat._id);
        expect(found.nome).toBe('Indutores');
    });

    it('deve atualizar o nome da categoria', async () => {
        const cat = await Categoria.create({ nome: 'Antigo' });
        await Categoria.findByIdAndUpdate(cat._id, { nome: 'Novo' });
        const updated = await Categoria.findById(cat._id);
        expect(updated.nome).toBe('Novo');
    });

    it('não deve atualizar para nome já existente', async () => {
        await Categoria.create({ nome: 'Existente' });
        const cat = await Categoria.create({ nome: 'Outro' });
        await expect(Categoria.findByIdAndUpdate(cat._id, { nome: 'Existente' }, { runValidators: true })).rejects.toThrow();
    });

    it('deve filtrar categorias por nome', async () => {
        await Categoria.create([{ nome: 'Filtro1' }, { nome: 'Filtro2' }]);
        const cats = await Categoria.find({ nome: /Filtro/ });
        expect(cats.length).toBe(2);
    });

    it('deve remover uma categoria', async () => {
        const cat = await Categoria.create({ nome: 'Remover' });
        await Categoria.findByIdAndDelete(cat._id);
        const found = await Categoria.findById(cat._id);
        expect(found).toBeNull();
    });

    it('deve retornar null ao buscar categoria inexistente', async () => {
        const id = new mongoose.Types.ObjectId();
        const found = await Categoria.findById(id);
        expect(found).toBeNull();
    });

    it('não deve remover categoria inexistente', async () => {
        const id = new mongoose.Types.ObjectId();
        const res = await Categoria.findByIdAndDelete(id);
        expect(res).toBeNull();
    });
});
