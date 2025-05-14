import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../utils/validators/schemas/zod/UsuarioSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import AuthHelper from '../utils/AuthHelper.js';

class UsuarioService {
    constructor() {
        this.repository = new UsuarioRepository();
    }

    // Lista usuários. Se um objeto de request é fornecido (com query, por exemplo), retorna os usuários conforme os filtros.

    async listar(req) {
        console.log('Estou no listar em UsuarioService');
        const data = await this.repository.listar(req);
        console.log('Estou retornando os dados em UsuarioService');
        return data;
    }

    // Cria um novo usuário após validação dos dados.

    async criar(parsedData) {
        console.log('Estou no criar em UsuarioService');

        await this.validateEmail(parsedData.email);

        console.log('Estou validando o schema em UsuarioService');

        if (parsedData.senha) {
            const saltRounds = 10;
            parsedData.senha = await bcrypt.hash(parsedData.senha, saltRounds);
        }

        console.log('Estou processando o schema em UsuarioService' + parsedData);

        const data = await this.repository.criar(parsedData);

        return data;
    }

    // Atualiza um usuário existente.
    // Atenção: É proibido alterar o email. No serviço o objeto sempre chegará sem, pois o controller impedirá.

    async atualizar(id, parsedData) {
        console.log('Estou no atualizar em UsuarioService');

        /**
          * REGRA DE NEGÓCIO
        */

        // if (!parsedData.ativo) {
        //     // Gerar um novo objeto com tokens nulos se o user estiver sendo desativado
        //     parsedData.accesstoken = null
        //     parsedData.refreshtoken = null
        // }

        // Senha nunca deve ser atualizada
        delete parsedData.senha;
        delete parsedData.email;

        // Garante que o usuário existe
        await this.ensureUserExists(id);

        // Se forem informadas permissões, valida-as
        // if (parsedData.permissoes) {
        //     parsedData.permissoes = await this.validatePermissions(parsedData.permissoes);
        // }

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    // Deleta um usuário existente.

    async deletar(id) {
        console.log('Estou no deletar em UsuarioService');

        await this.ensureUserExists(id);

        const data = await this.repository.deletar(id);
        return data;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // MÉTODOS AUXILIARES
    ////////////////////////////////////////////////////////////////////////////////

    // Valida a unicidade do email.

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
        }
    }

    // Garante que o usuário existe.

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
        }
        return usuarioExistente;
    }
}

export default UsuarioService;