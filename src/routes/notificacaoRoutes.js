import express from "express";
//import AuthMiddlare from "../middlewares/.js"
//import authPermission from '../middlewares/.js';
import { asyncWrapper } from '../utils/helpers/index.js';
import notificacaoController from '../controllers/NotificacaoController.js';
import notificacaoSeed from "../seeds/notificacaoSeed.js";

const router = express.Router();

const notificacaoController = new notificacaoController();


router
    .post("/notificacao",/* AuthMiddleware, authPermission,*/ asyncWrapper(notificacaoController.criar.bind(notificacaoController)))
    .get("/notificacao", /*AuthMiddleware, authPermission,*/ asyncWrapper(notificacaoController.listar.bind(notificacaoController)))
    .get("/notificacao/:id",/* AuthMiddleware, authPermission,*/ asyncWrapper(notificacaoController.listarPorId.bind(notificacaoController)));

export default router;
    