import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import CategoriaController from '../controllers/CategoriaController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const categoriaController = new CategoriaController(); 

router
    .get("/categorias", AuthMiddleware, asyncWrapper(categoriaController.listar.bind(categoriaController)))
    .get("/categorias/:id", AuthMiddleware, asyncWrapper(categoriaController.listar.bind(categoriaController)))
    .post("/categorias", AuthMiddleware, asyncWrapper(categoriaController.criar.bind(categoriaController)))
    .patch("/categorias/:id", AuthMiddleware, asyncWrapper(categoriaController.atualizar.bind(categoriaController)))
    .put("/categorias/:id", AuthMiddleware, asyncWrapper(categoriaController.atualizar.bind(categoriaController)))
    .delete("/categorias/:id", AuthMiddleware, asyncWrapper(categoriaController.deletar.bind(categoriaController)))

export default router;