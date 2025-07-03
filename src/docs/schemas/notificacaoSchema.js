import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/swagger_utils/removeFields.js';
import Notificacao from '../../models/Notificacao.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const notificacaoJsonSchema = Notificacao.schema.jsonSchema();
delete notificacaoJsonSchema.properties.__v;

const notificacoesSchemas = {
    NotificacaoFiltro: {
        type: "object",
        properties: {
            usuario: notificacaoJsonSchema.properties.usuario,
            visualizada: notificacaoJsonSchema.properties.visualizada,
            mensagem: notificacaoJsonSchema.properties.mensagem,
        }
    },
    NotificacaoListagem: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/NotificacaoItem"
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
        description: "Schema para listagem paginada de notificações"
    },
    NotificacaoItem: {
        ...deepCopy(notificacaoJsonSchema),
        description: "Schema para item de notificação na listagem"
    },
    NotificacaoDetalhes: {
        ...deepCopy(notificacaoJsonSchema),
        description: "Schema para detalhes de uma notificação"
    },
    NotificacaoPost: {
        ...deepCopy(notificacaoJsonSchema),
        required: ["mensagem", "usuario"],
        description: "Schema para criação de notificação"
    },
    NotificacaoVisualizacao: {
        type: "object",
        properties: {
            visualizada: {
                type: "boolean",
                example: true,
                description: "Status de visualização da notificação"
            },
            dataLeitura: {
                type: "string",
                format: "date-time",
                example: "2025-07-03T14:30:00.000Z",
                description: "Data e hora da visualização"
            }
        },
        description: "Schema para atualização de visualização de notificação"
    }
};

const removalMapping = {
    NotificacaoItem: ['__v'],
    NotificacaoDetalhes: ['__v'],
    NotificacaoPost: ['createdAt', 'updatedAt', '__v', '_id', 'data_hora', 'visualizada']
}

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
    if (notificacoesSchemas[schemaKey]) {
        removeFieldsRecursively(notificacoesSchemas[schemaKey], fields);
    }
});

const notificacaoMongooseSchema = Notificacao.schema;

notificacoesSchemas.NotificacaoItem.example = await generateExample(notificacoesSchemas.NotificacaoItem, null, notificacaoMongooseSchema);
notificacoesSchemas.NotificacaoDetalhes.example = await generateExample(notificacoesSchemas.NotificacaoDetalhes, null, notificacaoMongooseSchema);
notificacoesSchemas.NotificacaoPost.example = {
    mensagem: "Estoque baixo do componente Resistor 10k",
    usuario: "507f1f77bcf86cd799439011"
};

export default notificacoesSchemas;
