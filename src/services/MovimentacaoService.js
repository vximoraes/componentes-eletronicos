import MovimentacaoRepository from '../repositories/MovimentacaoRepository.js';
import Componente from '../models/Componente.js';
import Fornecedor from '../models/Fornecedor.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class MovimentacaoService {
    constructor() {
        this.repository = new MovimentacaoRepository();
    };

    async criar(parsedData) {
        // Buscar o componente relacionado.
        const componente = await Componente.findById(parsedData.componente);
        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Componente',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente')
            });
        };

        // Se tipo for entrada, validar fornecedor.
        if (parsedData.tipo === 'entrada') {
            if (!parsedData.fornecedor) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'validationError',
                    field: 'fornecedor',
                    details: [{ path: 'fornecedor', message: 'Fornecedor é obrigatório para movimentações de entrada.' }],
                    customMessage: 'Fornecedor é obrigatório para movimentações de entrada.'
                });
            };
            const fornecedor = await Fornecedor.findById(parsedData.fornecedor);
            if (!fornecedor) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Fornecedor',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Fornecedor')
                });
            };
        };

        const now = new Date();
        now.setHours(now.getHours() - 4);
        now.setDate(now.getDate() - 1);
        parsedData.data_hora = now.toISOString().slice(0, 23).replace('T', ' ');

        // Atualizar quantidade conforme o tipo.
        if (parsedData.tipo === 'entrada') {
            componente.quantidade += parsedData.quantidade;
        } else if (parsedData.tipo === 'saida') {
            if (componente.quantidade < parsedData.quantidade) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'validationError',
                    field: 'quantidade',
                    details: [{ path: 'quantidade', message: 'Quantidade insuficiente em estoque.' }],
                    customMessage: 'Quantidade insuficiente em estoque.'
                });
            }
            componente.quantidade -= parsedData.quantidade;
            delete parsedData.fornecedor;
        };

        await componente.save();

        const data = await this.repository.criar(parsedData);
        return data;
    };

    async listar(req) {
        const data = await this.repository.listar(req);

        return data;
    };
};

export default MovimentacaoService;