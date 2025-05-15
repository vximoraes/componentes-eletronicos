import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import DbConnect from './config/DbConnect.js';
import errorHandler from './utils/helpers/errorHandler.js';
import logger from './utils/logger.js';
import CommonResponse from './utils/helpers/CommonResponse.js';

const app = express();

await DbConnect.conectar();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

// Middleware para lidar com rotas não encontradas (404).
app.use((req, res, next) => {
    return CommonResponse.error(
        res,
        404,
        'resourceNotFound',
        null,
        [{ message: 'Rota não encontrada.' }]
    );
});

// Listeners para erros não tratados.
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
});

// Middleware de Tratamento de Erros (deve ser adicionado após as rotas).
app.use(errorHandler);

export default app;