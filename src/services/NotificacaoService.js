import NotificacaoRepository from "../repositories/NotificacaoRepository.js";
import Notificacao from "../models/Notificacao.js";
import Usuario from "../models/Usuario.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class NotificacaoService {
    constructor() {
        this.repository = new NotificacaoRepository();
    };

    async listarTodas(req) {
        const data = await this.repository.listar(req);

        return data;
    };

    async buscarPorId(id) {
        const data = await this.repository.buscarPorId(id);

        return data;
    };

    async criar(parsedData) {
        const data2 = await this.repository.criar(parsedData);

        return data2;
    };

    async marcarComoVisualizada(id) {
        const data = await this.repository.marcarComoVisualizada(id);
        return data;
    };
};

export default NotificacaoService;