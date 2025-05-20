import Notificacao from "../models/Notificacao.js";

class NotificacaoRepository {

  async findAll(filtro = {}, options = {}) {
    return await Notificacao.paginate(filtro, options);
  }
  async findById(id) {
    return await Notificacao.findById(id).populate("usuario");
  }

  async create(data) {
    return await Notificacao.create(data);
  }

  async update(id, data) {
    return await Notificacao.findByIdAndUpdate(id, data, { new: true });
  }


}

export default new NotificacaoRepository();
