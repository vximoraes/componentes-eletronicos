import MovimentacaoFilterBuilder from './filters/MovimentacaoFilterBuilder.js';
import MovimentacaoModel from '../models/Movimentacao.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class MovimentacaoRepository {
    constructor({
        movimentacaoModel = MovimentacaoModel,
    } = {}) {
        this.model = movimentacaoModel;
    };

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna a movimentação enriquecida com estatísticas.
        if (id) {
            const data = await this.model.findById(id)
                .populate('componente')
                .populate('fornecedor');

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Movimentacao',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Movimentacao')
                });
            };

            const dataWithStats = {
                ...data.toObject()
            };

            return dataWithStats;
        };

        const { tipo, data, quantidade, componente, fornecedor, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new MovimentacaoFilterBuilder()
            .comTipo(tipo || '')
            .comData(data || '')
            .comQuantidade(quantidade || '')

        await filterBuilder.comComponente(componente || '');
        await filterBuilder.comFornecedor(fornecedor || '');

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Movimentacao',
                details: [],
                customMessage: messages.error.internalServerError('Movimentacao')
            });
        };

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page),
            limit: parseInt(limite),
            populate: [
                'componente',
                'fornecedor'
            ],
            sort: { nome: 1 },
        };

        const resultado = await this.model.paginate(filtros, options);

        // Enriquecer cada movimentação com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const movimentacaoObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...movimentacaoObj
            };
        });

        return resultado;
    };

    // Métodos auxiliares.

    async buscarPorId(id, includeTokens = false) {
        let query = this.model.findById(id);

        const movimentacao = await query;

        if (!movimentacao) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Movimentacao',
                details: [],
                customMessage: messages.error.resourceNotFound('Movimentacao')
            });
        };

        return movimentacao;
    };
};

export default MovimentacaoRepository;