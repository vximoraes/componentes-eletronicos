import bcrypt from 'bcrypt';
import ComponenteRepository from '../repositories/ComponenteRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
// import AuthHelper from '../utils/AuthHelper.js';

class ComponenteService {
    constructor() {
        this.repository = new ComponenteRepository();
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

    // Métodos auxiliares.

    async validateNome(nome, id = null) {
        const componenteExistente = await this.repository.buscarPorNome(nome, id);
        if (componenteExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'nome',
                details: [{ path: 'nome', message: 'Nome já está em uso.' }],
                customMessage: 'Nome já está em uso.',
            });
        }
    }
}

export default ComponenteService;