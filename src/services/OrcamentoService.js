import OrcamentoRepository from '../repositories/OrcamentoRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import OrcamentoModel from '../models/Orcamento.js';

class OrcamentoService {
    constructor() {
        this.repository = new OrcamentoRepository();
    };

    async criar(parsedData) {
        await this.validateProtocolo(parsedData.protocolo);

        const data = await this.repository.criar(parsedData);

        return data;
    };

    async listar(req) {
        const data = await this.repository.listar(req);

        return data;
    };

    // async atualizar(id, parsedData) {
    //     await this.ensureComponentExists(id);
    //     await this.validateNome(parsedData.nome)

    //     delete parsedData.quantidade;

    //     const data = await this.repository.atualizar(id, parsedData);

    //     return data;
    // };

    // async deletar(id) {
    //     await this.ensureComponentExists(id);

    //     const data = await this.repository.deletar(id);

    //     return data;
    // };

    // Manipular componentes.

    async adicionarComponente(orcamentoId, novoComponente) {
        return await this.repository.adicionarComponente(orcamentoId, novoComponente);
    }

    async atualizarComponente(orcamentoId, componenteId, componenteAtualizado) {
        return await this.repository.atualizarComponente(orcamentoId, componenteId, componenteAtualizado);
    }

    async removerComponente(orcamentoId, componenteId) {
        return await this.repository.removerComponente(orcamentoId, componenteId);
    }

    async getComponenteById(orcamentoId, componenteId) {
        const orcamento = await this.repository.buscarPorId(orcamentoId);
        if (!orcamento) return null;

        const componentes = Array.isArray(orcamento.componentes) ? orcamento.componentes : [];
        const comp = componentes.find(c => c && c._id && c._id.toString() === componenteId);

        return comp || null;
    }

    // Métodos auxiliares.

    async validateProtocolo(protocolo, id = null) {
        const orcamentoExistente = await this.repository.buscarPorProtocolo(protocolo, id);
        if (orcamentoExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'protocolo',
                details: [{ path: 'protocolo', message: 'Protocolo já está em uso.' }],
                customMessage: 'Nome já está em uso.',
            });
        };
    };

    async ensureBudgetExists(id) {
        const orcamentoExistente = await this.repository.buscarPorId(id);
        if (!orcamentoExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Orçamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Orçamento'),
            });
        };

        return orcamentoExistente;
    };
};

export default OrcamentoService;