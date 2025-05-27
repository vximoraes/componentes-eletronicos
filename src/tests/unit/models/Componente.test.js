import mongoose from 'mongoose';
import Componente from '../../../../src/models/Componente.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

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
    jest.clearAllMocks();
    await Componente.deleteMany({});
});

describe('Modelo de Componente', () => {
    it('deve criar um componente com dados válidos', async () => {
        const componenteData = {
            nome: 'Resistor 10k',
            estoque_minimo: 10,
            valor_unitario: 0.05,
            descricao: 'Resistor de 10k Ohms',
            imagem: 'http://exemplo.com/resistor.jpg',
            localizacao: new mongoose.Types.ObjectId(),
            categoria: new mongoose.Types.ObjectId()
        };
        const componente = new Componente(componenteData);
        await componente.save();
        const saved = await Componente.findById(componente._id);
        expect(saved.nome).toBe(componenteData.nome);
        expect(saved.quantidade).toBe(0);
        expect(saved.estoque_minimo).toBe(componenteData.estoque_minimo);
        expect(saved.valor_unitario).toBe(componenteData.valor_unitario);
        expect(saved.descricao).toBe(componenteData.descricao);
        expect(saved.imagem).toBe(componenteData.imagem);
        expect(saved.localizacao.toString()).toBe(componenteData.localizacao.toString());
        expect(saved.categoria.toString()).toBe(componenteData.categoria.toString());
        expect(saved.ativo).toBe(true);
    });

    it('não deve criar componente sem campos obrigatórios', async () => {
        const componenteData = {
            estoque_minimo: 10,
            valor_unitario: 0.05,
            localizacao: new mongoose.Types.ObjectId(),
            categoria: new mongoose.Types.ObjectId()
        };
        const componente = new Componente(componenteData);
        await expect(componente.save()).rejects.toThrow();
    });

    it('não deve criar componente com nome duplicado', async () => {
        const baseData = {
            nome: 'Capacitor 100nF',
            estoque_minimo: 5,
            valor_unitario: 0.10,
            localizacao: new mongoose.Types.ObjectId(),
            categoria: new mongoose.Types.ObjectId()
        };
        const c1 = new Componente(baseData);
        await c1.save();
        const c2 = new Componente(baseData);
        await expect(c2.save()).rejects.toThrow();
    });

    it('deve definir ativo como false por padrão', async () => {
        const componenteData = {
            nome: 'Indutor',
            estoque_minimo: 2,
            valor_unitario: 0.50,
            localizacao: new mongoose.Types.ObjectId(),
            categoria: new mongoose.Types.ObjectId()
        };
        const componente = new Componente(componenteData);
        await componente.save();
        const saved = await Componente.findById(componente._id);
        expect(saved.ativo).toBe(true);
    });

    it('deve retornar todos os componentes cadastrados', async () => {
        const c1 = new Componente({
            nome: 'Diodo',
            estoque_minimo: 3,
            valor_unitario: 0.20,
            localizacao: new mongoose.Types.ObjectId(),
            categoria: new mongoose.Types.ObjectId()
        });
        const c2 = new Componente({
            nome: 'Transistor',
            estoque_minimo: 4,
            valor_unitario: 0.30,
            localizacao: new mongoose.Types.ObjectId(),
            categoria: new mongoose.Types.ObjectId()
        });
        await c1.save();
        await c2.save();
        const componentes = await Componente.find();
        expect(componentes.length).toBe(2);
        const nomes = componentes.map(c => c.nome);
        expect(nomes).toContain('Diodo');
        expect(nomes).toContain('Transistor');
    });
});