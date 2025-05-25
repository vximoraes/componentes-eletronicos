import mongoose from 'mongoose';
import Movimentacao from '../../../../src/models/Movimentacao.js';
import Componente from '../../../../src/models/Componente.js';
import Fornecedor from '../../../../src/models/Fornecedor.js';
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
    await Movimentacao.deleteMany({});
    await Componente.deleteMany({});
    await Fornecedor.deleteMany({});
});

describe('Modelo de Movimentacao', () => {
    let componente;
    let fornecedor;

    beforeEach(async () => {
        componente = await Componente.create({
            nome: 'Resistor 1k',
            quantidade: 100,
            estoque_minimo: 10,
            valor_unitario: 0.05,
            localizacao: new mongoose.Types.ObjectId(),
            categoria: new mongoose.Types.ObjectId()
        });
        fornecedor = await Fornecedor.create({ nome: 'Fornecedor Teste' });
    });

    it('deve criar uma movimentacao de entrada válida (fornecedor obrigatório)', async () => {
        const movData = {
            tipo: 'entrada',
            quantidade: 10,
            componente: componente._id,
            fornecedor: fornecedor._id
        };
        const mov = new Movimentacao(movData);
        await mov.save();
        const saved = await Movimentacao.findById(mov._id);
        expect(saved.tipo).toBe('entrada');
        expect(saved.fornecedor.toString()).toBe(fornecedor._id.toString());
        expect(saved.componente.toString()).toBe(componente._id.toString());
    });

    it('não deve criar movimentacao de entrada sem fornecedor', async () => {
        const movData = {
            tipo: 'entrada',
            quantidade: 10,
            componente: componente._id
        };
        const mov = new Movimentacao(movData);
        await mov.save(); 
    });

    it('deve criar uma movimentacao de saida sem fornecedor', async () => {
        const movData = {
            tipo: 'saida',
            quantidade: 5,
            componente: componente._id
        };
        const mov = new Movimentacao(movData);
        await mov.save();
        const saved = await Movimentacao.findById(mov._id);
        expect(saved.tipo).toBe('saida');
        expect(saved.fornecedor == null).toBe(true);
    });

    it('deve retornar todas as movimentacoes cadastradas', async () => {
        await Movimentacao.create({ tipo: 'entrada', quantidade: 10, componente: componente._id, fornecedor: fornecedor._id });
        await Movimentacao.create({ tipo: 'saida', quantidade: 5, componente: componente._id });
        const movs = await Movimentacao.find();
        expect(movs.length).toBe(2);
        const tipos = movs.map(m => m.tipo);
        expect(tipos).toContain('entrada');
        expect(tipos).toContain('saida');
    });

    it('deve remover uma movimentacao existente', async () => {
        const mov = await Movimentacao.create({ tipo: 'entrada', quantidade: 10, componente: componente._id, fornecedor: fornecedor._id });
        await Movimentacao.findByIdAndDelete(mov._id);
        const found = await Movimentacao.findById(mov._id);
        expect(found).toBeNull();
    });

    it('não deve criar movimentacao sem tipo', async () => {
        const movData = {
            quantidade: 10,
            componente: componente._id,
            fornecedor: fornecedor._id
        };
        const mov = new Movimentacao(movData);
        await expect(mov.save()).rejects.toThrow();
    });

    it('não deve criar movimentacao sem componente', async () => {
        const movData = {
            tipo: 'entrada',
            quantidade: 10,
            fornecedor: fornecedor._id
        };
        const mov = new Movimentacao(movData);
        await expect(mov.save()).rejects.toThrow();
    });

    it('não deve criar movimentacao sem quantidade', async () => {
        const movData = {
            tipo: 'entrada',
            componente: componente._id,
            fornecedor: fornecedor._id
        };
        const mov = new Movimentacao(movData);
        await expect(mov.save()).rejects.toThrow();
    });

    it('não deve criar movimentacao com tipo inválido', async () => {
        const movData = {
            tipo: 'ajuste',
            quantidade: 10,
            componente: componente._id,
            fornecedor: fornecedor._id
        };
        const mov = new Movimentacao(movData);
        await expect(mov.save()).rejects.toThrow();
    });
});