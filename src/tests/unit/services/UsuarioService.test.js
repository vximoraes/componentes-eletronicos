import UsuarioService from '../../../services/UsuarioService.js';
import UsuarioRepository from '../../../repositories/UsuarioRepository.js';
import bcrypt from 'bcrypt';

jest.mock('../../../repositories/UsuarioRepository.js');
jest.mock('bcrypt');

describe('UsuarioService', () => {
    let service;
    let repositoryMock;

    beforeEach(() => {
        UsuarioRepository.mockClear();
        repositoryMock = {
            criar: jest.fn(),
            listar: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
            buscarPorEmail: jest.fn(),
            buscarPorId: jest.fn(),
        };
        UsuarioRepository.mockImplementation(() => repositoryMock);
        service = new UsuarioService();
    });    describe('criar', () => {
        it('deve criar usuário com senha criptografada', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('senha_criptografada');
            repositoryMock.criar.mockResolvedValue({ _id: '1', nome: 'Teste', email: 'a@a.com', senha: 'senha_criptografada', ativo: false });
            const data = await service.criar({ nome: 'Teste', email: 'a@a.com', senha: '123' });
            expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
            expect(data.senha).toBe('senha_criptografada');
            expect(data.ativo).toBe(false);
        });        it('deve criar usuário sem senha quando não fornecida', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValue(null);
            repositoryMock.criar.mockResolvedValue({ _id: '1', nome: 'Teste', email: 'a@a.com', ativo: false });

            bcrypt.hash.mockClear();
            
            const data = await service.criar({ nome: 'Teste', email: 'a@a.com', senha: null });
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(data).toHaveProperty('_id');
        });

        it('deve criar usuário quando senha é undefined', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValue(null);
            repositoryMock.criar.mockResolvedValue({ _id: '1', nome: 'Teste', email: 'a@a.com', ativo: false });
            
            bcrypt.hash.mockClear();

            const userData = { nome: 'Teste', email: 'a@a.com' };
            const data = await service.criar(userData);
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(data).toHaveProperty('_id');
        });

        it('deve lançar erro se e-mail já existir', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValue({ _id: '1', email: 'a@a.com' });
            await expect(service.criar({ nome: 'Teste', email: 'a@a.com', senha: '123' }))
                .rejects.toThrow('Email já está em uso.');
        });

        it('deve lançar erro se bcrypt falhar', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValue(null);
            bcrypt.hash.mockRejectedValue(new Error('bcrypt error'));
            await expect(service.criar({ nome: 'Teste', email: 'a@a.com', senha: '123' }))
                .rejects.toThrow('bcrypt error');
        });
    });

    describe('listar', () => {
        it('deve retornar todos os usuários', async () => {
            repositoryMock.listar.mockResolvedValue([{ _id: '1', nome: 'Teste' }]);
            const data = await service.listar({});
            expect(data).toEqual([{ _id: '1', nome: 'Teste' }]);
        });
    });

    describe('atualizar', () => {
        it('deve atualizar usuário existente, exceto email e senha', async () => {
            repositoryMock.buscarPorId.mockResolvedValue({ _id: '1', nome: 'Teste', email: 'a@a.com', senha: '123' });
            repositoryMock.atualizar.mockResolvedValue({ _id: '1', nome: 'Novo Nome', email: 'a@a.com', senha: '123' });
            const data = await service.atualizar('1', { nome: 'Novo Nome', email: 'novo@a.com', senha: 'nova' });
            expect(repositoryMock.atualizar).toHaveBeenCalledWith('1', { nome: 'Novo Nome' });
            expect(data.nome).toBe('Novo Nome');
            expect(data.email).toBe('a@a.com');
        });

        it('deve lançar erro se usuário não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.atualizar('1', { nome: 'Novo' }))
                .rejects.toThrow('Usuário não encontrado(a).');
        });
    });

    describe('deletar', () => {
        it('deve deletar usuário existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue({ _id: '1' });
            repositoryMock.deletar.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
            const data = await service.deletar('1');
            expect(repositoryMock.deletar).toHaveBeenCalledWith('1');
            expect(data).toEqual({ acknowledged: true, deletedCount: 1 });
        });

        it('deve lançar erro se usuário não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.deletar('1')).rejects.toThrow('Usuário não encontrado(a).');
        });
    });

    describe('validateEmail', () => {
        it('deve lançar erro se e-mail já estiver em uso', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValue({ _id: '1', email: 'a@a.com' });
            await expect(service.validateEmail('a@a.com')).rejects.toThrow('Email já está em uso.');
        });
        it('não deve lançar erro se e-mail for único', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValue(null);
            await expect(service.validateEmail('b@b.com')).resolves.toBeUndefined();
        });
    });

    describe('ensureUserExists', () => {
        it('deve lançar erro se usuário não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.ensureUserExists('1')).rejects.toThrow('Usuário não encontrado(a).');
        });
        it('deve retornar usuário se existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue({ _id: '1', nome: 'Teste' });
            const user = await service.ensureUserExists('1');
            expect(user).toEqual({ _id: '1', nome: 'Teste' });
        });
    });

    describe('unicidade de e-mail', () => {
        it('deve impedir cadastro de dois usuários com o mesmo e-mail', async () => {
            repositoryMock.buscarPorEmail.mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '1', email: 'a@a.com' });
            bcrypt.hash.mockResolvedValue('senha_criptografada');
            repositoryMock.criar.mockResolvedValue({ _id: '1', nome: 'Teste', email: 'a@a.com', senha: 'senha_criptografada', ativo: false });
            await service.criar({ nome: 'Teste', email: 'a@a.com', senha: '123' });
            await expect(service.criar({ nome: 'Outro', email: 'a@a.com', senha: '456' }))
                .rejects.toThrow('Email já está em uso.');
        });
    });

    describe('proibição de update de email e senha', () => {
        it('deve ignorar alterações em email e senha no update', async () => {
            repositoryMock.buscarPorId.mockResolvedValue({ _id: '1', nome: 'Teste', email: 'a@a.com', senha: '123' });
            repositoryMock.atualizar.mockResolvedValue({ _id: '1', nome: 'Novo Nome', email: 'a@a.com', senha: '123' });
            const data = await service.atualizar('1', { nome: 'Novo Nome', email: 'novo@a.com', senha: 'nova' });
            expect(repositoryMock.atualizar).toHaveBeenCalledWith('1', { nome: 'Novo Nome' });
            expect(data.email).toBe('a@a.com');
            expect(data.senha).toBe('123');
        });
    });

    describe('erro inesperado do repository', () => {
        it('deve lançar erro se o repository lançar exceção', async () => {
            repositoryMock.buscarPorEmail.mockRejectedValue(new Error('erro repo'));
            await expect(service.criar({ nome: 'Teste', email: 'a@a.com', senha: '123' }))
                .rejects.toThrow('erro repo');
        });
    });
});