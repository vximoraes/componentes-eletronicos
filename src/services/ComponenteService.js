import ComponenteRepository from '../repositories/ComponenteRepository.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import LocalizacaoModel from '../models/Localizacao.js';
import CategoriaModel from '../models/Categoria.js';

class ComponenteService {
    constructor() {
        this.repository = new ComponenteRepository();
    };

    async criar(parsedData) {
        await this.validateNome(parsedData.nome);
        await this.validateLocalizacao(parsedData.localizacao);
        await this.validateCategoria(parsedData.categoria);

        const data = await this.repository.criar(parsedData);

        return data;
    };

    async listar(req) {
        const data = await this.repository.listar(req);

        return data;
    };

    async atualizar(id, parsedData) {
        await this.ensureComponentExists(id);
        await this.validateNome(parsedData.nome)

        delete parsedData.quantidade;

        const data = await this.repository.atualizar(id, parsedData);

        return data;
    };

    async deletar(id) {
        await this.ensureComponentExists(id);

        const data = await this.repository.deletar(id);

        return data;
    };

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
        };
    };

    async ensureComponentExists(id) {
        const componenteExistente = await this.repository.buscarPorId(id);
        if (!componenteExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Componente',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente'),
            });
        };

        return componenteExistente;
    };

    async validateLocalizacao(localizacaoId) {
        const localizacao = await LocalizacaoModel.findById(localizacaoId);
        if (!localizacao) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'localizacao',
                details: [{ path: 'localizacao', message: 'Localização não encontrada.' }],
                customMessage: 'Localização não encontrada.',
            });
        };
    };

    async validateCategoria(categoriaId) {
        const categoria = await CategoriaModel.findById(categoriaId);
        if (!categoria) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'categoria',
                details: [{ path: 'categoria', message: 'Categoria não encontrada.' }],
                customMessage: 'Categoria não encontrada.',
            });
        };
    };
};

export default ComponenteService;