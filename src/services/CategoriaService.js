import CategoriaRepository from '../repositories/CategoriaRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class CategoriaService {
    constructor() {
        this.repository = new CategoriaRepository();
    }

    async listar(req) {
        const data = await this.repository.listar(req);

        return data;
    }

    async criar(parsedData) {
        await this.validateNome(parsedData.nome)

        const data = await this.repository.criar(parsedData);

        return data;
    }

    async atualizar(id, parsedData) {
        await this.ensureCategoryExists(id);
        await this.validateNome(parsedData.nome)

        const data = await this.repository.atualizar(id, parsedData);

        return data;
    }

    async deletar(id) {
        await this.ensureCategoryExists(id);

        const data = await this.repository.deletar(id);

        return data;
    }

    // Métodos auxiliares.

    async validateNome(nome, id = null) {
        const categoriaExistente = await this.repository.buscarPorNome(nome, id);
        if (categoriaExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'nome',
                details: [{ path: 'nome', message: 'Nome já está em uso.' }],
                customMessage: 'Nome já está em uso.',
            });
        }
    }

    async ensureCategoryExists(id) {
        const categoriaExistente = await this.repository.buscarPorId(id);
        if (!categoriaExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Categoria',
                details: [],
                customMessage: messages.error.resourceNotFound('Categoria'),
            });
        }

        return categoriaExistente;
    }
}

export default CategoriaService;