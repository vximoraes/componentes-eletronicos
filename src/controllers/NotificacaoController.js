import NotificacaoService from "../services/NotificacaoService.js";
import { NotificacaoSchema } from "../utils/validators/schemas/zod/NotificacaoSchema.js";

class NotificacaoController {
  async listar(req, res) {
    try {
      const notificacoes = await NotificacaoService.listarTodas(req.query);
      res.status(200).json(notificacoes);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao listar notificações",
        detalhe: err.message
      });
    }
  }

  async buscarPorId(req, res) {
    try {
      const notificacao = await NotificacaoService.buscarPorId(req.params.id);
      if (!notificacao) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.status(200).json(notificacao);
    } catch (err) {
     res.status(500).json({
     error: "Erro ao buscar notificação",
     detalhe: err.message
 });
    }
  }

  async criar(req, res) {
    try {
      const parsed = NotificacaoSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Erro de validação",
          detalhes: parsed.error.format()
        });
      }

      const novaNotificacao = await NotificacaoService.criar(parsed.data);
      res.status(201).json(novaNotificacao);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao criar notificação",
        detalhe: err.message
      });
    }
  }

  async marcarComoVisualizada(req, res) {
    try {
      const { id } = req.params;
      const notificacao = await NotificacaoService.buscarPorId(id);

      if (!notificacao) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }

      const atualizada = await NotificacaoService.atualizar(id, { visualizada: true });
      res.status(200).json(atualizada);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao marcar como visualizada",
        detalhe: err.message
      });
    }
  }
}

export default new NotificacaoController();
