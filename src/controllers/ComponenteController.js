import ComponenteService from '../services/ComponenteService.js';
import { ComponenteQuerySchema, ComponenteIdSchema } from '../utils/validators/schemas/zod/querys/ComponenteQuerySchema.js';
import { ComponenteSchema, ComponenteUpdateSchema } from '../utils/validators/schemas/zod/ComponenteSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class ComponenteController {
    constructor() {
        this.service = new ComponenteService();
    };

    async listar(req, res) {
        const { id } = req.params || {};
        if (id) {
            ComponenteIdSchema.parse(id);
        };

        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await ComponenteQuerySchema.parseAsync(query);
        };

        const data = await this.service.listar(req);

        return CommonResponse.success(res, data);
    };

    async criar(req, res) {
        const parsedData = ComponenteSchema.parse(req.body);
        let data = await this.service.criar(parsedData);

        let componenteLimpo = data.toObject();

        return CommonResponse.created(res, componenteLimpo);
    };

    async atualizar(req, res) {
        const { id } = req.params;
        ComponenteIdSchema.parse(id);

        const parsedData = ComponenteUpdateSchema.parse(req.body);
        const data = await this.service.atualizar(id, parsedData);

        return CommonResponse.success(res, data, 200, 'Componente atualizado com sucesso. Porém, a quantidade só pode ser alterada por movimentação.');
    };

    async deletar(req, res) {
        const { id } = req.params || {};
        ComponenteIdSchema.parse(id);

        const data = await this.service.deletar(id);

        return CommonResponse.success(res, data, 200, 'Componente excluído com sucesso.');
    };
};

export default ComponenteController;