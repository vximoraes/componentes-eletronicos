import OrcamentoService from '../services/OrcamentoService.js';
import { OrcamentoQuerySchema, OrcamentoIdSchema } from '../utils/validators/schemas/zod/querys/OrcamentoQuerySchema.js';
import { OrcamentoSchema, OrcamentoUpdateSchema } from '../utils/validators/schemas/zod/OrcamentoSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class OrcamentoController {
    constructor() {
        this.service = new OrcamentoService();
    };

    // async criar(req, res) {
    //     const parsedData = ComponenteSchema.parse(req.body);
    //     let data = await this.service.criar(parsedData);

    //     let componenteLimpo = data.toObject();

    //     return CommonResponse.created(res, componenteLimpo);
    // };

    async listar(req, res) {
        const { id } = req.params || {};
        if (id) {
            OrcamentoIdSchema.parse(id);
        };

        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await OrcamentoQuerySchema.parseAsync(query);
        };

        const data = await this.service.listar(req);

        return CommonResponse.success(res, data);
    };

    // async atualizar(req, res) {
    //     const { id } = req.params;
    //     ComponenteIdSchema.parse(id);

    //     const parsedData = ComponenteUpdateSchema.parse(req.body);
    //     const data = await this.service.atualizar(id, parsedData);

    //     return CommonResponse.success(res, data, 200, 'Componente atualizado com sucesso. Porém, a quantidade só pode ser alterada por movimentação.');
    // };

    // async deletar(req, res) {
    //     const { id } = req.params || {};
    //     ComponenteIdSchema.parse(id);

    //     const data = await this.service.deletar(id);

    //     return CommonResponse.success(res, data, 200, 'Componente excluído com sucesso.');
    // };
};

export default OrcamentoController;