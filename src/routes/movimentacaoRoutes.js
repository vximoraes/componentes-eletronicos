import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from "../middlewares/AuthPermission.js";
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const movimentacaoController = new MovimentacaoController();

router
    .get("/movimentacoes", AuthMiddleware, AuthPermission, asyncWrapper(movimentacaoController.listar.bind(movimentacaoController)))
    .get("/movimentacoes/:id", AuthMiddleware, AuthPermission, asyncWrapper(movimentacaoController.listar.bind(movimentacaoController)))
    .post("/movimentacoes", AuthMiddleware, AuthPermission, asyncWrapper(movimentacaoController.criar.bind(movimentacaoController)))

export default router;