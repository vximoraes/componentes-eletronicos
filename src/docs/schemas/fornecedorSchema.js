import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/swagger_utils/removeFields.js';
import Fornecedor from '../../models/Fornecedor.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const fornecedorJsonSchema = Fornecedor.schema.jsonSchema();
delete fornecedorJsonSchema.properties.__v;

const fornecedoresSchemas = {
    FornecedorFiltro: {
        type: "object",
        properties: {
            nome: fornecedorJsonSchema.properties.nome,
            ativo: fornecedorJsonSchema.properties.ativo,
        }
    },
    FornecedorListagem: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/FornecedorItem"
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
        description: "Schema para listagem paginada de fornecedores"
    },
    FornecedorItem: {
        ...deepCopy(fornecedorJsonSchema),
        description: "Schema para item de fornecedor na listagem"
    },
    FornecedorDetalhes: {
        ...deepCopy(fornecedorJsonSchema),
        description: "Schema para detalhes de um fornecedor"
    },
    FornecedorPost: {
        ...deepCopy(fornecedorJsonSchema),
        required: ["nome"],
        description: "Schema para criação de fornecedor"
    },
    FornecedorPutPatch: {
        ...deepCopy(fornecedorJsonSchema),
        required: [],
        description: "Schema para atualização de fornecedor"
    }
};

const removalMapping = {
    FornecedorItem: ['__v'],
    FornecedorDetalhes: ['__v'],
    FornecedorPost: ['createdAt', 'updatedAt', '__v', '_id'],
    FornecedorPutPatch: ['createdAt', 'updatedAt', '__v', '_id']
}

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
    if (fornecedoresSchemas[schemaKey]) {
        removeFieldsRecursively(fornecedoresSchemas[schemaKey], fields);
    }
});

const fornecedorMongooseSchema = Fornecedor.schema;

fornecedoresSchemas.FornecedorItem.example = await generateExample(fornecedoresSchemas.FornecedorItem, null, fornecedorMongooseSchema);
fornecedoresSchemas.FornecedorDetalhes.example = await generateExample(fornecedoresSchemas.FornecedorDetalhes, null, fornecedorMongooseSchema);
fornecedoresSchemas.FornecedorPost.example = {
    nome: "TechComponents LTDA"
};
fornecedoresSchemas.FornecedorPutPatch.example = {
    nome: "TechComponents LTDA - Atualizado"
};

export default fornecedoresSchemas;