import MovimentacaoService from '../services/MovimentacaoService.js';
import { MovimentacaoQuerySchema, MovimentacaoIdSchema } from '../utils/validators/schemas/zod/querys/MovimentacaoQuerySchema.js';
import { MovimentacaoSchema, MovimentacaoUpdateSchema } from '../utils/validators/schemas/zod/MovimentacaoSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class MovimentacaoController {
    constructor() {
        this.service = new MovimentacaoService();
    };

    async criar(req, res) {
        const parsedData = MovimentacaoSchema.parse(req.body);
        let data = await this.service.criar(parsedData);

        let movimentacaoLimpa = data.toObject();

        return CommonResponse.created(res, movimentacaoLimpa);
    };

    async listar(req, res) {
        const { id } = req.params || {};
        if (id) {
            MovimentacaoIdSchema.parse(id);
        };

        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await MovimentacaoQuerySchema.parseAsync(query);
        };

        const data = await this.service.listar(req);

        return CommonResponse.success(res, data);
    };
};

export default MovimentacaoController;