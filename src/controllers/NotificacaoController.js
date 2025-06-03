import NotificacaoService from "../services/NotificacaoService.js";
import { NotificacaoSchema } from "../utils/validators/schemas/zod/NotificacaoSchema.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper} from '../utils/helpers/index.js';

class NotificacaoController {
    constructor() {
        this.service = new NotificacaoService();
    }

    async listar(req, res) {
        const notificacoes = await this.service.listarTodas(req.query);
        return CommonResponse.success(res, notificacoes);
    }

    async buscarPorId(req, res) {
        const { id } = req.params;

        const notificacao = await this.service.buscarPorId(id);
        if (!notificacao) {
            return CommonResponse.error(res, { message: "Notificação não encontrada" }, HttpStatusCodes.NOT_FOUND);
        }

        return CommonResponse.success(res, notificacao);
    }

    async criar(req, res) {
        const parsedData = NotificacaoSchema.parse(req.body);
        const novaNotificacao = await this.service.criar(parsedData);

        return CommonResponse.created(res, novaNotificacao);
    }

    async marcarComoVisualizada(req, res) {
        const { id } = req.params;
        const notificacao = await this.service.buscarPorId(id);
        if (!notificacao) {
            return CommonResponse.error(res, { message: "Notificação não encontrada" }, HttpStatusCodes.NOT_FOUND);
        }

        const atualizada = await this.service.marcarComoVisualizada(id);
        return CommonResponse.success(res, atualizada);
    }


}

export default NotificacaoController;

