import NotificacaoRepository from '../../../repositories/NotificacaoRepository.js';
import NotificacaoModel from '../../../models/Notificacao.js';
import UsuarioModel from '../../../models/Usuario.js';
import { CustomError } from '../../../utils/helpers/index.js';

jest.mock('../../../models/Notificacao.js');
jest.mock('../../../models/Usuario.js');

const usuarioId = '507f1f77bcf86cd799439011';

describe('NotificacaoRepository', () => {
    let repository;
    beforeEach(() => {
        repository = new NotificacaoRepository({ notificacaoModel: NotificacaoModel });
        jest.clearAllMocks();
    });

    it('deve buscar notificações por usuário', async () => {
        NotificacaoModel.paginate = jest.fn().mockResolvedValue({ docs: [{ usuario: usuarioId }] });
        const result = await repository.listar({ query: { usuario: usuarioId } });
        expect(NotificacaoModel.paginate).toHaveBeenCalled();
        expect(result.docs[0].usuario).toBe(usuarioId);
    });

    it('deve buscar notificação por id', async () => {
        NotificacaoModel.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue({ _id: 'id1' }) });
        const result = await repository.buscarPorId('id1');
        expect(result._id).toBe('id1');
    });

    it('deve aplicar filtros de busca', async () => {
        NotificacaoModel.paginate = jest.fn().mockResolvedValue({ docs: [{ visualizada: false }] });
        const result = await repository.listar({ query: { visualizada: false } });
        expect(NotificacaoModel.paginate).toHaveBeenCalled();
        expect(result.docs[0].visualizada).toBe(false);
    });

    it('deve retornar notificações paginadas', async () => {
        NotificacaoModel.paginate = jest.fn().mockResolvedValue({ docs: [], totalDocs: 0, page: 1 });
        const result = await repository.listar({ query: { page: 1, limite: 10 } });
        expect(result.page).toBe(1);
        expect(result.docs).toBeDefined();
    });

    it('deve lançar erro ao cadastrar notificação com usuário inexistente', async () => {
        UsuarioModel.exists = jest.fn().mockResolvedValue(false);
        await expect(repository.criar({ mensagem: 'Teste', usuario: usuarioId })).rejects.toThrow('Usuário informado não existe.');
    });

    it('deve cadastrar notificação com tipos errados (mensagem numérica)', async () => {
        UsuarioModel.exists = jest.fn().mockResolvedValue(true);
        NotificacaoModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'id1', mensagem: '12345', usuario: usuarioId });
        NotificacaoModel.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue({ _id: 'id1', mensagem: '12345', usuario: usuarioId }) });
        const result = await repository.criar({ mensagem: 12345, usuario: usuarioId });
        expect(result.mensagem).toBe('12345');
    });

    it('deve lançar erro ao buscar notificação inexistente', async () => {
        NotificacaoModel.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
        await expect(repository.buscarPorId('id_inexistente')).rejects.toThrow('Notificação não encontrado(a).');
    });

    it('deve lançar erro ao atualizar notificação inexistente', async () => {
        NotificacaoModel.findByIdAndUpdate = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
        await expect(repository._atualizar('id_inexistente', { visualizada: true })).rejects.toThrow('Notificação não encontrado(a).');
    });

    it('deve lançar erro do banco em qualquer operação', async () => {
        NotificacaoModel.paginate = jest.fn().mockRejectedValue(new Error('Falha banco'));
        await expect(repository.listar({})).rejects.toThrow('Falha banco');
    });
});
