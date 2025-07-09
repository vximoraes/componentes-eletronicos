import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from "../middlewares/AuthPermission.js";
import OrcamentoController from '../controllers/OrcamentoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const orcamentoController = new OrcamentoController();

router
    .get("/orcamentos", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.listar.bind(orcamentoController)))
    .get("/orcamentos/:id", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.listar.bind(orcamentoController)))
    .post("/orcamentos", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.criar.bind(orcamentoController)))
    .patch("/orcamentos/:id", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.atualizar.bind(orcamentoController)))
    .delete("/orcamentos/:id", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.deletar.bind(orcamentoController)))
    .post("/orcamentos/:orcamentoId/componentes", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.adicionarComponente.bind(orcamentoController)))
    .patch("/orcamentos/:orcamentoId/componentes/:id", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.atualizarComponente.bind(orcamentoController)))
    .delete("/orcamentos/:orcamentoId/componentes/:id", AuthMiddleware, AuthPermission, asyncWrapper(orcamentoController.removerComponente.bind(orcamentoController)))

export default router;