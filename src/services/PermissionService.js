import Usuario from "../models/Usuario.js";
import Grupo from "../models/Grupo.js";
import Rota from '../models/Rota.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class PermissionService {
    constructor() {
        this.repository = new UsuarioRepository();
        this.Usuario = Usuario;
        this.Grupo = Grupo;
        this.Rota = Rota;
        this.messages = messages;        
    }

    async hasPermission(userId, rota, dominio, metodo) {
        try {
            const usuario = await this.repository.buscarPorId(userId, { grupos: true });
            if (!usuario) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Usuário',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Usuário')
                });
            }

            let permissoes = usuario.permissoes || [];

            // Verifica se usuario.grupos é um array antes de iterar
            if (Array.isArray(usuario.grupos)) {
                for (const grupo of usuario.grupos) {
                    permissoes = permissoes.concat(grupo.permissoes || []);
                }
            }

            const permissoesUnicas = [];
            const combinacoes = new Set();

            permissoes.forEach(permissao => {
                const chave = `${permissao.rota}_${permissao.dominio}`;
                if (!combinacoes.has(chave)) {
                    combinacoes.add(chave);
                    permissoesUnicas.push(permissao);
                }
            });

            const hasPermissao = permissoesUnicas.some(permissao => {
                return (
                    permissao.rota === rota &&
                    permissao.dominio === dominio &&
                    permissao.ativo &&
                    permissao[metodo] 
                );
            });

            return hasPermissao;
        } catch (error) {
            console.error("Erro ao verificar permissões:", error);
            return false;
        }
    }
}

export default PermissionService;
