import express from "express";
// import AuthMiddleware from "../middlewares/AuthMiddleware.js";
// import authPermission from '../middlewares/AuthPermission.js';
import OrcamentoController from '../controllers/OrcamentoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const orcamentoController = new OrcamentoController();

router
    .get("/orcamentos", /*AuthMiddleware, authPermission,*/ asyncWrapper(orcamentoController.listar.bind(orcamentoController)))
    .get("/orcamentos/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(orcamentoController.listar.bind(orcamentoController)))
    .post("/orcamentos", /*AuthMiddleware, authPermission,*/ asyncWrapper(orcamentoController.criar.bind(orcamentoController)))
    // .patch("/orcamentos/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(orcamentoController.atualizar.bind(orcamentoController)))
    // .delete("/orcamentos/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(orcamentoController.deletar.bind(orcamentoController)))
    .post("/orcamentos/:orcamentoId/componentes", asyncWrapper(orcamentoController.adicionarComponente.bind(orcamentoController)))
    .patch("/orcamentos/:orcamentoId/componentes/:id", asyncWrapper(orcamentoController.atualizarComponente.bind(orcamentoController)))
    .delete("/orcamentos/:orcamentoId/componentes/:id", asyncWrapper(orcamentoController.removerComponente.bind(orcamentoController)))

export default router;