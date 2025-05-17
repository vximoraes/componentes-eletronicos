import Notificacao from "../models/Notificacao.js";

class NotificacaoController {
  async listar(req, res) {
    try {
      const notificacoes = await Notificacao.find();
      res.status(200).json(notificacoes);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar notificações" });
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

  async atualizar(req, res) {
    try {
      const notificacaoAtualizada = await Notificacao.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!notificacaoAtualizada) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.status(200).json(notificacaoAtualizada);
    } catch (err) {
      res.status(400).json({ error: "Erro ao atualizar notificação" });
    }
  }

  async deletar(req, res) {
    try {
      const notificacaoDeletada = await Notificacao.findByIdAndDelete(req.params.id);
      if (!notificacaoDeletada) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.status(200).json({ message: "Notificação deletada com sucesso" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar notificação" });
    }
  }
}

export default NotificacaoController;
