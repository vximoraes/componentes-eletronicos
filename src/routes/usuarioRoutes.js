import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from "../middlewares/AuthPermission.js";
import UsuarioController from '../controllers/UsuarioController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const usuarioController = new UsuarioController();

router
    .get("/usuarios", AuthMiddleware, AuthPermission, asyncWrapper(usuarioController.listar.bind(usuarioController)))
    .get("/usuarios/:id", AuthMiddleware, AuthPermission, asyncWrapper(usuarioController.listar.bind(usuarioController)))
    .post("/usuarios", asyncWrapper(usuarioController.criar.bind(usuarioController)))
    .patch("/usuarios/:id", AuthMiddleware, AuthPermission, asyncWrapper(usuarioController.atualizar.bind(usuarioController)))
    .put("/usuarios/:id", AuthMiddleware, AuthPermission, asyncWrapper(usuarioController.atualizar.bind(usuarioController)))
    .delete("/usuarios/:id", AuthMiddleware, AuthPermission, asyncWrapper(usuarioController.deletar.bind(usuarioController)))

export default router;