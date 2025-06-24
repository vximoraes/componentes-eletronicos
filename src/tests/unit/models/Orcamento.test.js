import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Orcamento from '../../../models/Orcamento.js';

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
    await Orcamento.deleteMany({});
});

describe('Model Orcamento', () => {
    it('deve cadastrar orçamento válido', async () => {
        const orcamento = await Orcamento.create({
            nome: 'Orçamento 1',
            protocolo: 'PROTO-001',
            valor: 100,
            componentes: [{
                nome: 'Resistor',
                fornecedor: 'Fornecedor A',
                quantidade: 10,
                valor_unitario: 10,
                subtotal: 100,
            }],
        });
        expect(orcamento._id).toBeDefined();
        expect(orcamento.protocolo).toBe('PROTO-001');
        expect(orcamento.componentes.length).toBe(1);
    });

    it('não deve cadastrar orçamento sem campos obrigatórios', async () => {
        await expect(Orcamento.create({ nome: 'Sem Protocolo' }))
            .rejects.toThrow();
    });

    it('não deve permitir protocolo duplicado', async () => {
        await Orcamento.create({
            nome: 'Orçamento 1',
            protocolo: 'PROTO-002',
            valor: 50,
            componentes: [{
                nome: 'Capacitor',
                fornecedor: 'Fornecedor B',
                quantidade: 5,
                valor_unitario: 10,
                subtotal: 50,
            }],
        });
        await expect(Orcamento.create({
            nome: 'Orçamento 2',
            protocolo: 'PROTO-002',
            valor: 30,
            componentes: [{
                nome: 'Diodo',
                fornecedor: 'Fornecedor C',
                quantidade: 3,
                valor_unitario: 10,
                subtotal: 30,
            }],
        })).rejects.toThrow();
    });

    it('deve calcular corretamente o valor total', async () => {
        const orcamento = await Orcamento.create({
            nome: 'Orçamento Soma',
            protocolo: 'PROTO-003',
            valor: 60,
            componentes: [
                { nome: 'A', fornecedor: 'F1', quantidade: 2, valor_unitario: 10, subtotal: 20 },
                { nome: 'B', fornecedor: 'F2', quantidade: 4, valor_unitario: 10, subtotal: 40 },
            ],
        });
        const soma = orcamento.componentes.reduce((acc, c) => acc + c.subtotal, 0);
        expect(orcamento.valor).toBe(soma);
    });

    it('deve buscar orçamento por nome', async () => {
        await Orcamento.create({
            nome: 'BuscaNome',
            protocolo: 'PROTO-004',
            valor: 10,
            componentes: [{ nome: 'X', fornecedor: 'F', quantidade: 1, valor_unitario: 10, subtotal: 10 }],
        });
        const found = await Orcamento.findOne({ nome: 'BuscaNome' });
        expect(found).not.toBeNull();
        expect(found.nome).toBe('BuscaNome');
    });

    it('deve buscar orçamento por id', async () => {
        const orcamento = await Orcamento.create({
            nome: 'BuscaId',
            protocolo: 'PROTO-005',
            valor: 20,
            componentes: [{ nome: 'Y', fornecedor: 'F', quantidade: 2, valor_unitario: 10, subtotal: 20 }],
        });
        const found = await Orcamento.findById(orcamento._id);
        expect(found).not.toBeNull();
        expect(found.nome).toBe('BuscaId');
    });

    it('deve atualizar orçamento', async () => {
        const orcamento = await Orcamento.create({
            nome: 'Atualiza',
            protocolo: 'PROTO-006',
            valor: 10,
            componentes: [{ nome: 'Z', fornecedor: 'F', quantidade: 1, valor_unitario: 10, subtotal: 10 }],
        });
        orcamento.nome = 'Atualizado';
        await orcamento.save();
        const found = await Orcamento.findById(orcamento._id);
        expect(found.nome).toBe('Atualizado');
    });

    it('deve remover orçamento', async () => {
        const orcamento = await Orcamento.create({
            nome: 'Remove',
            protocolo: 'PROTO-007',
            valor: 10,
            componentes: [{ nome: 'W', fornecedor: 'F', quantidade: 1, valor_unitario: 10, subtotal: 10 }],
        });
        await Orcamento.findByIdAndDelete(orcamento._id);
        const found = await Orcamento.findById(orcamento._id);
        expect(found).toBeNull();
    });

    it('deve adicionar componente ao orçamento', async () => {
        const orcamento = await Orcamento.create({
            nome: 'AddComp',
            protocolo: 'PROTO-008',
            valor: 10,
            componentes: [{ nome: 'V', fornecedor: 'F', quantidade: 1, valor_unitario: 10, subtotal: 10 }],
        });
        orcamento.componentes.push({ nome: 'Novo', fornecedor: 'F2', quantidade: 2, valor_unitario: 5, subtotal: 10 });
        orcamento.valor = orcamento.componentes.reduce((acc, c) => acc + c.subtotal, 0);
        await orcamento.save();
        const found = await Orcamento.findById(orcamento._id);
        expect(found.componentes.length).toBe(2);
        expect(found.valor).toBe(20);
    });

    it('não deve permitir componente sem campos obrigatórios', async () => {
        await expect(Orcamento.create({
            nome: 'SemComp',
            protocolo: 'PROTO-009',
            valor: 0,
            componentes: [{ nome: 'Invalido' }],
        })).rejects.toThrow();
    });
});