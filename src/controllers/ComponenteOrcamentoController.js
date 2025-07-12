import ComponenteOrcamentoService from '../services/ComponenteOrcamentoService.js';
import { ComponenteOrcamentoQuerySchema, ComponenteOrcamentoIdSchema } from '../utils/validators/schemas/zod/querys/ComponenteOrcamentoQuerySchema.js';
import { ComponenteOrcamentoSchema, ComponenteOrcamentoUpdateSchema } from '../utils/validators/schemas/zod/OrcamentoSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class ComponenteOrcamentoController {
    constructor() {
        this.service = new ComponenteOrcamentoService();
    };

    async criar(req, res) {
        const parsedData = ComponenteOrcamentoSchema.parse(req.body);
        
        const quantidade = Number(parsedData.quantidade);
        const valor_unitario = Number(parsedData.valor_unitario);
        parsedData.subtotal = quantidade * valor_unitario;

        let data = await this.service.criar(parsedData);
        let componenteLimpo = data.toObject();

        return CommonResponse.created(res, componenteLimpo);
    };

    async listar(req, res) {
        const { id } = req.params || {};
        if (id) {
            ComponenteOrcamentoIdSchema.parse(id);
        };

        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await ComponenteOrcamentoQuerySchema.parseAsync(query);
        };

        const data = await this.service.listar(req);

        return CommonResponse.success(res, data);
    };

    async atualizar(req, res) {
        const { id } = req.params;
        ComponenteOrcamentoIdSchema.parse(id);

        const parsedData = ComponenteOrcamentoUpdateSchema.parse(req.body);

        if (parsedData.quantidade !== undefined || parsedData.valor_unitario !== undefined) {
            const componente = await this.service.ensureComponenteExists(id);
            const novaQuantidade = parsedData.quantidade !== undefined ? Number(parsedData.quantidade) : componente.quantidade;
            const novoValor = parsedData.valor_unitario !== undefined ? Number(parsedData.valor_unitario) : componente.valor_unitario;
            parsedData.subtotal = novaQuantidade * novoValor;
        }

        const data = await this.service.atualizar(id, parsedData);

        return CommonResponse.success(res, data);
    };

    async deletar(req, res) {
        const { id } = req.params || {};
        ComponenteOrcamentoIdSchema.parse(id);

        const data = await this.service.deletar(id);

        return CommonResponse.success(res, data, 200, 'Componente de orçamento excluído com sucesso.');
    };
};

export default ComponenteOrcamentoController;