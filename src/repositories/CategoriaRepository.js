import CategoriaFilterBuilder from './filters/CategoriaFilterBuilder.js';
import CategoriaModel from '../models/Categoria.js';
import ComponenteModel from '../models/Componente.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class CategoriaRepository {
    constructor({
        categoriaModel = CategoriaModel,
    } = {}) {
        this.model = categoriaModel;
    };

    async criar(dadosCategoria) {
        const categoria = new this.model(dadosCategoria);
        return await categoria.save();
    };

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna a categoria enriquecida com estatísticas.
        if (id) {
            const data = await this.model.findById(id);

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Categoria',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Categoria')
                });
            };

            const dataWithStats = {
                ...data.toObject()
            };

            return dataWithStats;
        };

        const { nome, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new CategoriaFilterBuilder()
            .comNome(nome || '');

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Categoria',
                details: [],
                customMessage: messages.error.internalServerError('Categoria')
            });
        };

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limite, 10),
            sort: { nome: 1 }
        };

        const resultado = await this.model.paginate(filtros, options);

        // Enriquecer cada categoria com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const categoriaObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...categoriaObj,
            };
        });

        return resultado;
    };

    async atualizar(id, parsedData) {
        const categoria = await this.model.findByIdAndUpdate(id, parsedData, { new: true }).lean();
        if (!categoria) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Categoria',
                details: [],
                customMessage: messages.error.resourceNotFound('Categoria')
            });
        };

        return categoria;
    };

    async deletar(id) {
        const existeComponente = await ComponenteModel.exists({ categoria: id });
        if (existeComponente) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'resourceInUse',
                field: 'Categoria',
                details: [],
                customMessage: 'Não é possível deletar: categoria está vinculada a componentes.'
            });
        };

        const categoria = await this.model.findByIdAndDelete(id);
        return categoria;
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

        const categoria = await query;

        if (!categoria) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Categoria',
                details: [],
                customMessage: messages.error.resourceNotFound('Categoria')
            });
        };

        return categoria;
    };

};

export default CategoriaRepository;