import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import tokenUtil from '../utils/TokenUtil.js';
import { v4 as uuid } from 'uuid';

import UsuarioRepository from '../repositories/UsuarioRepository.js';
import AuthRepository from '../repositories/AuthRepository.js';

class AuthService {
    constructor({ tokenUtil: injectedTokenUtil, usuarioRepository, authRepository } = {}) {
        // Se nada for injetado, usa a instância importada
        this.TokenUtil = injectedTokenUtil || tokenUtil;
        this.usuarioRepository = usuarioRepository || new UsuarioRepository();
        this.repository = authRepository || new AuthRepository();
    };

    async carregatokens(id, token) {
        const data = await this.usuarioRepository.buscarPorId(id, { includeTokens: true });
        return { data };
    };

    async revoke(id) {
        const data = await this.repository.removeToken(id);
        return { data };
    };

    async logout(id, token) {
        const data = await this.repository.removeToken(id);
        return { data };
    };

    async login(body) {
        console.log('Estou no logar em AuthService');

        // Buscar o usuário pelo email
        const userEncontrado = await this.usuarioRepository.buscarPorEmail(body.email);
        if (!userEncontrado) {

            /**
             * Se o usuário não for encontrado, lança um erro personalizado
             * É importante para bibliotecas de requisições como DIO, Retrofit, Axios, etc. que o 
             * statusCode seja 401, pois elas tratam esse código como não autorizado
             * Isso é importante para que o usuário saiba que o email ou senha estão incorretos
             * Se o statusCode for 404, a biblioteca não irá tratar como não autorizado
             * Portanto, é importante que o statusCode seja 401
            */
            throw new CustomError({
                statusCode: 401,
                errorType: 'notFound',
                field: 'Email',
                details: [],
                customMessage: messages.error.unauthorized('Senha ou Email')
            });
        };

        // Validar a senha
        const senhaValida = await bcrypt.compare(body.senha, userEncontrado.senha);
        if (!senhaValida) {
            throw new CustomError({
                statusCode: 401,
                errorType: 'unauthorized',
                field: 'Senha',
                details: [],
                customMessage: messages.error.unauthorized('Senha ou Email')
            });
        };

        // Gerar novo access token utilizando a instância injetada
        const accesstoken = await this.TokenUtil.generateAccessToken(userEncontrado._id);

        // Buscar o usuário com os tokens já armazenados
        const userComTokens = await this.usuarioRepository.buscarPorId(userEncontrado._id, true);
        let refreshtoken = userComTokens.refreshtoken;
        console.log("refresh token no banco", refreshtoken);

        if (refreshtoken) {
            try {
                jwt.verify(refreshtoken, process.env.JWT_SECRET);
            } catch (error) {
                if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                    refreshtoken = await this.TokenUtil.generateRefreshToken(userEncontrado._id);
                } else {
                    throw new CustomError({
                        statusCode: 500,
                        errorType: 'serverError',
                        field: 'Token',
                        details: [],
                        customMessage: messages.error.unauthorized('falha na geração do token')
                    });
                }
            }
        } else {
            // Se o refresh token não existe, gera um novo
            refreshtoken = await this.TokenUtil.generateRefreshToken(userEncontrado._id);
        };

        console.log("refresh token gerado", refreshtoken);

        // Armazenar os tokens atualizados
        await this.repository.armazenarTokens(userEncontrado._id, accesstoken, refreshtoken);

        // Buscar novamente o usuário e remover a senha
        const userLogado = await this.usuarioRepository.buscarPorEmail(body.email);
        delete userLogado.senha;
        const userObjeto = userLogado.toObject();

        // Retornar o usuário com os tokens
        return { user: { accesstoken, refreshtoken, ...userObjeto } };
    };


    async recuperaSenha(body) {
        console.log('Estou no logar em RecuperaSenhaService');
        const userEncontrado = await this.usuarioRepository.buscarPorEmail(body.email);

        if (!userEncontrado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Email',
                details: [],
                customMessage: HttpStatusCodes.NOT_FOUND.message
            });
        };

        return { message: "Solicitação de recuperação de senha recebida, um email será enviado com as instruções para recuperação de senha" };
    };

    async refresh(id, token) {
        const userEncontrado = await this.usuarioRepository.buscarPorId(id, { includeTokens: true });

        if (!userEncontrado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Token',
                details: [],
                customMessage: HttpStatusCodes.NOT_FOUND.message
            });
        };

        console.log("refresh token no banco", userEncontrado.refreshtoken);
        console.log("refresh token recebido", token);

        if (userEncontrado.refreshtoken !== token) {
            console.log('Token inválido');
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'invalidToken',
                field: 'Token',
                details: [],
                customMessage: messages.error.unauthorized('Token')
            });
        } else {
            console.log('Token válido');
        };

        // Gerar novo access token utilizando a instância injetada
        const accesstoken = await this.TokenUtil.generateAccessToken(id);

        /**
         * Se SINGLE_SESSION_REFRESH_TOKEN for true, gera um novo refresh token
         * Senão, mantém o token armazenado
         */
        let refreshtoken = '';
        if (process.env.SINGLE_SESSION_REFRESH_TOKEN === 'true') {
            refreshtoken = await this.TokenUtil.generateRefreshToken(id);
        } else {
            refreshtoken = userEncontrado.refreshtoken;
        };

        await this.repository.armazenarTokens(id, accesstoken, refreshtoken);

        // Atualiza o usuário com os novos tokens
        const userLogado = await this.usuarioRepository.buscarPorId(id, { includeTokens: true });
        delete userLogado.senha;
        const userObjeto = userLogado.toObject();

        const userComTokens = {
            accesstoken,
            refreshtoken,
            ...userObjeto
        };

        return { user: userComTokens };
    };
};

export default AuthService;