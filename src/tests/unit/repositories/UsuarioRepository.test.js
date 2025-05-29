import UsuarioRepository from '../../../repositories/UsuarioRepository.js';
import UsuarioModel from '../../../models/Usuario.js';
import NotificacaoModel from '../../../models/Notificacao.js';
import { messages, CustomError } from '../../../utils/helpers/index.js';

jest.mock('../../../models/Usuario.js');
jest.mock('../../../models/Notificacao.js');

const makeFakeUser = (overrides = {}) => ({
    _id: 'user123',
    nome: 'Usuário Teste',
    email: 'teste@email.com',
    senha: 'senha123',
    ativo: false,
    ...overrides,
    toObject: function () { return { ...this }; }
});

describe('UsuarioRepository', () => {
    let repo;
    beforeEach(() => {
        repo = new UsuarioRepository({ usuarioModel: UsuarioModel });
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve criar usuário com sucesso', async () => {
            const fakeUser = makeFakeUser();
            UsuarioModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(fakeUser) }));
            const result = await repo.criar(fakeUser);
            expect(result).toEqual(fakeUser);
        });
    });

    describe('listar', () => {
        it('deve retornar usuário por id', async () => {
            const req = { params: { id: 'user123' } };
            UsuarioModel.findById = jest.fn().mockResolvedValue(makeFakeUser());
            const result = await repo.listar(req);
            expect(result._id).toBe('user123');
        });

        it('deve lançar erro 404 se usuário não encontrado', async () => {
            const req = { params: { id: 'notfound' } };
            UsuarioModel.findById = jest.fn().mockResolvedValue(null);
            await expect(repo.listar(req)).rejects.toThrow(CustomError);
        });

        it('deve listar usuários com filtros', async () => {
            const req = { params: {}, query: { nome: 'Usuário', email: '', ativo: '', page: 1, limite: 10 } };
            UsuarioModel.paginate = jest.fn().mockResolvedValue({ docs: [makeFakeUser()], total: 1 });
            const result = await repo.listar(req);
            expect(result.docs.length).toBeGreaterThan(0);
        });

        it('deve lançar erro 500 se filterBuilder.build não for função', async () => {
            jest.resetModules();
            jest.doMock('../../../repositories/filters/UsuarioFilterBuilder.js', () => {
                return jest.fn().mockImplementation(() => ({
                    comNome: jest.fn().mockReturnThis(),
                    comEmail: jest.fn().mockReturnThis(),
                    comAtivo: jest.fn().mockReturnThis(),
                }));
            });
            const { default: UsuarioRepositoryMocked } = await import('../../../repositories/UsuarioRepository.js');
            const repoMocked = new UsuarioRepositoryMocked({ usuarioModel: UsuarioModel });
            const req = { params: {}, query: { nome: 'X', email: '', ativo: '', page: 1, limite: 10 } };
            await expect(repoMocked.listar(req)).rejects.toThrow('Erro interno no servidor ao processar Usuário.');
            jest.dontMock('../../../repositories/filters/UsuarioFilterBuilder.js');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar usuário existente', async () => {
            const leanMock = jest.fn().mockResolvedValue({ ...makeFakeUser(), nome: 'Novo Nome' });
            UsuarioModel.findByIdAndUpdate = jest.fn(() => ({ lean: leanMock }));
            const result = await repo.atualizar('user123', { nome: 'Novo Nome' });
            expect(result.nome).toBe('Novo Nome');
        });
        it('deve lançar erro 404 se usuário não encontrado', async () => {
            const leanMock = jest.fn().mockResolvedValue(null);
            UsuarioModel.findByIdAndUpdate = jest.fn(() => ({ lean: leanMock }));
            await expect(repo.atualizar('notfound', { nome: 'X' })).rejects.toThrow(CustomError);
        });
    });

    describe('deletar', () => {
        it('deve deletar usuário sem vínculo', async () => {
            NotificacaoModel.exists = jest.fn().mockResolvedValue(false);
            UsuarioModel.findByIdAndDelete = jest.fn().mockResolvedValue(makeFakeUser());
            const result = await repo.deletar('user123');
            expect(result._id).toBe('user123');
        });
        it('deve proibir deleção se houver vínculo com notificações', async () => {
            NotificacaoModel.exists = jest.fn().mockResolvedValue(true);
            await expect(repo.deletar('user123')).rejects.toThrow(CustomError);
        });
    });

    describe('buscarPorEmail', () => {
        it('deve buscar usuário por e-mail', async () => {
            UsuarioModel.findOne = jest.fn().mockResolvedValue(makeFakeUser());
            const result = await repo.buscarPorEmail('teste@email.com');
            expect(result.email).toBe('teste@email.com');
        });
        it('deve retornar null se e-mail não encontrado', async () => {
            UsuarioModel.findOne = jest.fn().mockResolvedValue(null);
            const result = await repo.buscarPorEmail('naoexiste@email.com');
            expect(result).toBeNull();
        });
        it('deve ignorar id informado', async () => {
            UsuarioModel.findOne = jest.fn().mockResolvedValue(makeFakeUser());
            await repo.buscarPorEmail('teste@email.com', 'ignoreid');
            expect(UsuarioModel.findOne).toHaveBeenCalledWith({ email: 'teste@email.com', _id: { $ne: 'ignoreid' } }, '+senha');
        });
    });

    describe('buscarPorId', () => {
        it('deve buscar usuário por id', async () => {
            UsuarioModel.findById = jest.fn().mockResolvedValue(makeFakeUser());
            const result = await repo.buscarPorId('user123');
            expect(result._id).toBe('user123');
        });
        it('deve lançar erro 404 se usuário não encontrado', async () => {
            UsuarioModel.findById = jest.fn().mockResolvedValue(null);
            await expect(repo.buscarPorId('notfound')).rejects.toThrow(CustomError);
        });
    });
});