import express from "express";
// import AuthMiddleware from "../middlewares/AuthMiddleware.js";
// import authPermission from '../middlewares/AuthPermission.js';
import ComponenteController from '../controllers/ComponenteController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const componenteController = new ComponenteController(); 

router
    .get("/componentes", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.listar.bind(componenteController)))
    .get("/componentes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.listar.bind(componenteController)))
    .post("/componentes", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.criar.bind(componenteController)))
    .patch("/componentes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.atualizar.bind(componenteController)))
    .put("/componentes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(componenteController.atualizar.bind(componenteController)))
    // .delete("/usuarios/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(usuarioController.deletar.bind(usuarioController)))

export default router;