import LocalizacaoService from '../services/LocalizacaoService.js';
import { LocalizacaoQuerySchema, LocalizacaoIdSchema } from '../utils/validators/schemas/zod/querys/LocalizacaoQuerySchema.js';
import { LocalizacaoSchema, LocalizacaoUpdateSchema } from '../utils/validators/schemas/zod/LocalizacaoSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class LocalizacaoController {
    constructor() {
        this.service = new LocalizacaoService();
    };

    async criar(req, res) {
        const parsedData = LocalizacaoSchema.parse(req.body);
        let data = await this.service.criar(parsedData);

        let localizacaoLimpa = data.toObject();

        return CommonResponse.created(res, localizacaoLimpa);
    };

    async listar(req, res) {
        const { id } = req.params || {};
        if (id) {
            LocalizacaoIdSchema.parse(id);
        };

        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await LocalizacaoQuerySchema.parseAsync(query);
        };

        const data = await this.service.listar(req);

        return CommonResponse.success(res, data);
    };

    async atualizar(req, res) {
        const { id } = req.params;
        LocalizacaoIdSchema.parse(id);

        const parsedData = LocalizacaoUpdateSchema.parse(req.body);
        const data = await this.service.atualizar(id, parsedData);

        return CommonResponse.success(res, data, 200, 'Localização atualizada com sucesso.');
    };

    async deletar(req, res) {
        const { id } = req.params || {};
        LocalizacaoIdSchema.parse(id);

        const data = await this.service.deletar(id);

        return CommonResponse.success(res, data, 200, 'Localização excluída com sucesso.');
    };
};

export default LocalizacaoController;