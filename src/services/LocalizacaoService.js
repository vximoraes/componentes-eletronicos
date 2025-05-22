import LocalizacaoRepository from '../repositories/LocalizacaoRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class LocalizacaoService {
    constructor() {
        this.repository = new LocalizacaoRepository();
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
        await this.ensureLocationExists(id);
        await this.validateNome(parsedData.nome)

        const data = await this.repository.atualizar(id, parsedData);

        return data;
    }

    async deletar(id) {
        await this.ensureLocationExists(id);

        const data = await this.repository.deletar(id);

        return data;
    }

    // Métodos auxiliares.

    async validateNome(nome, id = null) {
        const localizacaoExistente = await this.repository.buscarPorNome(nome, id);
        if (localizacaoExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'nome',
                details: [{ path: 'nome', message: 'Nome já está em uso.' }],
                customMessage: 'Nome já está em uso.',
            });
        }
    }

    async ensureLocationExists(id) {
        const localizacaoExistente = await this.repository.buscarPorId(id);
        if (!localizacaoExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Localizacao',
                details: [],
                customMessage: messages.error.resourceNotFound('Localizacao'),
            });
        }

        return localizacaoExistente;
    }
}

export default LocalizacaoService;