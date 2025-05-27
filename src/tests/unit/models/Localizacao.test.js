import mongoose from 'mongoose';
import Localizacao from '../../../../src/models/Localizacao.js';
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
    await Localizacao.deleteMany({});
});

describe('Modelo de Localizacao', () => {
    it('deve criar uma localizacao com nome válido e único', async () => {
        const localizacaoData = { nome: 'Estoque A' };
        const localizacao = new Localizacao(localizacaoData);
        await localizacao.save();
        const saved = await Localizacao.findById(localizacao._id);
        expect(saved.nome).toBe(localizacaoData.nome);
        expect(saved._id).toBeDefined();
    });

    it('não deve criar localizacao sem nome', async () => {
        const localizacao = new Localizacao({});
        await expect(localizacao.save()).rejects.toThrow();
    });

    it('não deve criar localizacao com nome duplicado', async () => {
        const data = { nome: 'Estoque B' };
        const l1 = new Localizacao(data);
        await l1.save();
        const l2 = new Localizacao(data);
        await expect(l2.save()).rejects.toThrow();
    });

    it('deve retornar todas as localizacoes cadastradas', async () => {
        const l1 = new Localizacao({ nome: 'Estoque C' });
        const l2 = new Localizacao({ nome: 'Estoque D' });
        await l1.save();
        await l2.save();
        const localizacoes = await Localizacao.find();
        expect(localizacoes.length).toBe(2);
        const nomes = localizacoes.map(l => l.nome);
        expect(nomes).toContain('Estoque C');
        expect(nomes).toContain('Estoque D');
    });

    it('deve atualizar o nome de uma localizacao', async () => {
        const localizacao = new Localizacao({ nome: 'Estoque E' });
        await localizacao.save();
        localizacao.nome = 'Estoque E Atualizado';
        await localizacao.save();
        const updated = await Localizacao.findById(localizacao._id);
        expect(updated.nome).toBe('Estoque E Atualizado');
    });

    it('não deve atualizar para nome já existente', async () => {
        const l1 = new Localizacao({ nome: 'Estoque F' });
        const l2 = new Localizacao({ nome: 'Estoque G' });
        await l1.save();
        await l2.save();
        l2.nome = 'Estoque F';
        await expect(l2.save()).rejects.toThrow();
    });

    it('deve remover uma localizacao existente', async () => {
        const localizacao = new Localizacao({ nome: 'Estoque H' });
        await localizacao.save();
        await Localizacao.findByIdAndDelete(localizacao._id);
        const found = await Localizacao.findById(localizacao._id);
        expect(found).toBeNull();
    });
});