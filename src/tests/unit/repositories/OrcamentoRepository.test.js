import OrcamentoRepository from '../../../repositories/OrcamentoRepository.js';

function MockModel(data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
    this.toObject = jest.fn().mockReturnValue(this);
}
MockModel.findById = jest.fn();
MockModel.findByIdAndUpdate = jest.fn();
MockModel.findByIdAndDelete = jest.fn();
MockModel.findOne = jest.fn();
MockModel.paginate = jest.fn();

function withLean(obj) {
    return { ...obj, lean: () => obj };
}

describe('OrcamentoRepository', () => {
    let repository;

    beforeEach(() => {
        MockModel.findById.mockReset();
        MockModel.findByIdAndUpdate.mockReset();
        MockModel.findByIdAndDelete.mockReset();
        MockModel.findOne.mockReset();
        MockModel.paginate.mockReset();
        repository = new OrcamentoRepository({ orcamentoModel: MockModel });
    });

    it('deve cadastrar orçamento e retornar salvo', async () => {
        const fakeOrcamento = new MockModel({ _id: 'id' });
        fakeOrcamento.save.mockResolvedValue(fakeOrcamento);
        MockModel.findById.mockResolvedValue(fakeOrcamento);
        const result = await repository.criar({ nome: 'Teste' });
        expect(result).toBe(fakeOrcamento);
    });

    it('deve listar orçamento por id', async () => {
        const fake = { _id: 'id', toObject: () => ({ _id: 'id' }) };
        MockModel.findById.mockResolvedValue(fake);
        const req = { params: { id: 'id' } };
        const result = await repository.listar(req);
        expect(result._id).toBe('id');
    });

    it('deve lançar erro 404 ao listar por id inexistente', async () => {
        MockModel.findById.mockResolvedValue(null);
        const req = { params: { id: 'id' } };
        await expect(repository.listar(req)).rejects.toThrow('não encontrado');
    });

    it('deve listar todos os orçamentos com paginação', async () => {
        MockModel.paginate.mockResolvedValue({ docs: [{ toObject: () => ({ _id: 'id' }) }] });
        const req = { query: {}, params: {} };
        const result = await repository.listar(req);
        expect(Array.isArray(result.docs)).toBe(true);
    });

    it('deve atualizar orçamento existente', async () => {
        MockModel.findByIdAndUpdate.mockReturnValue(withLean({ _id: 'id' }));
        const result = await repository.atualizar('id', { nome: 'Novo' });
        expect(result._id).toBe('id');
    });

    it('deve lançar erro ao atualizar orçamento inexistente', async () => {
        MockModel.findByIdAndUpdate.mockReturnValue({});
        await expect(repository.atualizar('id', { nome: 'Novo' })).rejects.toThrow();
    });

    it('deve deletar orçamento existente', async () => {
        MockModel.findById.mockResolvedValue({ _id: 'id' });
        MockModel.findByIdAndDelete.mockResolvedValue({ _id: 'id' });
        const result = await repository.deletar('id');
        expect(result._id).toBe('id');
    });

    it('deve lançar erro ao deletar orçamento inexistente', async () => {
        MockModel.findById.mockResolvedValue(null);
        await expect(repository.deletar('id')).rejects.toThrow('não encontrado');
    });

    it('deve adicionar componente', async () => {
        const fake = { _id: 'id', componentes: [], save: jest.fn(), toObject: () => ({ _id: 'id', componentes: [] }) };
        MockModel.findById.mockResolvedValue(fake);
        fake.save.mockResolvedValue(fake);
        const result = await repository.adicionarComponente('id', { nome: 'C' });
        expect(result._id).toBe('id');
    });

    it('deve lançar erro ao adicionar componente em orçamento inexistente', async () => {
        MockModel.findById.mockResolvedValue(null);
        await expect(repository.adicionarComponente('id', { nome: 'C' })).rejects.toThrow('não encontrado');
    });

    it('deve atualizar componente', async () => {
        const comp = { _id: 'cid', toObject: () => ({ _id: 'cid' }) };
        const fake = { _id: 'id', componentes: [comp], save: jest.fn() };
        MockModel.findById.mockResolvedValue(fake);
        fake.save.mockResolvedValue(fake);
        const result = await repository.atualizarComponente('id', 'cid', { nome: 'Novo' });
        expect(result._id).toBe('id');
    });

    it('deve lançar erro ao atualizar componente inexistente', async () => {
        const fake = { _id: 'id', componentes: [{ _id: 'other' }] };
        MockModel.findById.mockResolvedValue(fake);
        await expect(repository.atualizarComponente('id', 'cid', { nome: 'Novo' })).rejects.toThrow('Componente não encontrado');
    });

    it('deve remover componente', async () => {
        const comp = { _id: 'cid', subtotal: 1 };
        const fake = { _id: 'id', componentes: [comp], save: jest.fn() };
        MockModel.findById.mockResolvedValue(fake);
        fake.save.mockResolvedValue(fake);
        const result = await repository.removerComponente('id', 'cid');
        expect(result._id).toBe('id');
    });

    it('deve lançar erro ao remover componente de orçamento inexistente', async () => {
        MockModel.findById.mockResolvedValue(null);
        await expect(repository.removerComponente('id', 'cid')).rejects.toThrow('não encontrado');
    });

    it('deve buscar por id', async () => {
        const fake = { _id: 'id' };
        MockModel.findById.mockResolvedValue(fake);
        const result = await repository.buscarPorId('id');
        expect(result._id).toBe('id');
    });

    it('deve lançar erro ao buscar por id inexistente', async () => {
        MockModel.findById.mockResolvedValue(null);
        await expect(repository.buscarPorId('id')).rejects.toThrow('não encontrado');
    });

    it('deve buscar por protocolo', async () => {
        const fake = { _id: 'id' };
        MockModel.findOne.mockResolvedValue(fake);
        const result = await repository.buscarPorProtocolo('P123');
        expect(result._id).toBe('id');
    });

    it('deve retornar null se protocolo não existe', async () => {
        MockModel.findOne.mockResolvedValue(null);
        const result = await repository.buscarPorProtocolo('P123');
        expect(result).toBeNull();
    });
});