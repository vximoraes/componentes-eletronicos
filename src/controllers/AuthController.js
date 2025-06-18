import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import { LoginSchema } from '../utils/validators/schemas/zod/LoginSchema.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../utils/validators/schemas/zod/UsuarioSchema.js';
import { UsuarioIdSchema } from '../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js';
import { RequestAuthorizationSchema } from '../utils/validators/schemas/zod/querys/RequestAuthorizationSchema.js';
import { EmailSchema } from '../utils/validators/schemas/zod/EmailSchema.js';

import AuthService from '../services/AuthService.js';

/**
   * Validação nesta aplicação segue o segue este artigo:
   * https://docs.google.com/document/d/1m2Ns1rIxpUzG5kRsgkbaQFdm7od0e7HSHfaSrrwegmM/edit?usp=sharing
*/
class AuthController {
    constructor() {
        this.service = new AuthService();
    }
    /**
     * Método para fazer o login do usuário
     */
    login = async (req, res) => {
        // 1º validação estrutural - validar os campos passados por body
        const body = req.body || {};
        const validatedBody = LoginSchema.parse(body);
        const data = await this.service.login(validatedBody);
        return CommonResponse.success(res, data);
    }

    /**
     *  Metodo para recuperar a senha do usuário
     */
    recuperaSenha = async (req, res) => {
        console.log('Estou no logar em RecuperaSenhaController, enviando req para RecuperaSenhaService');

        // Validar apenas o email
        const validatedBody = EmailSchema.parse(req.body);
        const data = await this.service.recuperaSenha(validatedBody);
        return CommonResponse.success(res, data);
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
    async atualizarSenhaToken(req, res, next) {
        console.log('Estou no atualizarSenha em AuthController, enviando req para AuthService');

        const tokenRecuperacao = req.query.token || req.params.token || null; // token de recuperação passado na URL
        const senha = req.body.senha || null; // nova senha passada no body

        // 1) Verifica se veio o token de recuperação
        if (!tokenRecuperacao) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'unauthorized',
                field: 'authentication',
                details: [],
                customMessage:
                    'Token de recuperação na URL como parâmetro ou query é obrigatório para troca da senha.'
            });
        }

        // Validar a senha com o schema
        const senhaSchema = UsuarioUpdateSchema.parse({ "senha": senha });

        // atualiza a senha 
        await this.service.atualizarSenhaToken(tokenRecuperacao, senhaSchema);

        return CommonResponse.success(
            res,
            null,
            HttpStatusCodes.OK.code, 'Senha atualizada com sucesso.',
            { message: 'Senha atualizada com sucesso via token de recuperação.' },
        );
    }

    async atualizarSenhaCodigo(req, res, next) {
        console.log('Estou no atualizarSenha em AuthController, enviando req para AuthService');

        const codigo_recupera_senha = req.body.codigo_recupera_senha || null; // código de recuperação passado no body
        const senha = req.body.senha || null; // nova senha passada no body

        console.log('codigo_recupera_senha:', codigo_recupera_senha);
        console.log('senha:', senha);

        // 1) Verifica se veio o código de recuperação
        if (!codigo_recupera_senha) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'unauthorized',
                field: 'authentication',
                details: [],
                customMessage:
                    'Código de recuperação no body é obrigatório para troca da senha.'
            });
        }

        // Validar a senha com o schema
        const senhaSchema = UsuarioUpdateSchema.parse({ senha });

        // atualiza a senha 
        await this.service.atualizarSenhaCodigo(codigo_recupera_senha, senhaSchema);

        return CommonResponse.success(
            res,
            null,
            HttpStatusCodes.OK.code, 'Senha atualizada com sucesso.',
            { message: 'Senha atualizada com sucesso via código de recuperação.' },
        );
    }

    /**
     * Método para fazer o refresh do token 
     */
    revoke = async (req, res) => {
        // Extrai ID do usuario a ter o token revogado do body
        const id = req.body.id;
        // remove o token do banco de dados e retorna uma resposta de sucesso
        const data = await this.service.revoke(id);
        return CommonResponse.success(res);
    }

    /**
     * Método para fazer o refresh do token 
     */
    refresh = async (req, res) => {
        // Fallback seguro: tenta pegar do body, senão do header Authorization
        const token = (req.body && req.body.refresh_token) || req.headers.authorization?.split(' ')[1];

        // Verifica se o token está presente e não é uma string inválida
        if (!token || token === 'null' || token === 'undefined') {
            console.log('Refresh token ausente ou inválido:', token);
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'invalidRefresh',
                field: 'Refresh',
                details: [],
                customMessage: 'Refresh token não informado.'
            });
        }

        let decoded;

        try {
            decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_REFRESH_TOKEN);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new CustomError({
                    statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                    errorType: 'tokenExpired',
                    field: 'Refresh',
                    details: [],
                    customMessage: 'Refresh token expirado.'
                });
            }
            if (err.name === 'JsonWebTokenError') {
                throw new CustomError({
                    statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                    errorType: 'invalidToken',
                    field: 'Refresh',
                    details: [],
                    customMessage: 'Refresh token inválido.'
                });
            }
            throw err;
        }

        const data = await this.service.refresh(decoded.id, token);
        return CommonResponse.success(res, data);
    }

    /**
     * Método para fazer o logout do usuário
     */
    logout = async (req, res) => {
        // Garante que req.body existe e faz fallback seguro
        const token = (req.body && req.body.access_token) || req.headers.authorization?.split(' ')[1];

        // Verifica se o token está presente e não é uma string inválida
        if (!token || token === 'null' || token === 'undefined') {
            console.log('Token recebido:', token);
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'invalidLogout',
                field: 'Logout',
                details: [],
                customMessage: HttpStatusCodes.BAD_REQUEST.message
            });
        }

        // Verifica e decodifica o access token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_ACCESS_TOKEN);

        // Verifica se o token decodificado contém o ID do usuário
        if (!decoded || !decoded.id) {
            console.log('Token decodificado inválido:', decoded);
            throw new CustomError({
                statusCode: HttpStatusCodes.INVALID_TOKEN.code,
                errorType: 'notAuthorized',
                field: 'NotAuthorized',
                details: [],
                customMessage: HttpStatusCodes.INVALID_TOKEN.message
            });
        }
        // Valida o ID do usuário
        UsuarioIdSchema.parse(decoded.id);

        // Encaminha o token para o serviço de logout
        const data = await this.service.logout(decoded.id, token);

        // Retorna uma resposta de sucesso
        return CommonResponse.success(res, null, messages.success.logout);
    }

    /**
     * Método para validar o token
     */
    pass = async (req, res) => {
        // 1. Validação estrutural
        const bodyrequest = req.body || {};
        const validatedBody = RequestAuthorizationSchema.parse(bodyrequest);

        // 2. Decodifica e verifica o JWT
        const decoded = /** @type {{ id: string, exp?: number, iat?: number, nbf?: number, client_id?: string, aud?: string }} */ (
            await promisify(jwt.verify)(validatedBody.accesstoken, process.env.JWT_SECRET_ACCESS_TOKEN)
        );

        // 3. Valida ID de usuário
        UsuarioIdSchema.parse(decoded.id);

        // 4. Prepara campos de introspecção
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp ?? null; // timestamp UNIX de expiração
        const iat = decoded.iat ?? null; // timestamp UNIX de emissão 
        const nbf = decoded.nbf ?? iat; // não válido antes deste timestamp
        const active = exp > now;

        // tenta extrair o client_id do próprio token; cai em aud se necessário
        const clientId = decoded.client_id || decoded.id || decoded.aud || null;

        /**
         * 5. Prepara resposta de introspecção
         */
        const introspection = {
            active,               // token ainda válido (não expirado)
            client_id: clientId,  // ID do cliente OAuth
            token_type: 'Bearer', // conforme RFC 6749
            exp,                  // timestamp UNIX de expiração
            iat,                  // timestamp UNIX de emissão
            nbf,                  // não válido antes deste timestamp
            // …adicione aqui quaisquer campos de extensão necessários…
        };

        // 5. Retorna resposta no padrão CommonResponse
        return CommonResponse.success(
            res,
            introspection,
            HttpStatusCodes.OK.code,
            messages.authorized.default
        );
    };
}

export default AuthController;