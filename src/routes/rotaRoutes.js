import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from '../middlewares/AuthPermission.js';
import RotaController from '../controllers/RotaController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const rotaController = new RotaController();

router
  .get("/rotas", AuthMiddleware, AuthPermission, asyncWrapper(rotaController.listar.bind(rotaController)))
  .get("/rotas/:id", AuthMiddleware, AuthPermission, asyncWrapper(rotaController.listar.bind(rotaController)))
  .post("/rotas", AuthMiddleware, AuthPermission, asyncWrapper(rotaController.criar.bind(rotaController)))
  .patch("/rotas/:id", AuthMiddleware, AuthPermission, asyncWrapper(rotaController.atualizar.bind(rotaController)))
  .put("/rotas/:id", AuthMiddleware, AuthPermission, asyncWrapper(rotaController.atualizar.bind(rotaController)))
  .delete("/rotas/:id", AuthMiddleware, AuthPermission, asyncWrapper(rotaController.deletar.bind(rotaController)))

export default router;
