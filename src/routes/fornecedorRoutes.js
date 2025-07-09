import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from "../middlewares/AuthPermission.js";
import FornecedorController from '../controllers/FornecedorController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const fornecedorController = new FornecedorController(); 

router
    .get("/fornecedores", AuthMiddleware, AuthPermission, asyncWrapper(fornecedorController.listar.bind(fornecedorController)))
    .get("/fornecedores/:id", AuthMiddleware, AuthPermission, asyncWrapper(fornecedorController.listar.bind(fornecedorController)))
    .post("/fornecedores", AuthMiddleware, AuthPermission, asyncWrapper(fornecedorController.criar.bind(fornecedorController)))
    .patch("/fornecedores/:id", AuthMiddleware, AuthPermission, asyncWrapper(fornecedorController.atualizar.bind(fornecedorController)))
    .put("/fornecedores/:id", AuthMiddleware, AuthPermission, asyncWrapper(fornecedorController.atualizar.bind(fornecedorController)))
    .delete("/fornecedores/:id", AuthMiddleware, AuthPermission, asyncWrapper(fornecedorController.deletar.bind(fornecedorController)))

export default router;