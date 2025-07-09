import GrupoService from '../services/GrupoService.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import { GrupoQuerySchema, GrupoIdSchema } from '../utils/validators/schemas/zod/querys/GrupoQuerySchema.js';
import { GrupoSchema, GrupoUpdateSchema } from '../utils/validators/schemas/zod/GrupoSchema.js';

class GrupoController {
    constructor() {
        this.service = new GrupoService();
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
        console.log('Estou no listar em GrupoController, enviando  req para GrupoService');

        //1ª Validação estrutural - validação do ID passado por parâmetro
        const { id } = req.params || null;

        console.log('ID recebido:', id);
        if (id) {
            GrupoIdSchema.parse(id); // Lança erro automaticamente se inválido
        }

        // 2º Validação estrutural - validar os demais campos passados por query
        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            const validatedQuery = GrupoQuerySchema.parse(req.query);
        }

        // Chama o serviço para listar os grupos
        const data = await this.service.listar(req);

        console.log('Estou retornando os dados em GrupoController');
        return CommonResponse.success(res, data);
    }

    /**
     * Criar um novo grupo.
     */
    async criar(req, res) {
        console.log('Estou no criar em GrupoController');

        // Validação dos dados de entrada usando Zod (estrutural)
        const parsedData = GrupoSchema.parse(req.body);

        const data = await this.service.criar(parsedData);

        // Se chegou até aqui, é porque deu tudo certo, retornar 201 Created 
        return CommonResponse.created(res, data);
    }

    /**
     * Atualiza um grupo existente.
     */
    async atualizar(req, res) {
        console.log('Estou no atualizar em GrupoController');

        //1ª Validação estrutural - validação do ID passado por parâmetro
        const { id } = req.params || null;
        if (id) {
            GrupoIdSchema.parse(id); // Lança erro automaticamente se inválido
        }

        // Validação dos dados de entrada usando Zod (estrutural)
        const parsedData = GrupoUpdateSchema.parse(req.body);

        // Chama o serviço para atualizar o grupo
        const data = await this.service.atualizar(parsedData, id);

        // Se chegou até aqui, é porque deu tudo certo, retornar 200 OK
        return CommonResponse.success(res, data);
    }

    /**
     * Deleta um grupo existente.
     */
    async deletar(req, res) {
        console.log('Estou no deletar em GrupoController');
    
        // Validação estrutural - validação do ID passado por parâmetro
        const { id } = req.params || null;
        if (!id) {
            throw new CustomError('ID do grupo é obrigatório para deletar.', HttpStatusCodes.BAD_REQUEST);
        }
    
        // Chama o serviço para deletar o grupo
        const data = await this.service.deletar(id);
    
        // Se chegou até aqui, é porque deu tudo certo, retornar 200 OK
        return CommonResponse.success(res, data, 200, 'Grupo excluído com sucesso.');
    }
}

export default GrupoController;
