import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { PermissoesArraySchema } from '../utils/validators/schemas/zod/PermissaoValidation.js';
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

    // // Adiciona permissões a um usuário.

    // async adicionarPermissoes(req) {
    //     const parsedPermissoes = PermissoesArraySchema.parse(req.body.permissoes);
    //     const result = await this.repository.adicionarPermissoes(req.params.id, parsedPermissoes);
    //     return result;
    // }

    // Remove uma permissão de um usuário.

    async removerPermissao(usuarioId, permissaoId) {
        const result = await this.repository.removerPermissao(usuarioId, permissaoId);
        return result;
    }

    // Atualiza as permissões de um usuário.

    async atualizarPermissoes(usuarioId, permissoesData) {
        const parsedData = PermissoesArraySchema.parse(permissoesData);
        const result = await this.repository.atualizarPermissoes(usuarioId, parsedData);
        return result;
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

    // Valida o array de permissões.

    // async validatePermissions(permissoes) {
    //     // Se permissoes não for um array, define como array vazio
    //     if (!Array.isArray(permissoes)) {
    //         permissoes = [];
    //     }

    //     if (permissoes.length > 0) {
    //         PermissoesArraySchema.parse(permissoes);
    //     }

    //     const permissoesExistentes = await this.repository.buscarPorPermissao(permissoes);

    //     if (permissoesExistentes.length !== permissoes.length) {
    //         throw new CustomError({
    //             statusCode: 400,
    //             errorType: 'validationError',
    //             field: 'permissoes',
    //             details: [{ path: 'permissoes', message: 'Permissões inválidas.' }],
    //             customMessage: 'Permissões inválidas.',
    //         });
    //     }

    //     return permissoesExistentes;
    // }

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