import MovimentacaoRepository from '../repositories/MovimentacaoRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class MovimentacaoService {
    constructor() {
        this.repository = new MovimentacaoRepository();
    };

    async listar(req) {
        const data = await this.repository.listar(req);

        return data;
    };
};

export default MovimentacaoService;