import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from "../middlewares/AuthPermission.js";
import NotificacaoController from '../controllers/NotificacaoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const notificacaoController = new NotificacaoController();

router
    .get("/notificacoes", AuthMiddleware, AuthPermission, asyncWrapper(notificacaoController.listar.bind(notificacaoController)))
    .get("/notificacoes/:id", AuthMiddleware, AuthPermission, asyncWrapper(notificacaoController.buscarPorId.bind(notificacaoController)))
    .post("/notificacoes", AuthMiddleware, AuthPermission, asyncWrapper(notificacaoController.criar.bind(notificacaoController)))
    .patch("/notificacoes/:id/visualizar", AuthMiddleware, AuthPermission, asyncWrapper(notificacaoController.marcarComoVisualizada.bind(notificacaoController)))
    .put("/notificacoes/:id/visualizar", AuthMiddleware, AuthPermission, asyncWrapper(notificacaoController.marcarComoVisualizada.bind(notificacaoController)));

export default router;