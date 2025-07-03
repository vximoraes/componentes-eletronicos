import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/swagger_utils/removeFields.js';
import Movimentacao from '../../models/Movimentacao.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const movimentacaoJsonSchema = Movimentacao.schema.jsonSchema();
delete movimentacaoJsonSchema.properties.__v;

const movimentacoesSchemas = {
    MovimentacaoFiltro: {
        type: "object",
        properties: {
            tipo: movimentacaoJsonSchema.properties.tipo,
            data: {
                type: "string",
                format: "date",
                description: "Data da movimentação (YYYY-MM-DD)"
            },
            quantidade: movimentacaoJsonSchema.properties.quantidade,
            componente: movimentacaoJsonSchema.properties.componente,
            fornecedor: movimentacaoJsonSchema.properties.fornecedor,
        }
    },
    MovimentacaoListagem: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/MovimentacaoItem"
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
        description: "Schema para listagem paginada de movimentações"
    },
    MovimentacaoItem: {
        ...deepCopy(movimentacaoJsonSchema),
        description: "Schema para item de movimentação na listagem"
    },
    MovimentacaoDetalhes: {
        ...deepCopy(movimentacaoJsonSchema),
        description: "Schema para detalhes de uma movimentação"
    },
    MovimentacaoPost: {
        ...deepCopy(movimentacaoJsonSchema),
        required: ["componente", "tipo", "quantidade"],
        description: "Schema para criação de movimentação"
    }
};

const removalMapping = {
    MovimentacaoItem: ['__v'],
    MovimentacaoDetalhes: ['__v'],
    MovimentacaoPost: ['createdAt', 'updatedAt', '__v', '_id', 'data_hora']
}

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
    if (movimentacoesSchemas[schemaKey]) {
        removeFieldsRecursively(movimentacoesSchemas[schemaKey], fields);
    }
});

const movimentacaoMongooseSchema = Movimentacao.schema;

movimentacoesSchemas.MovimentacaoItem.example = await generateExample(movimentacoesSchemas.MovimentacaoItem, null, movimentacaoMongooseSchema);
movimentacoesSchemas.MovimentacaoDetalhes.example = await generateExample(movimentacoesSchemas.MovimentacaoDetalhes, null, movimentacaoMongooseSchema);
movimentacoesSchemas.MovimentacaoPost.example = {
    tipo: "entrada",
    quantidade: "10",
    componente: "507f1f77bcf86cd799439011",
    fornecedor: "507f1f77bcf86cd799439012"
};

export default movimentacoesSchemas;