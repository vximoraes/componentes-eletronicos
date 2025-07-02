import express from "express";
// import AuthMiddleware from "../middlewares/AuthMiddleware.js";
// import authPermission from '../middlewares/AuthPermission.js';
import OrcamentoController from "../controllers/OrcamentoController.js";
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const ComponenteOrcamentoController = new ComponenteOrcamentoController();

router
    .get("/componente-orcamento", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.listar.bind(componenteController)))
    .get("/componente-orcamento/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.listar.bind(componenteController)))
    .post("/componente-orcamento", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.criar.bind(componenteController)))
    .patch("/componente-orcamento/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.atualizar.bind(componenteController)))
    .put("/componente-orcamento/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.atualizar.bind(componenteController)))
    .delete("/componente-orcamento/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.deletar.bind(componenteController)))

export default router;
