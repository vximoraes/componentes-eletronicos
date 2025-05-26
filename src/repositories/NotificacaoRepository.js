import NotificacaoFilterBuilder from './filters/NotificacaoFilterBuilder.js';
import NotificacaoModel from '../models/Notificacao.js';
import { CustomError, messages } from '../utils/helpers/index.js';

class NotificacaoRepository {
    constructor({ notificacaoModel = NotificacaoModel } = {}) {
        this.model = notificacaoModel;
    }

    async buscarPorId(id) {
        const notificacao = await this.model.findById(id).populate('usuario');
        
        if (!notificacao) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Notificação',
                details: [],
                customMessage: messages.error.resourceNotFound('Notificação')
            });
        }
        
        return notificacao;
    }

    async criar(dadosNotificacao) {
        const notificacao = new this.model(dadosNotificacao);
        return await notificacao.save();
    }

    async listar(req) {
        const id = req.params.id || null;

        if (id) {
            return await this.buscarPorId(id);
        }

        const { usuario, lida, page = 1, limite = 10 } = req.query;

        const filterBuilder = new NotificacaoFilterBuilder()
            .comUsuario(usuario)
            .comLida(lida);

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page, 10),
            limit: Math.min(parseInt(limite, 10), 100),
            populate: 'usuario',
            sort: { createdAt: -1 }
        };

        return await this.model.paginate(filtros, options);
    }

    async marcarComoVisualizada(id) {
        return this._atualizar(id, { 
            lida: true, 
            dataLeitura: new Date() 
        });
    }

    async _atualizar(id, parsedData) {
        const notificacao = await this.model.findByIdAndUpdate(
            id, 
            parsedData, 
            { new: true }
        ).populate('usuario');
        
        if (!notificacao) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Notificação',
                details: [],
                customMessage: messages.error.resourceNotFound('Notificação')
            });
        }

        return notificacao;
    }
}

export default NotificacaoRepository;