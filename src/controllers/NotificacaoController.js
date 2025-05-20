import Notificacao from "../models/Notificacao.js";
import { NotificacaoSchema } from "../utils/validators/schemas/zod/NotificacaoSchema.js";

class NotificacaoController {

  async listar(req, res) {
    try {
      const notificacoes = await Notificacao.listarTodas(req.query);
      res.status(200).json(notificacoes);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar notificações", detalhe: err.message  });
    }
  }

  async buscarPorId(req, res) {
    try {
      const notificacao = await Notificacao.findById(req.params.id);
      if (!notificacao) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.status(200).json(notificacao);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar notificação" });
    }
  }

  async criar(req, res) {
    try {
      const novaNotificacao = await Notificacao.create(req.body);
      res.status(201).json(novaNotificacao);
    } catch (err) {
      res.status(400).json({ error: "Erro ao criar notificação" });
    }
  }

    async marcarComoVisualizada(req, res) {
    try {
      const { id } = req.params;
      const notificacaoAtualizada = await NotificacaoService.marcarComoVisualizada(id);
      res.status(200).json(notificacaoAtualizada);
    } catch (err) {
      res.status(400).json({ error: "Erro ao marcar como visualizada", detalhe: err.message });
    }
  }

}

export default NotificacaoController;
