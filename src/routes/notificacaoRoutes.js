import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import NotificacaoController from '../controllers/NotificacaoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const notificacaoController = new NotificacaoController();

router
    .get("/notificacoes", AuthMiddleware, asyncWrapper(notificacaoController.listar.bind(notificacaoController)))
    .get("/notificacoes/:id", AuthMiddleware, asyncWrapper(notificacaoController.buscarPorId.bind(notificacaoController)))
    .post("/notificacoes", AuthMiddleware, asyncWrapper(notificacaoController.criar.bind(notificacaoController)))
    .patch("/notificacoes/:id/visualizar", AuthMiddleware, asyncWrapper(notificacaoController.marcarComoVisualizada.bind(notificacaoController)))
    .put("/notificacoes/:id/visualizar", AuthMiddleware, asyncWrapper(notificacaoController.marcarComoVisualizada.bind(notificacaoController)));

export default router;