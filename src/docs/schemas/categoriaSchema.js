import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/swagger_utils/removeFields.js';
import Categoria from '../../models/Categoria.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const categoriaJsonSchema = Categoria.schema.jsonSchema();
delete categoriaJsonSchema.properties.__v;

const categoriasSchemas = {
    CategoriaFiltro: {
        type: "object",
        properties: {
            nome: categoriaJsonSchema.properties.nome,
        }
    },
    CategoriaListagem: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/CategoriaItem"
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
        description: "Schema para listagem paginada de categorias"
    },
    CategoriaItem: {
        ...deepCopy(categoriaJsonSchema),
        description: "Schema para item de categoria na listagem"
    },
    CategoriaDetalhes: {
        ...deepCopy(categoriaJsonSchema),
        description: "Schema para detalhes de uma categoria"
    },
    CategoriaPost: {
        ...deepCopy(categoriaJsonSchema),
        required: ["nome"],
        description: "Schema para criação de categoria"
    },
    CategoriaPutPatch: {
        ...deepCopy(categoriaJsonSchema),
        required: [],
        description: "Schema para atualização de categoria"
    }
};

const removalMapping = {
    CategoriaItem: ['__v'],
    CategoriaDetalhes: ['__v'],
    CategoriaPost: ['createdAt', 'updatedAt', '__v', '_id'],
    CategoriaPutPatch: ['createdAt', 'updatedAt', '__v', '_id']
}

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
    if (categoriasSchemas[schemaKey]) {
        removeFieldsRecursively(categoriasSchemas[schemaKey], fields);
    }
});

const categoriaMongooseSchema = Categoria.schema;

categoriasSchemas.CategoriaItem.example = await generateExample(categoriasSchemas.CategoriaItem, null, categoriaMongooseSchema);
categoriasSchemas.CategoriaDetalhes.example = await generateExample(categoriasSchemas.CategoriaDetalhes, null, categoriaMongooseSchema);
categoriasSchemas.CategoriaPost.example = await generateExample(categoriasSchemas.CategoriaPost, null, categoriaMongooseSchema);
categoriasSchemas.CategoriaPutPatch.example = await generateExample(categoriasSchemas.CategoriaPutPatch, null, categoriaMongooseSchema);

export default categoriasSchemas;