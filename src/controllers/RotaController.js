// src/controllers/RotaController.js

import RotaService from '../services/RotaService.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import { RotaQuerySchema, RotaIdSchema } from '../utils/validators/schemas/zod/querys/RotaQuerySchema.js';
import { RotaSchema, RotaUpdateSchema } from '../utils/validators/schemas/zod/RotaSchema.js';

class RotaController {
    constructor() {
        this.service = new RotaService();
    }

    /**
     * Validação nesta aplicação segue o segue este artigo:
     * https://docs.google.com/document/d/1m2Ns1rIxpUzG5kRsgkbaQFdm7od0e7HSHfaSrrwegmM/edit?usp=sharing
     */

    /**
     * Lista grupos. Se um ID é fornecido, retorna um único objeto.
     * Caso contrário, retorna todos os objetos com suporte a filtros e paginação.
     */
    async listar(req, res) {
        console.log('Estou no listar em RotaController, enviando req para RotaService');

        //1ª Validação estrutural - validação do ID passado por parâmetro
        const { id } = req.params || null;
        if (id) {
            RotaIdSchema.parse(id); // Lança erro automaticamente se inválido
        }

        // 2º Validação estrutural - validar os demais campos passados por query
        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            const validatedQuery = RotaQuerySchema.parse(req.query);
        }

        // Chama o serviço para listar as rotas
        const data = await this.service.listar(req);

        console.log('Estou retornando os dados em RotaController');
        return CommonResponse.success(res, data);
    }

    /**
     * Cria uma nova rota.
     */
    async criar(req, res) {
        console.log('Estou no criar em RotaController');

        // Validação dos dados de entrada usando Zod (estrutural)
        const parsedData = RotaSchema.parse(req.body);
        const data = await this.service.criar(parsedData);
        // Se chegou até aqui, é porque deu tudo certo, retornar 201 Created
        return CommonResponse.created(res, data);
    }

    /**
     *  Atualiza uma rota existente.
     */
    async atualizar(req, res) {
        console.log('Estou no atualizar em RotaController');

        // 1ª Validação estrutural - validação do ID passado por parâmetro
        const { id } = req.params || null;
        if (id) {
            RotaIdSchema.parse(id); // Lança erro automaticamente se inválido
        }

        // 2ª Validação estrutural - validar os demais campos passados por query
        const parsedData = RotaUpdateSchema.parse(req.body);

        // Chama o serviço para atualizar a rota
        const data = await this.service.atualizar(parsedData, id);

        // Se chegou até aqui, é porque deu tudo certo, retornar 200 OK
        return CommonResponse.success(res, data);
    }

    /**
     * Método para deletar uma rota existente.
     */
    async deletar(req, res) {
        console.log('Estou no deletar em RotaController');

        // 1ª Validação estrutural - validação do ID passado por parâmetro
        const { id } = req.params || null;
        if (id) {
            RotaIdSchema.parse(id); // Lança erro automaticamente se inválido
        }

        // Chama o serviço para deletar a rota
        const data = await this.service.deletar(req);
        return CommonResponse.success(res, data);
    }
}

export default RotaController;
