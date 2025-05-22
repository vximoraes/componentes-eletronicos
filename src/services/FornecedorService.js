import FornecedorRepository from '../repositories/FornecedorRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class FornecedorService {
    constructor() {
        this.repository = new FornecedorRepository();
    };

    async listar(req) {
        const data = await this.repository.listar(req);

        return data;
    };

    async criar(parsedData) {
        await this.validateNome(parsedData.nome)

        const data = await this.repository.criar(parsedData);

        return data;
    };

    async atualizar(id, parsedData) {
        await this.ensureSupplierExists(id);
        await this.validateNome(parsedData.nome)

        const data = await this.repository.atualizar(id, parsedData);

        return data;
    };

    async deletar(id) {
        await this.ensureSupplierExists(id);

        const data = await this.repository.deletar(id);

        return data;
    };

    // Métodos auxiliares.

    async validateNome(nome, id = null) {
        const fornecedorExistente = await this.repository.buscarPorNome(nome, id);
        if (fornecedorExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'nome',
                details: [{ path: 'nome', message: 'Nome já está em uso.' }],
                customMessage: 'Nome já está em uso.',
            });
        };
    };

    async ensureSupplierExists(id) {
        const fornecedorExistente = await this.repository.buscarPorId(id);
        if (!fornecedorExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Fornecedor',
                details: [],
                customMessage: messages.error.resourceNotFound('Fornecedor'),
            });
        };

        return fornecedorExistente;
    };
};

export default FornecedorService;