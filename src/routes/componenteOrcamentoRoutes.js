import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import authPermission from '../middlewares/AuthPermission.js';
import ComponenteOrcamentoController from "../controllers/ComponenteOrcamentoController.js";
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const componenteController = new ComponenteOrcamentoController();

router
    .get("/componente_orcamentos", AuthMiddleware, authPermission, asyncWrapper(componenteController.listar.bind(componenteController)))
    .get("/componente_orcamentos/:id", AuthMiddleware, authPermission, asyncWrapper(componenteController.listar.bind(componenteController)))
    .post("/componente_orcamentos", AuthMiddleware, authPermission, asyncWrapper(componenteController.criar.bind(componenteController)))
    .patch("/componente_orcamentos/:id", AuthMiddleware, authPermission, asyncWrapper(componenteController.atualizar.bind(componenteController)))
    .put("/componente_orcamentos/:id", AuthMiddleware, authPermission, asyncWrapper(componenteController.atualizar.bind(componenteController)))
    .delete("/componente_orcamentos/:id", AuthMiddleware, authPermission, asyncWrapper(componenteController.deletar.bind(componenteController)))

export default router;
