import OrcamentoFilterBuilder from './filters/OrcamentoFilterBuilder.js';
import OrcamentoModel from '../models/Orcamento.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class OrcamentoRepository {
    constructor({
        orcamentoModel = OrcamentoModel,
    } = {}) {
        this.model = orcamentoModel;
    };

    // async criar(dadosComponente) {
    //     const componente = new this.model(dadosComponente);
    //     const componenteSalvo = await componente.save();
    //     return await this.model.findById(componenteSalvo._id)
    //         .populate('localizacao')
    //         .populate('categoria')
    // };

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna o orçamento enriquecido com estatísticas.
        if (id) {
            const data = await this.model.findById(id)

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Orçamento',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Orçamento')
                });
            };

            const dataWithStats = {
                ...data.toObject()
            };

            return dataWithStats;
        };

        const { nome, protocolo, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new OrcamentoFilterBuilder()
            .comNome(nome || '')
            .comProtocolo(protocolo || '')

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Orçamento',
                details: [],
                customMessage: messages.error.internalServerError('Orçamento')
            });
        };

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page),
            limit: parseInt(limite),
            sort: { nome: 1 },
        };

        const resultado = await this.model.paginate(filtros, options);

        // Enriquecer cada orçamento com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const orcamentoObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...orcamentoObj
            };
        });

        return resultado;
    };

    // async atualizar(id, parsedData) {
    //     const componente = await this.model.findByIdAndUpdate(id, parsedData, { new: true })
    //         .populate('localizacao')
    //         .populate('categoria')
    //         .lean();
    //     if (!componente) {
    //         throw new CustomError({
    //             statusCode: 404,
    //             errorType: 'resourceNotFound',
    //             field: 'Componente',
    //             details: [],
    //             customMessage: messages.error.resourceNotFound('Componente')
    //         });
    //     };

    //     return componente;
    // };

    // async deletar(id) {
    //     const existeMovimentacao = await MovimentacaoModel.exists({ componente: id });
    //     if (existeMovimentacao) {
    //         throw new CustomError({
    //             statusCode: 400,
    //             errorType: 'resourceInUse',
    //             field: 'Componente',
    //             details: [],
    //             customMessage: 'Não é possível deletar: componente está vinculado a movimentações.'
    //         });
    //     };

    //     const componente = await this.model.findById(id)
    //         .populate('localizacao')
    //         .populate('categoria');

    //     if (!componente) {
    //         throw new CustomError({
    //             statusCode: 404,
    //             errorType: 'resourceNotFound',
    //             field: 'Componente',
    //             details: [],
    //             customMessage: messages.error.resourceNotFound('Componente')
    //         });
    //     }

    //     await this.model.findByIdAndDelete(id);
    //     return componente;
    // };

    // Métodos auxiliares.

    async buscarPorId(id, includeTokens = false) {
        let query = this.model.findById(id);

        const orcamento = await query;

        if (!orcamento) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Orçamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Orçamento')
            });
        };

        return orcamento;
    };

    async buscarPorNome(nome, idIgnorado) {
        const filtro = { nome };

        if (idIgnorado) {
            filtro._id = { $ne: idIgnorado }
        };

        const documento = await this.model.findOne(filtro)
            .populate('localizacao')
            .populate('categoria');

        return documento;
    };
};

export default OrcamentoRepository;