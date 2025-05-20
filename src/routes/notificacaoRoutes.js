import express from "express";
import { asyncWrapper } from '../utils/helpers/index.js';
import notificacaoController from '../controllers/NotificacaoController.js';

const router = express.Router();


router
    .post("/notificacao",/* AuthMiddleware, authPermission,*/ asyncWrapper(notificacaoController.criar.bind(notificacaoController)))
    .get("/notificacao", /*AuthMiddleware, authPermission,*/ asyncWrapper(notificacaoController.listar.bind(notificacaoController)))
    .get("/notificacao/:id",/* AuthMiddleware, authPermission,*/ asyncWrapper(notificacaoController.buscarPorId.bind(notificacaoController)))
    .patch("/notificacao/:id/visualizar", asyncWrapper(notificacaoController.marcarComoVisualizada.bind(notificacaoController)));

export default router;
    