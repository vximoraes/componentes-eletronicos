// /src/services/AuthService.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import tokenUtil from '../utils/TokenUtil.js';
import { v4 as uuid } from 'uuid';
import SendMail from '../utils/SendMail.js';
import TokenUtil from '../utils/TokenUtil.js';
import AuthHelper from '../utils/AuthHelper.js';

import UsuarioRepository from '../repositories/UsuarioRepository.js';
import AuthRepository from '../repositories/AuthRepository.js';

class AuthService {
    constructor({ tokenUtil: injectedTokenUtil, usuarioRepository, authRepository } = {}) {
        // Se nada for injetado, usa a instância importada
        this.TokenUtil = injectedTokenUtil || tokenUtil;
        this.usuarioRepository = usuarioRepository || new UsuarioRepository();
        this.repository = authRepository || new AuthRepository();
    }

    async carregatokens(id, token) {
        const data = await this.usuarioRepository.buscarPorId(id, { includeTokens: true });
        return { data };
    }

    async revoke(id) {
        const data = await this.repository.removeToken(id);
        return { data };
    }

    async logout(id, token) {
        const data = await this.repository.removeToken(id);
        return { data };
    }

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
        }

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
        }

        // Gerar novo access token utilizando a instância injetada
        const accesstoken = await this.TokenUtil.generateAccessToken(userEncontrado._id);

        // Buscar o usuário com os tokens já armazenados
        const userComTokens = await this.usuarioRepository.buscarPorId(userEncontrado._id, true);
        let refreshtoken = userComTokens.refreshtoken;
        console.log("refresh token no banco", refreshtoken);

        if (refreshtoken) {
            try {
                jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH_TOKEN);
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
        }

        console.log("refresh token gerado", refreshtoken);

        // Armazenar os tokens atualizados
        await this.repository.armazenarTokens(userEncontrado._id, accesstoken, refreshtoken);

        // Buscar novamente o usuário e remover a senha
        const userLogado = await this.usuarioRepository.buscarPorEmail(body.email);
        delete userLogado.senha;
        const userObjeto = userLogado.toObject();

        // Retornar o usuário com os tokens
        return { user: { accesstoken, refreshtoken, ...userObjeto } };
    }


    // RecuperaSenhaService.js
    async recuperaSenha(req, body) {
        console.log('Estou em RecuperaSenhaService');

        // ───────────────────────────────────────────────
        // Passo 1 – Buscar usuário pelo e-mail informado
        // ───────────────────────────────────────────────
        const userEncontrado = await this.usuarioRepository.buscarPorEmail(body.email);

        // Se não encontrar, lança erro 404
        if (!userEncontrado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Email',
                details: [],
                customMessage: HttpStatusCodes.NOT_FOUND.message
            });
        }

        // ───────────────────────────────────────────────
        // Passo 2 – Gerar código de verificação (4 carac.)
        // ───────────────────────────────────────────────
        const generateCode = () => Math.random()
            .toString(36)              // ex: “0.f5g9hk3j”
            .replace(/[^a-z0-9]/gi, '') // mantém só letras/números
            .slice(0, 4)               // pega os 4 primeiros
            .toUpperCase();            // converte p/ maiúsculas

        let codigoRecuperaSenha = generateCode();

        // ───────────────────────────────────────────────
        // Passo 3 – Garantir unicidade do código gerado 
        // ───────────────────────────────────────────────
        let codigoExistente =
            await this.usuarioRepository.buscarPorPorCodigoRecuperacao(codigoRecuperaSenha);
        console.log('Código existente:', codigoExistente);

        while (codigoExistente) {
            console.log('Código já existe, gerando um novo código');
            codigoRecuperaSenha = generateCode();
            codigoExistente =
                await this.usuarioRepository.buscarPorPorCodigoRecuperacao(codigoRecuperaSenha);
        }
        console.log('Código gerado:', codigoRecuperaSenha);

        // ───────────────────────────────────────────────
        // Passo 4 – Gerar token único (JWT) p/ recuperação
        // ───────────────────────────────────────────────
        console.log('Gerando token único para recuperação de senha');
        const tokenUnico =
            await this.TokenUtil.generatePasswordRecoveryToken(userEncontrado._id);

        // ───────────────────────────────────────────────
        // Passo 5 – Persistir token + código no usuário
        // ───────────────────────────────────────────────
        const expMs = Date.now() + 60 * 60 * 1000; // 1 hora de expiração
        const data = await this.usuarioRepository.atualizar(userEncontrado._id, {
            tokenUnico,
            codigo_recupera_senha: codigoRecuperaSenha,
            exp_codigo_recupera_senha: new Date(expMs).toISOString() // Armazenar expiração como string ISO TMZ0 Ex.: 2023-10-01T12:00:00.000Z
        });

        if (!data) {
            // Falha ao atualizar → erro 500
            throw new CustomError({
                statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
                field: 'Recuperação de Senha',
                details: [],
                customMessage: HttpStatusCodes.INTERNAL_SERVER_ERROR.message
            });
        }

        // ───────────────────────────────────────────────
        // Passo 6 – Enviar e-mail com código + link
        // ───────────────────────────────────────────────

        //TODO: consumir serviço de envio de e-mail

        // ───────────────────────────────────────────────
        // Passo 7 – Retornar resposta ao cliente
        // ───────────────────────────────────────────────
        return {
            message:
                'Solicitação de recuperação de senha recebida. Um e-mail foi enviado com instruções.'
        };
    }

    /**
          * Atualiza a senha do próprio usuário em dois cenários NÃO autenticados:
          *
          * 1) Normal (token único passado na URL como query: `?token=<JWT_PASSWORD_RECOVERY>`) 
          *    + { senha } no body.
          *    → Decodifica JWT, extrai usuarioId, salva o hash da nova senha mesmo que usuário esteja inativo.
          *
          * 2) Recuperação por código (envia `{ codigo_recupera_senha, senha }` no body).
          *    → Busca usuário pelo campo `codigo_recupera_senha`, salva hash da nova senha (mesmo se inativo),
          *      e “zera” o campo `codigo_recupera_senha`.
          */
    async atualizarSenhaToken(tokenRecuperacao, senhaBody) {
        // 1) Decodifica o token para obter o ID do usuário
        const usuarioId = await this.TokenUtil.decodePasswordRecoveryToken(
            tokenRecuperacao,
            process.env.JWT_SECRET_PASSWORD_RECOVERY
        );

        // 2) Gera o hash da senha pura
        const senhaHasheada = await AuthHelper.hashPassword(senhaBody.senha);
        console.log('Senha hasheada:', senhaHasheada);

        // Buscar usuário pelo token unico
        const usuario = await this.usuarioRepository.buscarPorTokenUnico(tokenRecuperacao);
        if (!usuario) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Token',
                details: [],
                customMessage: "Token de recuperação já foi utilizado ou é inválido."
            });
        }

        // 3) Atualiza no repositório (já com hash)
        const usuarioAtualizado = await this.usuarioRepository.atualizarSenha(usuarioId, senhaHasheada);
        if (!usuarioAtualizado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
                field: 'Senha',
                details: [],
                customMessage: 'Erro ao atualizar a senha.'
            });
        }

        return { message: 'Senha atualizada com sucesso.' };
    }

    /**
     * Atualiza senha via código de recuperação
     */
    async atualizarSenhaCodigo(codigoRecuperaSenha, senhaBody) {
        // 1) Busca usuário pelo código de recuperação
        const user = await this.usuarioRepository.buscarPorPorCodigoRecuperacao(
            codigoRecuperaSenha
        );
        if (!user) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Código de Recuperação',
                details: [],
                customMessage: 'Código de recuperação inválido ou não encontrado.'
            });
        }

        // 2) Verifica expiração
        if (user.exp_codigo_recupera_senha < new Date()) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                field: 'Código de Recuperação',
                details: [],
                customMessage: 'Código de recuperação expirado.'
            });
        }

        // 3) Hash da nova senha
        const senhaHasheada = await AuthHelper.hashPassword(senhaBody.senha);

        // 4) Atualiza no repositório
        const atualizado = await this.usuarioRepository.atualizarSenha(
            user._id,
            senhaHasheada
        );
        if (!atualizado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
                field: 'Senha',
                details: [],
                customMessage: 'Erro ao atualizar a senha.'
            });
        }

        return { message: 'Senha atualizada com sucesso.' };
    }


    async refresh(id, token) {
        const userEncontrado = await this.usuarioRepository.buscarPorId(id, { includeTokens: true });

        if (!userEncontrado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Token',
                details: [],
                customMessage: HttpStatusCodes.NOT_FOUND.message
            });
        }

        if (userEncontrado.refreshtoken !== token) {
            console.log('Token inválido');
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'invalidToken',
                field: 'Token',
                details: [],
                customMessage: messages.error.unauthorized('Token')
            });
        }

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
        }

        // Atualiza o usuário com os novos tokens
        await this.repository.armazenarTokens(id, accesstoken, refreshtoken);

        // monta o objeto de usuário com os tokens para resposta
        const userLogado = await this.usuarioRepository.buscarPorId(id, { includeTokens: true });
        delete userLogado.senha;
        const userObjeto = userLogado.toObject();

        const userComTokens = {
            accesstoken,
            refreshtoken,
            ...userObjeto
        };

        return { user: userComTokens };
    }
}

export default AuthService;