import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const movimentacaoController = new MovimentacaoController();

router
    .get("/movimentacoes", AuthMiddleware, asyncWrapper(movimentacaoController.listar.bind(movimentacaoController)))
    .get("/movimentacoes/:id", AuthMiddleware, asyncWrapper(movimentacaoController.listar.bind(movimentacaoController)))
    .post("/movimentacoes", AuthMiddleware, asyncWrapper(movimentacaoController.criar.bind(movimentacaoController)))

export default router;