import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import UsuarioController from '../controllers/UsuarioController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const usuarioController = new UsuarioController();

router
    .get("/usuarios", AuthMiddleware, asyncWrapper(usuarioController.listar.bind(usuarioController)))
    .get("/usuarios/:id", AuthMiddleware, asyncWrapper(usuarioController.listar.bind(usuarioController)))
    .post("/usuarios", AuthMiddleware, asyncWrapper(usuarioController.criar.bind(usuarioController)))
    .patch("/usuarios/:id", AuthMiddleware, asyncWrapper(usuarioController.atualizar.bind(usuarioController)))
    .put("/usuarios/:id", AuthMiddleware, asyncWrapper(usuarioController.atualizar.bind(usuarioController)))
    .delete("/usuarios/:id", AuthMiddleware, asyncWrapper(usuarioController.deletar.bind(usuarioController)))

export default router;