import bcrypt from 'bcrypt';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import GrupoRepository from '../repositories/GrupoRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
// import AuthHelper from '../utils/AuthHelper.js';

class UsuarioService {
    constructor() {
        this.repository = new UsuarioRepository();
        this.grupoRepository = new GrupoRepository();
    };

    async criar(parsedData) {
        await this.validateEmail(parsedData.email);

        if (parsedData.senha) {
            const saltRounds = 10;
            parsedData.senha = await bcrypt.hash(parsedData.senha, saltRounds);
        };

        // Buscar grupo "Usuario" padrão se não foram fornecidas permissões
        if (!parsedData.permissoes || parsedData.permissoes.length === 0) {
            try {
                const grupoUsuario = await this.grupoRepository.buscarPorNome("Usuario");
                if (grupoUsuario) {
                    parsedData.permissoes = grupoUsuario.permissoes || [];
                }
            } catch (error) {
                // Se não conseguir buscar o grupo, continua sem definir permissões padrão
                console.warn('Não foi possível buscar o grupo "Usuario" padrão:', error.message);
            }
        }

        const data = await this.repository.criar(parsedData);

        return data;
    };

    async listar(req) {
        const data = await this.repository.listar(req);

        return data;
    };

    async atualizar(id, parsedData) {
        delete parsedData.senha;
        delete parsedData.email; // É proibido alterar o email. No service o objeto sempre chegará sem, pois o controller impedirá.

        await this.ensureUserExists(id);

        const data = await this.repository.atualizar(id, parsedData);

        return data;
    };

    async deletar(id) {
        await this.ensureUserExists(id);

        const data = await this.repository.deletar(id);

        return data;
    };

    // Métodos auxiliares.

    async validateEmail(email, id = null) {
        const usuarioExistente = await this.repository.buscarPorEmail(email, id);
        if (usuarioExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'email',
                details: [{ path: 'email', message: 'Email já está em uso.' }],
                customMessage: 'Email já está em uso.',
            });
        };
    };

    async ensureUserExists(id) {
        const usuarioExistente = await this.repository.buscarPorId(id);
        if (!usuarioExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuário'),
            });
        };

        return usuarioExistente;
    };
};

export default UsuarioService;