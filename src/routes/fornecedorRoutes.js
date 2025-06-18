import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import FornecedorController from '../controllers/FornecedorController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const fornecedorController = new FornecedorController(); 

router
    .get("/fornecedores", AuthMiddleware, asyncWrapper(fornecedorController.listar.bind(fornecedorController)))
    .get("/fornecedores/:id", AuthMiddleware, asyncWrapper(fornecedorController.listar.bind(fornecedorController)))
    .post("/fornecedores", AuthMiddleware, asyncWrapper(fornecedorController.criar.bind(fornecedorController)))
    .patch("/fornecedores/:id", AuthMiddleware, asyncWrapper(fornecedorController.atualizar.bind(fornecedorController)))
    .put("/fornecedores/:id", AuthMiddleware, asyncWrapper(fornecedorController.atualizar.bind(fornecedorController)))
    .delete("/fornecedores/:id", AuthMiddleware, asyncWrapper(fornecedorController.deletar.bind(fornecedorController)))

export default router;