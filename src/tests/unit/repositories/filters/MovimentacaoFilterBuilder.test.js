import MovimentacaoFilterBuilder from '../../../../repositories/filters/MovimentacaoFilterBuilder.js';
import mongoose from 'mongoose';

jest.mock('../../../../models/Componente.js', () => ({
    findById: jest.fn(),
    findOne: jest.fn()
}));
jest.mock('../../../../models/Fornecedor.js', () => ({
    findById: jest.fn(),
    findOne: jest.fn()
}));

const Componente = require('../../../../models/Componente.js');
const Fornecedor = require('../../../../models/Fornecedor.js');

describe('MovimentacaoFilterBuilder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar filtro vazio por padrão', () => {
        const builder = new MovimentacaoFilterBuilder();
        expect(builder.build()).toEqual({});
    });

    it('deve adicionar filtro de tipo corretamente', () => {
        const builder = new MovimentacaoFilterBuilder().comTipo('entrada');
        expect(builder.build()).toEqual({ tipo: { $regex: 'entrada', $options: 'i' } });
    });

    it('deve adicionar filtro de data corretamente', () => {
        const builder = new MovimentacaoFilterBuilder().comData('2024-05-29');
        const filtros = builder.build();
        expect(filtros.data_hora).toBeDefined();
        expect(filtros.data_hora.$gte).toBeInstanceOf(Date);
        expect(filtros.data_hora.$lte).toBeInstanceOf(Date);
    });

    it('deve adicionar filtro de quantidade corretamente', () => {
        const builder = new MovimentacaoFilterBuilder().comQuantidade('10');
        expect(builder.build()).toEqual({ quantidade: 10 });
    });

    it('não deve adicionar filtro de quantidade se valor for inválido', () => {
        const builder = new MovimentacaoFilterBuilder().comQuantidade('abc');
        expect(builder.build()).toEqual({});
    });

    it('não deve adicionar filtro de tipo/data/quantidade se valores forem vazios', () => {
        const builder = new MovimentacaoFilterBuilder().comTipo('').comData('').comQuantidade('');
        expect(builder.build()).toEqual({});
    });

    describe('comComponente', () => {
        it('deve adicionar filtro de componente por ObjectId válido e encontrado', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
            Componente.findById.mockResolvedValue({ _id: 'c1' });
            await builder.comComponente('c1');
            expect(builder.build()).toEqual({ componente: 'c1' });
        });
        it('deve adicionar filtro de componente por ObjectId válido e não encontrado', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
            Componente.findById.mockResolvedValue(null);
            await builder.comComponente('c1');
            expect(builder.build()).toEqual({ componente: { $in: [] } });
        });
        it('deve adicionar filtro de componente por string encontrada', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
            Componente.findOne.mockResolvedValue({ _id: 'c2' });
            await builder.comComponente('resistor');
            expect(builder.build()).toEqual({ componente: 'c2' });
        });
        it('deve adicionar filtro de componente por string não encontrada', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
            Componente.findOne.mockResolvedValue(null);
            await builder.comComponente('capacitor');
            expect(builder.build()).toEqual({ componente: { $in: [] } });
        });
        it('não deve adicionar filtro se valor for vazio', async () => {
            const builder = new MovimentacaoFilterBuilder();
            await builder.comComponente('');
            expect(builder.build()).toEqual({});
        });
    });

    describe('comFornecedor', () => {
        it('deve adicionar filtro de fornecedor por ObjectId válido e encontrado', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
            Fornecedor.findById.mockResolvedValue({ _id: 'f1' });
            await builder.comFornecedor('f1');
            expect(builder.build()).toEqual({ fornecedor: 'f1' });
        });
        it('deve adicionar filtro de fornecedor por ObjectId válido e não encontrado', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
            Fornecedor.findById.mockResolvedValue(null);
            await builder.comFornecedor('f1');
            expect(builder.build()).toEqual({ fornecedor: { $in: [] } });
        });
        it('deve adicionar filtro de fornecedor por string encontrada', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
            Fornecedor.findOne.mockResolvedValue({ _id: 'f2' });
            await builder.comFornecedor('fornecedorX');
            expect(builder.build()).toEqual({ fornecedor: 'f2' });
        });
        it('deve adicionar filtro de fornecedor por string não encontrada', async () => {
            const builder = new MovimentacaoFilterBuilder();
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
            Fornecedor.findOne.mockResolvedValue(null);
            await builder.comFornecedor('fornecedorY');
            expect(builder.build()).toEqual({ fornecedor: { $in: [] } });
        });
        it('não deve adicionar filtro se valor for vazio', async () => {
            const builder = new MovimentacaoFilterBuilder();
            await builder.comFornecedor('');
            expect(builder.build()).toEqual({});
        });
    });
});