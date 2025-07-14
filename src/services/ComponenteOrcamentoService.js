import ComponenteOrcamentoRepository from '../repositories/ComponenteOrcamentoRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, messages } from '../utils/helpers/index.js';
import OrcamentoModel from '../models/Orcamento.js';
import ComponenteModel from '../models/Componente.js';

class ComponenteOrcamentoService {
    constructor() {
        this.repository = new ComponenteOrcamentoRepository();
    }

    async criar(parsedData) {
        await this.validateOrcamento(parsedData.orcamento);
        await this.validateComponente(parsedData.componente);

        const data = await this.repository.criar(parsedData);
        return data;
    }

    async listar(req) {
        const data = await this.repository.listar(req);
        return data;
    }

    async atualizar(id, parsedData) {
        await this.ensureRelationExists(id);
        await this.validateComponente(parsedData.componente);
        await this.validateOrcamento(parsedData.orcamento);

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    async deletar(id) {
        await this.ensureRelationExists(id);

        const data = await this.repository.deletar(id);
        return data;
    }

    // Métodos auxiliares

    async ensureRelationExists(id) {
        const relacaoExistente = await this.repository.buscarPorId(id);
        if (!relacaoExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'ComponenteOrçamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente no Orçamento'),
            });
        }

        return relacaoExistente;
    }

    async validateOrcamento(orcamentoId) {
        const orcamento = await OrcamentoModel.findById(orcamentoId);
        if (!orcamento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'orcamento',
                details: [{ path: 'orcamento', message: 'Orçamento não encontrado.' }],
                customMessage: 'Orçamento não encontrado.',
            });
        }
    }

    async validateComponente(componenteId) {
        const componente = await ComponenteModel.findById(componenteId);
        if (!componente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'componente',
                details: [{ path: 'componente', message: 'Componente não encontrado.' }],
                customMessage: 'Componente não encontrado.',
            });
        }
    }
}

export default ComponenteOrcamentoService;
