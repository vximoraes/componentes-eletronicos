import LocalizacaoFilterBuilder from './filters/LocalizacaoFilterBuilder.js';
import LocalizacaoModel from '../models/Localizacao.js';
import ComponenteModel from '../models/Componente.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class LocalizacaoRepository {
    constructor({
        localizacaoModel = LocalizacaoModel,
    } = {}) {
        this.model = localizacaoModel;
    };

    // Buscar localização por um ID diferente.

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
        // }

        const localizacao = await query;

        if (!localizacao) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Localizacao',
                details: [],
                customMessage: messages.error.resourceNotFound('Localizacao')
            });
        };

        return localizacao;
    };

    // Métodos CRUD.

    async criar(dadosLocalizacao) {
        const localizacao = new this.model(dadosLocalizacao);
        return await localizacao.save();
    };

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna a localização enriquecida com estatísticas.
        if (id) {
            const data = await this.model.findById(id);

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Localizacao',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Localizacao')
                });
            };

            const dataWithStats = {
                ...data.toObject()
            };

            return dataWithStats;
        };

        const { nome, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new LocalizacaoFilterBuilder()
            .comNome(nome || '');

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Localizacao',
                details: [],
                customMessage: messages.error.internalServerError('Localizacao')
            });
        };

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limite, 10),
            sort: { nome: 1 }
        };

        const resultado = await this.model.paginate(filtros, options);

        // Enriquecer cada localização com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const localizacaoObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...localizacaoObj,
            };
        });

        return resultado;
    };

    async atualizar(id, parsedData) {
        const localizacao = await this.model.findByIdAndUpdate(id, parsedData, { new: true }).exec();
        if (!localizacao) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Localizacao',
                details: [],
                customMessage: messages.error.resourceNotFound('Localizacao')
            });
        };

        return localizacao;
    };

    async deletar(id) {
        const existeComponente = await ComponenteModel.exists({ localizacao: id });
        if (existeComponente) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'resourceInUse',
                field: 'Localizacao',
                details: [],
                customMessage: 'Não é possível deletar: localizacão está vinculada a componentes.'
            });
        };

        const localizacao = await this.model.findByIdAndDelete(id);
        return localizacao;
    };
};

export default LocalizacaoRepository;