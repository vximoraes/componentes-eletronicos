import CategoriaService from '../services/CategoriaService.js';
import { CategoriaQuerySchema, CategoriaIdSchema } from '../utils/validators/schemas/zod/querys/CategoriaQuerySchema.js';
import { CategoriaSchema, CategoriaUpdateSchema } from '../utils/validators/schemas/zod/CategoriaSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class CategoriaController {
    constructor() {
        this.service = new CategoriaService();
    }

    async listar(req, res) {
        const { id } = req.params || {};
        if (id) {
            CategoriaIdSchema.parse(id);
        }

        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await CategoriaQuerySchema.parseAsync(query);
        }

        const data = await this.service.listar(req);

        return CommonResponse.success(res, data);
    }

    async criar(req, res) {
        const parsedData = CategoriaSchema.parse(req.body);
        let data = await this.service.criar(parsedData);

        let categoriaLimpa = data.toObject();

        return CommonResponse.created(res, categoriaLimpa);
    }

    async atualizar(req, res) {
        const { id } = req.params;
        CategoriaIdSchema.parse(id);

        const parsedData = CategoriaUpdateSchema.parse(req.body);
        const data = await this.service.atualizar(id, parsedData);

        return CommonResponse.success(res, data, 200, 'Categoria atualizada com sucesso.');
    }

    async deletar(req, res) {
        const { id } = req.params || {};
        CategoriaIdSchema.parse(id);

        const data = await this.service.deletar(id);

        return CommonResponse.success(res, data, 200, 'Categoria excluída com sucesso.');
    }
}

export default CategoriaController;