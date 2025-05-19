import NotificacaoRepository from "../repositories/notificacaoRepository.js";

class NotificacaoService {
  async listarTodas(query) {
    const { page = 1, limit = 10, usuario } = query;  
    
    
    const filtro = {};
    if (usuario) filtro.usuario = usuario;

    return await NotificacaoRepository.findAll(filtro, {
      page,
      limit,
      populate: "usuario"
    });
}

 async buscarPorId(id) {
    return await NotificacaoRepository.findById(id);
  }

  async criar(data) {
    return await NotificacaoRepository.create(data);
  }

  async listar(id, data) {
    return await NotificacaoRepository.update(id, data);
  }
}

export default new NotificacaoService();