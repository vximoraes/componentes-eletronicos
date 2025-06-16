import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AuthenticationError from '../utils/errors/AuthenticationError.js';
import TokenExpiredError from '../utils/errors/TokenExpiredError.js';
import { CustomError } from '../utils/helpers/index.js';
import AuthService from '../services/AuthService.js';
import { Console } from 'console';

class AuthMiddleware {
    constructor() {
        this.service = new AuthService();
        // Garante que o 'this' do método se mantenha ao usá-lo como callback
        this.handle = this.handle.bind(this);
    }

    /**
     * Extrai o token e devolve { token, secret }
     * - Authorization: Bearer <token>          → JWT_SECRET_ACCESS_TOKEN
     * - body.token                             → JWT_SECRET_ACCESS_TOKEN
     * - query.token                            → JWT_SECRET_PASSWORD_RECOVERY
     */
    _getTokenAndSecret(req) {
        // 1. Header Authorization ───────────────────────────────
        const authHeader = req.headers?.authorization ?? null;
        if (authHeader) {
            // Permite “Bearer <token>” ou apenas o token cru
            const parts = authHeader.split(' ');
            const token = parts.length === 2 ? parts[1] : parts[0];
            return {
                token,
                secret: process.env.JWT_SECRET_ACCESS_TOKEN
            };
        }

        // 3. Query string (link de redefinição de senha) ────────
        if (req.query?.token) {
            return {
                token: req.query.token,
                secret: process.env.JWT_SECRET_PASSWORD_RECOVERY
            };
        }

        // Nada encontrado
        throw new AuthenticationError('Token não informado!');
    }

    async handle(req, res, next) {
        try {
            const { token, secret } = this._getTokenAndSecret(req);

            // Verifica e decodifica o token
            const decoded = await promisify(jwt.verify)(token, secret);

            // Se falhou a verificação, jwt.verify já lança JsonWebTokenError / TokenExpiredError
            // porém incluímos este “if” por segurança contra valores falsy
            if (!decoded) {
                throw new TokenExpiredError('Token JWT expirado, tente novamente.');
            }

            /**
             * Caso seja um token de acesso normal, verificamos se o refresh token
             * continua válido no banco. Se for um token de recuperação de senha,
             * essa checagem não é necessária.
             */

            if (secret === process.env.JWT_SECRET_ACCESS_TOKEN) {
                const tokenData = await this.service.carregatokens(decoded.id);

                if (!tokenData?.data?.refreshtoken) {
                    throw new CustomError({
                        statusCode: 401,
                        errorType: 'unauthorized',
                        field: 'Token',
                        details: [],
                        customMessage: 'Refresh token inválido, autentique-se novamente!'
                    });
                }
            }

            // Token válido → adiciona o id do usuário à request
            req.user_id = decoded.id;
            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(new AuthenticationError('Token JWT inválido!'));
            }
            if (err.name === 'TokenExpiredError') {
                return next(new TokenExpiredError('Token JWT expirado, faça login novamente.'));
            }
            // Outros erros seguem para o errorHandler global
            return next(err);
        }
    }
}

// Exporta apenas a função middleware já vinculada
export default new AuthMiddleware().handle;