import mongoose from 'mongoose';
import ComponenteOrcamento from '../../../../src/models/ComponenteOrcamento.js';
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
    await ComponenteOrcamento.deleteMany({});
});

describe('Modelo de ComponenteOrcamento', () => {
    it('deve criar um componente de orçamento com dados válidos', async () => {
        const componenteOrcamentoData = {
            nome: 'Placa Arduino Uno',
            fornecedor: 'Albuquerque - Carvalho',
            quantidade: 74,
            valor_unitario: 193
        };

        const componenteOrcamento = new ComponenteOrcamento(componenteOrcamentoData);
        await componenteOrcamento.save();

        const saved = await ComponenteOrcamento.findById(componenteOrcamento._id);
        expect(saved.nome).toBe(componenteOrcamentoData.nome);
        expect(saved.fornecedor).toBe(componenteOrcamentoData.fornecedor);
        expect(saved.quantidade).toBe(componenteOrcamentoData.quantidade);
        expect(saved.valor_unitario).toBe(componenteOrcamentoData.valor_unitario);
        expect(saved.subtotal).toBe(74 * 193);
    });

    it('não deve criar componente de orçamento sem nome', async () => {
        const componenteOrcamentoData = {
            fornecedor: 'Albuquerque - Carvalho',
            quantidade: 74,
            valor_unitario: 193
        };
        const componenteOrcamento = new ComponenteOrcamento(componenteOrcamentoData);
        await expect(componenteOrcamento.save()).rejects.toThrow();
    });

    it('não deve criar componente de orçamento sem fornecedor', async () => {
        const componenteOrcamentoData = {
            nome: 'Placa Arduino Uno',
            quantidade: 74,
            valor_unitario: 193
        };
        const componenteOrcamento = new ComponenteOrcamento(componenteOrcamentoData);
        await expect(componenteOrcamento.save()).rejects.toThrow();
    });

    it('não deve criar componente de orçamento com quantidade negativa', async () => {
        const componenteOrcamentoData = {
            nome: 'Placa Arduino Uno',
            fornecedor: 'Albuquerque - Carvalho',
            quantidade: -1,
            valor_unitario: 193
        };
        const componenteOrcamento = new ComponenteOrcamento(componenteOrcamentoData);
        await expect(componenteOrcamento.save()).rejects.toThrow();
    });

    it('não deve criar componente de orçamento com valor unitário negativo', async () => {
        const componenteOrcamentoData = {
            nome: 'Placa Arduino Uno',
            fornecedor: 'Albuquerque - Carvalho',
            quantidade: 74,
            valor_unitario: -193
        };
        const componenteOrcamento = new ComponenteOrcamento(componenteOrcamentoData);
        await expect(componenteOrcamento.save()).rejects.toThrow();
    });

    it('deve calcular automaticamente o subtotal (quantidade × valor_unitario)', async () => {
        const componenteOrcamentoData = {
            nome: 'Sensor Ultrassônico',
            fornecedor: 'Eletrônica Total',
            quantidade: 10,
            valor_unitario: 25.50
        };
        const componenteOrcamento = new ComponenteOrcamento(componenteOrcamentoData);
        await componenteOrcamento.save();

        const saved = await ComponenteOrcamento.findById(componenteOrcamento._id);
        expect(saved.subtotal).toBeCloseTo(255); 
    });

    it('deve atualizar o subtotal quando quantidade ou valor_unitario for alterado', async () => {
        const componenteOrcamentoData = {
            nome: 'Display LCD',
            fornecedor: 'Componentes Digitais',
            quantidade: 5,
            valor_unitario: 45
        };
        const componenteOrcamento = new ComponenteOrcamento(componenteOrcamentoData);
        await componenteOrcamento.save();

        // Atualiza a quantidade
        componenteOrcamento.quantidade = 8;
        await componenteOrcamento.save();
        const updated1 = await ComponenteOrcamento.findById(componenteOrcamento._id);
        expect(updated1.subtotal).toBe(8 * 45);

        // Atualiza o valor unitário
        componenteOrcamento.valor_unitario = 50;
        await componenteOrcamento.save();
        const updated2 = await ComponenteOrcamento.findById(componenteOrcamento._id);
        expect(updated2.subtotal).toBe(8 * 50);
    });

    it('deve retornar todos os componentes de orçamento cadastrados', async () => {
        const co1 = new ComponenteOrcamento({
            nome: 'Resistor 10k',
            fornecedor: 'Eletrônica RJ',
            quantidade: 100,
            valor_unitario: 0.10
        });
        const co2 = new ComponenteOrcamento({
            nome: 'Capacitor 100uF',
            fornecedor: 'Componentes SP',
            quantidade: 50,
            valor_unitario: 0.50
        });
        await co1.save();
        await co2.save();

        const componentesOrcamento = await ComponenteOrcamento.find();
        expect(componentesOrcamento.length).toBe(2);
        expect(componentesOrcamento[0].nome).toBe('Resistor 10k');
        expect(componentesOrcamento[1].nome).toBe('Capacitor 100uF');
    });
});
