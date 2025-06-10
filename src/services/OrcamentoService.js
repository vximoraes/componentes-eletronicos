import OrcamentoRepository from '../repositories/OrcamentoRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import OrcamentoModel from '../models/Orcamento.js';

class OrcamentoService {
    constructor() {
        this.repository = new OrcamentoRepository();
    };

    // async criar(parsedData) {
    //     await this.validateNome(parsedData.nome);
    //     await this.validateLocalizacao(parsedData.localizacao);
    //     await this.validateCategoria(parsedData.categoria);

    //     const data = await this.repository.criar(parsedData);

    //     return data;
    // };

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

    // Métodos auxiliares.

    async validateNome(nome, id = null) {
        const orcamentoExistente = await this.repository.buscarPorNome(nome, id);
        if (orcamentoExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'nome',
                details: [{ path: 'nome', message: 'Nome já está em uso.' }],
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