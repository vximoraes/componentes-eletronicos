import ComponenteOrcamentoFilterBuilder from './filters/ComponenteOrcamentoFilterBuilder.js';
import ComponenteOrcamentoModel from '../models/ComponenteOrcamento.js';
import { CustomError, messages } from '../utils/helpers/index.js';

class ComponenteOrcamentoRepository {
    constructor({ componenteOrcamentoModel = ComponenteOrcamentoModel } = {}) {
        this.model = componenteOrcamentoModel;
    };

    async criar(dadosComponente) {
        const componente = new this.model(dadosComponente);
        const componenteSalvo = await componente.save();
        return await this.model.findById(componenteSalvo._id).lean();
    };

    async listar(req) {
        const id = req.params.id || null;

        if (id) {
            const data = await this.model.findById(id).lean();

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'ComponenteOrcamento',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Componente de Orçamento'),
                });
            }

            return data;
        }

        const {
            nome,
            fornecedor,
            quantidade,
            valor_unitario_min,
            valor_unitario_max,
            subtotal_min,
            subtotal_max,
            page = 1,
            limite = 10,
        } = req.query;

        const filterBuilder = new ComponenteOrcamentoFilterBuilder()
            .comNome(nome || '')
            .comFornecedor(fornecedor || '')
            .comQuantidade(quantidade || '')
            .comValorUnitarioMinimo(valor_unitario_min || '')
            .comValorUnitarioMaximo(valor_unitario_max || '')
            .comSubtotalMinimo(subtotal_min || '')
            .comSubtotalMaximo(subtotal_max || '');

        const filtros = filterBuilder.build();

        const options = {
            page: parseInt(page),
            limit: Math.min(parseInt(limite), 100),
            sort: { nome: 1 },
        };

        const resultado = await this.model.paginate(filtros, options);
        resultado.docs = resultado.docs.map(doc => doc.toObject());

        return resultado;
    };

    async atualizar(id, parsedData) {
        const componente = await this.model.findByIdAndUpdate(id, parsedData, {
            new: true,
            runValidators: true,
        }).lean();

        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'ComponenteOrcamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente de Orçamento'),
            });
        }

        return componente;
    };

    async deletar(id) {
        const componente = await this.model.findById(id);

        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'ComponenteOrcamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente de Orçamento'),
            });
        }

        await this.model.findByIdAndDelete(id);
        return componente.toObject();
    };

    // Métodos auxiliares

    async buscarPorId(id) {
        const componente = await this.model.findById(id);

        if (!componente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'ComponenteOrcamento',
                details: [],
                customMessage: messages.error.resourceNotFound('Componente de Orçamento'),
            });
        }

        return componente.toObject();
    };

    async buscarPorNome(nome, idIgnorado) {
        const filtro = { nome };

        if (idIgnorado) {
            filtro._id = { $ne: idIgnorado };
        }

        const documento = await this.model.findOne(filtro);
        return documento ? documento.toObject() : null;
    };
};

export default ComponenteOrcamentoRepository;
