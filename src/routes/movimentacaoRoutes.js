import express from "express";
// import AuthMiddleware from "../middlewares/AuthMiddleware.js";
// import authPermission from '../middlewares/AuthPermission.js';
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const movimentacaoController = new MovimentacaoController(); 

router
    .get("/movimentacoes", /*AuthMiddleware, authPermission,*/ asyncWrapper(movimentacaoController.listar.bind(movimentacaoController)))
    .get("/movimentacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(movimentacaoController.listar.bind(movimentacaoController)))
    // .post("/movimentacoes", /*AuthMiddleware, authPermission,*/ asyncWrapper(movimentacaoController.criar.bind(movimentacaoController)))
    // .patch("/movimentacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(movimentacaoController.atualizar.bind(movimentacaoController)))
    // .put("/movimentacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(movimentacaoController.atualizar.bind(movimentacaoController)))
    // .delete("/movimentacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(movimentacaoController.deletar.bind(movimentacaoController)))

export default router;