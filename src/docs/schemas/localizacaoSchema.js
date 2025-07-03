import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/swagger_utils/removeFields.js';
import Localizacao from '../../models/Localizacao.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const localizacaoJsonSchema = Localizacao.schema.jsonSchema();
delete localizacaoJsonSchema.properties.__v;

const localizacoesSchemas = {
    LocalizacaoFiltro: {
        type: "object",
        properties: {
            nome: localizacaoJsonSchema.properties.nome,
            ativo: localizacaoJsonSchema.properties.ativo,
        }
    },
    LocalizacaoListagem: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/LocalizacaoItem"
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
        description: "Schema para listagem paginada de localizações"
    },
    LocalizacaoItem: {
        ...deepCopy(localizacaoJsonSchema),
        description: "Schema para item de localização na listagem"
    },
    LocalizacaoDetalhes: {
        ...deepCopy(localizacaoJsonSchema),
        description: "Schema para detalhes de uma localização"
    },
    LocalizacaoPost: {
        ...deepCopy(localizacaoJsonSchema),
        required: ["nome"],
        description: "Schema para criação de localização"
    },
    LocalizacaoPutPatch: {
        ...deepCopy(localizacaoJsonSchema),
        required: [],
        description: "Schema para atualização de localização"
    }
};

const removalMapping = {
    LocalizacaoItem: ['__v'],
    LocalizacaoDetalhes: ['__v'],
    LocalizacaoPost: ['createdAt', 'updatedAt', '__v', '_id'],
    LocalizacaoPutPatch: ['createdAt', 'updatedAt', '__v', '_id']
}

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
    if (localizacoesSchemas[schemaKey]) {
        removeFieldsRecursively(localizacoesSchemas[schemaKey], fields);
    }
});

const localizacaoMongooseSchema = Localizacao.schema;

localizacoesSchemas.LocalizacaoItem.example = await generateExample(localizacoesSchemas.LocalizacaoItem, null, localizacaoMongooseSchema);
localizacoesSchemas.LocalizacaoDetalhes.example = await generateExample(localizacoesSchemas.LocalizacaoDetalhes, null, localizacaoMongooseSchema);
localizacoesSchemas.LocalizacaoPost.example = {
    nome: "Estante A - Prateleira 1"
};
localizacoesSchemas.LocalizacaoPutPatch.example = {
    nome: "Estante A - Prateleira 1 - Atualizada"
};

export default localizacoesSchemas;