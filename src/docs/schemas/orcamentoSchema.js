import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/swagger_utils/removeFields.js';
import Orcamento from '../../models/Orcamento.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const orcamentoJsonSchema = Orcamento.schema.jsonSchema();
delete orcamentoJsonSchema.properties.__v;

const orcamentosSchemas = {
    OrcamentoFiltro: {
        type: "object",
        properties: {
            nome: orcamentoJsonSchema.properties.nome,
            protocolo: orcamentoJsonSchema.properties.protocolo,
            valor: orcamentoJsonSchema.properties.valor,
        }
    },
    OrcamentoListagem: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/OrcamentoItem"
                }
            },
            totalDocs: { type: "number", example: 100 },
            limit: { type: "number", example: 10 },
            totalPages: { type: "number", example: 10 },
            page: { type: "number", example: 1 },
            pagingCounter: { type: "number", example: 1 },
            hasPrevPage: { type: "boolean", example: false },
            hasNextPage: { type: "boolean", example: true },
            prevPage: { type: "number", nullable: true, example: null },
            nextPage: { type: "number", example: 2 }
        },
        description: "Schema para listagem paginada de orçamentos"
    },
    OrcamentoItem: {
        ...deepCopy(orcamentoJsonSchema),
        description: "Schema para item de orçamento na listagem"
    },
    OrcamentoDetalhes: {
        ...deepCopy(orcamentoJsonSchema),
        description: "Schema para detalhes de um orçamento"
    },
    OrcamentoPost: {
        type: "object",
        properties: {
            nome: orcamentoJsonSchema.properties.nome,
            descricao: orcamentoJsonSchema.properties.descricao,
            componente_orcamento: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        nome: { type: "string", example: "Resistor 10k" },
                        fornecedor: { type: "string", example: "Fornecedor ABC" },
                        quantidade: { type: "string", example: "10" },
                        valor_unitario: { type: "string", example: "0.50" }
                    },
                    required: ["nome", "fornecedor", "quantidade", "valor_unitario"]
                }
            }
        },
        required: ["nome", "componente_orcamento"],
        description: "Schema para criação de orçamento"
    },
    OrcamentoUpdate: {
        type: "object",
        properties: {
            nome: orcamentoJsonSchema.properties.nome,
            descricao: orcamentoJsonSchema.properties.descricao,
        },
        description: "Schema para atualização de orçamento"
    },
    ComponenteOrcamento: {
        type: "object",
        properties: {
            nome: { type: "string", example: "Resistor 10k" },
            fornecedor: { type: "string", example: "Fornecedor ABC" },
            quantidade: { type: "string", example: "10" },
            valor_unitario: { type: "string", example: "0.50" }
        },
        required: ["nome", "fornecedor", "quantidade", "valor_unitario"],
        description: "Schema para adicionar componente ao orçamento"
    },
    ComponenteOrcamentoUpdate: {
        type: "object",
        properties: {
            nome: { type: "string", example: "Resistor 10k" },
            fornecedor: { type: "string", example: "Fornecedor ABC" },
            quantidade: { type: "string", example: "15" },
            valor_unitario: { type: "string", example: "0.45" }
        },
        description: "Schema para atualizar componente do orçamento"
    }
};

const removalMapping = {
    OrcamentoItem: ['__v'],
    OrcamentoDetalhes: ['__v'],
    OrcamentoPost: ['createdAt', 'updatedAt', '__v', '_id', 'protocolo', 'valor', 'componentes']
}

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
    if (orcamentosSchemas[schemaKey]) {
        removeFieldsRecursively(orcamentosSchemas[schemaKey], fields);
    }
});

const orcamentoMongooseSchema = Orcamento.schema;

orcamentosSchemas.OrcamentoItem.example = await generateExample(orcamentosSchemas.OrcamentoItem, null, orcamentoMongooseSchema);
orcamentosSchemas.OrcamentoDetalhes.example = await generateExample(orcamentosSchemas.OrcamentoDetalhes, null, orcamentoMongooseSchema);
orcamentosSchemas.OrcamentoPost.example = {
    nome: "Orçamento Sistema de Automação",
    descricao: "Orçamento para componentes do sistema de automação residencial",
    componente_orcamento: [
        {
            nome: "Resistor 10k",
            fornecedor: "Fornecedor ABC",
            quantidade: "10",
            valor_unitario: "0.50"
        },
        {
            nome: "Capacitor 100uF",
            fornecedor: "Fornecedor XYZ",
            quantidade: "5",
            valor_unitario: "2.00"
        }
    ]
};

export default orcamentosSchemas;
