import FornecedorFilterBuilder from './filters/FornecedorFilterBuilder.js';
import FornecedorModel from '../models/Fornecedor.js';
import MovimentacaoModel from '../models/Movimentacao.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class FornecedorRepository {
    constructor({
        fornecedorModel = FornecedorModel,
    } = {}) {
        this.model = fornecedorModel;
    };

    async criar(dadosFornecedor) {
        const fornecedor = new this.model(dadosFornecedor);
        return await fornecedor.save();
    };

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna o fornecedor enriquecido com estatísticas.
        if (id) {
            const data = await this.model.findById(id);

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Fornecedor',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Fornecedor')
                });
            };

            const dataWithStats = {
                ...data.toObject()
            };

            return dataWithStats;
        };

        const { nome, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new FornecedorFilterBuilder()
            .comNome(nome || '');

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Fornecedor',
                details: [],
                customMessage: messages.error.internalServerError('Fornecedor')
            });
        };

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limite, 10),
            sort: { nome: 1 }
        };

        const resultado = await this.model.paginate(filtros, options);

        // Enriquecer cada fornecedor com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const fornecedorObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...fornecedorObj,
            };
        });

        return resultado;
    };

    async atualizar(id, parsedData) {
        const fornecedor = await this.model.findByIdAndUpdate(id, parsedData, { new: true }).exec();
        if (!fornecedor) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Fornecedor',
                details: [],
                customMessage: messages.error.resourceNotFound('Fornecedor')
            });
        };

        return fornecedor;
    };

    async deletar(id) {
        const existeMovimentacao = await MovimentacaoModel.exists({ fornecedor: id });
        if (existeMovimentacao) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'resourceInUse',
                field: 'Fornecedor',
                details: [],
                customMessage: 'Não é possível deletar: fornecedor está vinculado a movimentações.'
            });
        };

        const fornecedor = await this.model.findByIdAndDelete(id);
        return fornecedor;
    };

    // Métodos auxiliares.

    async buscarPorNome(nome, idIgnorado) {
        const filtro = { nome };

        if (idIgnorado) {
            filtro._id = { $ne: idIgnorado };
        };

        const documento = await this.model.findOne(filtro);

        return documento;
    };

    async buscarPorId(id, includeTokens = false) {
        let query = this.model.findById(id);

        // if (includeTokens) {
        //     query = query.select('+refreshtoken +accesstoken');
        // };

        const fornecedor = await query;

        if (!fornecedor) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Fornecedor',
                details: [],
                customMessage: messages.error.resourceNotFound('Fornecedor')
            });
        };

        return fornecedor;
    };
};

export default FornecedorRepository;