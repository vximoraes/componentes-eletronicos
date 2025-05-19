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