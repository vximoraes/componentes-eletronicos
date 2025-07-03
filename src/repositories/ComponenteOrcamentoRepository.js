import ComponenteOrcamentoFilterBuilder from './filters/ComponenteOrcamentoFilterBuilder.js';
import ComponenteOrcamentoModel from '../models/ComponenteOrcamento.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class ComponenteOrcamentoRepository {
    constructor({
        componenteOrcamentoModel = ComponenteOrcamentoModel,
    } = {}) {
        this.model = componenteOrcamentoModel;
    }

    async criar(dadosComponente) {
        const componente = new this.model(dadosComponente);
        const componenteSalvo = await componente.save();
        return componenteSalvo.toObject();
    }

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna o componente específico
        if (id) {
            const data = await this.model.findById(id);

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'ComponenteOrcamento',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Componente de Orçamento')
                });
            }

            return data.toObject();
        }

        const { nome, fornecedor, quantidade, valor_unitario, subtotal, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new ComponenteOrcamentoFilterBuilder()
            .comNome(nome || '')
            .comFornecedor(fornecedor || '')
            .comQuantidade(quantidade || '');

        if (valor_unitario) {
            filterBuilder.comValorUnitarioMinimo(valor_unitario.min)
                       .comValorUnitarioMaximo(valor_unitario.max);
        }

        if (subtotal) {
            filterBuilder.comSubtotalMinimo(subtotal.min)
                         .comSubtotalMaximo(subtotal.max);
        }

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'ComponenteOrcamento',
                details: [],
                customMessage: messages.error.internalServerError('Componente de Orçamento')
            });
        }

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page),
            limit: parseInt(limite),
            sort: { nome: 1 },
        };

        const resultado = await this.model.paginate(filtros, options);

        // Converter documentos para objetos simples
        resultado.docs = resultado.docs.map(doc => doc.toObject());

        return resultado;
    }

    async atualizar(id, parsedData) {
        const componente = await this.model.findByIdAndUpdate(id, parsedData, { 
            new: true,
            runValidators: true 
        });

        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'ComponenteOrcamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente de Orçamento')
            });
        }

        return componente.toObject();
    }

    async deletar(id) {
        const componente = await this.model.findById(id);

        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'ComponenteOrcamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente de Orçamento')
            });
        }

        await this.model.findByIdAndDelete(id);
        return componente.toObject();
    }

    // Métodos auxiliares

    async buscarPorId(id) {
        const componente = await this.model.findById(id);

        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'ComponenteOrcamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente de Orçamento')
            });
        }

        return componente.toObject();
    }

    async buscarPorNome(nome, idIgnorado) {
        const filtro = { nome };

        if (idIgnorado) {
            filtro._id = { $ne: idIgnorado };
        }

        const documento = await this.model.findOne(filtro);
        return documento ? documento.toObject() : null;
    }
}

export default ComponenteOrcamentoRepository;