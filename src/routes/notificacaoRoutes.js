import express from "express";
// import AuthMiddleware from "../middlewares/AuthMiddleware.js";
// import authPermission from '../middlewares/AuthPermission.js';
import NotificacaoController from '../controllers/NotificacaoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const notificacaoController = new NotificacaoController();

router
    .get("/notificacoes", asyncWrapper(notificacaoController.listar.bind(notificacaoController)))
    .get("/notificacoes/:id", asyncWrapper(notificacaoController.buscarPorId.bind(notificacaoController)))
    .post("/notificacoes", asyncWrapper(notificacaoController.criar.bind(notificacaoController)))
    .patch("/notificacoes/:id/visualizar", asyncWrapper(notificacaoController.marcarComoVisualizada.bind(notificacaoController)))
    .put("/notificacoes/:id/visualizar", asyncWrapper(notificacaoController.marcarComoVisualizada.bind(notificacaoController)));

export default router;