import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OrcamentoController from '../controllers/OrcamentoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const orcamentoController = new OrcamentoController();

router
    .get("/orcamentos", AuthMiddleware, asyncWrapper(orcamentoController.listar.bind(orcamentoController)))
    .get("/orcamentos/:id", AuthMiddleware, asyncWrapper(orcamentoController.listar.bind(orcamentoController)))
    .post("/orcamentos", AuthMiddleware, asyncWrapper(orcamentoController.criar.bind(orcamentoController)))
    .patch("/orcamentos/:id", AuthMiddleware, asyncWrapper(orcamentoController.atualizar.bind(orcamentoController)))
    .delete("/orcamentos/:id", AuthMiddleware, asyncWrapper(orcamentoController.deletar.bind(orcamentoController)))
    .post("/orcamentos/:orcamentoId/componentes", AuthMiddleware, asyncWrapper(orcamentoController.adicionarComponente.bind(orcamentoController)))
    .patch("/orcamentos/:orcamentoId/componentes/:id", AuthMiddleware, asyncWrapper(orcamentoController.atualizarComponente.bind(orcamentoController)))
    .delete("/orcamentos/:orcamentoId/componentes/:id", AuthMiddleware, asyncWrapper(orcamentoController.removerComponente.bind(orcamentoController)))

export default router;