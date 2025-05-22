import ComponenteFilterBuilder from './filters/ComponenteFilterBuilder.js';
import ComponenteModel from '../models/Componente.js';
import MovimentacaoModel from '../models/Movimentacao.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class ComponenteRepository {
    constructor({
        componenteModel = ComponenteModel,
    } = {}) {
        this.model = componenteModel;
    };

    async criar(dadosComponente) {
        const componente = new this.model(dadosComponente);
        return await componente.save();
    };

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna o componente enriquecido com estatísticas.
        if (id) {
            const data = await this.model.findById(id)
                .populate('localizacao')
                .populate('categoria');

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Componente',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Componente')
                });
            };

            const dataWithStats = {
                ...data.toObject()
            };

            return dataWithStats;
        };

        const { nome, quantidade, estoque_minimo, localizacao, categoria, ativo, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new ComponenteFilterBuilder()
            .comNome(nome || '')
            .comQuantidade(quantidade || '')
            .comEstoqueMinimo(estoque_minimo || '')
            .comAtivo(ativo || '');

        await filterBuilder.comLocalizacao(localizacao || '');
        await filterBuilder.comCategoria(categoria || '');

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Componente',
                details: [],
                customMessage: messages.error.internalServerError('Componente')
            });
        };

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page),
            limit: parseInt(limite),
            populate: [
                'localizacao',
                'categoria'
            ],
            sort: { nome: 1 },
        };

        const resultado = await this.model.paginate(filtros, options);

        // Enriquecer cada componente com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const componenteObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...componenteObj
            };
        });

        return resultado;
    };

    async atualizar(id, parsedData) {
        const componente = await this.model.findByIdAndUpdate(id, parsedData, { new: true }).exec();
        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Componente',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente')
            });
        };

        return componente;
    };

    async deletar(id) {
        const existeMovimentacao = await MovimentacaoModel.exists({ componente: id });
        if (existeMovimentacao) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'resourceInUse',
                field: 'Componente',
                details: [],
                customMessage: 'Não é possível deletar: componente está vinculado a movimentações.'
            });
        };

        const componente = await this.model.findByIdAndDelete(id);
        return componente;
    };

    // Métodos auxiliares.

    async buscarPorId(id, includeTokens = false) {
        let query = this.model.findById(id);

        const componente = await query;

        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Componente',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente')
            });
        };

        return componente;
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

export default ComponenteRepository;