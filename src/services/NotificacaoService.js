import NotificacaoRepository from "../repositories/NotificacaoRepository.js";
import Notificacao from "../models/Notificacao.js";
import Usuario from "../models/Usuario.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';


class NotificacaoService {

  constructor() {
     this.repository = new NotificacaoRepository();
    }

    async listarTodas(req) {
        console.log('Estou listando na NotificacaoService');
        const data = await this.repository.listar(req);
        console.log('Retornando dados da NotificacaoService');
        return data;
    }

    async buscarPorId(id) {
        console.log('Estou buscando por ID na NotificacaoService');
        const data = await this.repository.buscarPorId(id);
        return data;
    }

    async criar(parsedData) {
        console.log('Estou criando na NotificacaoService');
        const data2 = await this.repository.criar(parsedData);
        //await this.repository.criar(parsedData.criar)
        return data2;}

    async marcarComoVisualizada(id) {
        console.log('Estou marcando como visualizada na NotificacaoService');
        const data = await this.repository.marcarComoVisualizada(id);
        return data;
    }
}

export default  NotificacaoService;
