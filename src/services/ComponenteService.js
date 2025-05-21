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
}

export default ComponenteService;