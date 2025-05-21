import NotificacaoRepository from "../repositories/NotificacaoRepository.js";

class NotificacaoService {

  constructor() {
     this.notificacaoRepository = new NotificacaoRepository;
    }

    async listarTodas(req) {
        console.log('Estou listando na NotificacaoService');
        const data = await this.repository.listarTodas(req);
        console.log('Retornando dados da NotificacaoService');
        return data;
    }

    async buscarPorId(id) {
        console.log('Estou buscando por ID na NotificacaoService');
        const data = await this.repository.buscarPorId(id);
        return data;
    }

    async criar(data) {
        console.log('Estou criando na NotificacaoService');
        const data = await this.repository.criar(data);
        return data;}

    async marcarComoVisualizada(id) {
        console.log('Estou marcando como visualizada na NotificacaoService');
        const data = await this.repository.marcarComoVisualizada(id);
        return data;
    }
}

export default new NotificacaoService();
