import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import ComponenteController from '../controllers/ComponenteController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const componenteController = new ComponenteController(); 

router
    .get("/componentes", AuthMiddleware, asyncWrapper(componenteController.listar.bind(componenteController)))
    .get("/componentes/:id", AuthMiddleware, asyncWrapper(componenteController.listar.bind(componenteController)))
    .post("/componentes", AuthMiddleware, asyncWrapper(componenteController.criar.bind(componenteController)))
    .patch("/componentes/:id", AuthMiddleware, asyncWrapper(componenteController.atualizar.bind(componenteController)))
    .put("/componentes/:id", AuthMiddleware, asyncWrapper(componenteController.atualizar.bind(componenteController)))
    .delete("/componentes/:id", AuthMiddleware, asyncWrapper(componenteController.deletar.bind(componenteController)))

export default router;