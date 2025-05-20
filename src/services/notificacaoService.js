import NotificacaoRepository from "../repositories/NotificacaoRepository.js";
import NotificacaoFilterBuilder from "../filters/NotificacaoFilterBuilder.js";

class NotificacaoService {
  async listarTodas(query) {
    const { page = 1, limit = 10, usuario, dataInicial, dataFinal, visualizada } = query;

    const filtros = new NotificacaoFilterBuilder()
      .comUsuario(usuario)
      .comDataInicial(dataInicial)
      .comDataFinal(dataFinal)
      .comVisualizada(visualizada)
      .build();

    return await NotificacaoRepository.findAll(filtros, {
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

  async marcarComoVisualizada(id) {
    return await NotificacaoRepository.update(id, { visualizada: true });
  }
}

export default new NotificacaoService();
