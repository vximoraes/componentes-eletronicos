import express from "express";
// import AuthMiddleware from "../middlewares/AuthMiddleware.js";
// import authPermission from '../middlewares/AuthPermission.js';
import LocalizacaoController from '../controllers/LocalizacaoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const localizacaoController = new LocalizacaoController(); 

router
    .get("/localizacoes", /*AuthMiddleware, authPermission,*/ asyncWrapper(localizacaoController.listar.bind(localizacaoController)))
    .get("/localizacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(localizacaoController.listar.bind(localizacaoController)))
    .post("/localizacoes", /*AuthMiddleware, authPermission,*/ asyncWrapper(localizacaoController.criar.bind(localizacaoController)))
    .patch("/localizacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(localizacaoController.atualizar.bind(localizacaoController)))
    .put("/localizacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(localizacaoController.atualizar.bind(localizacaoController)))
    .delete("/localizacoes/:id", /*AuthMiddleware, authPermission,*/ asyncWrapper(localizacaoController.deletar.bind(localizacaoController)))

export default router;