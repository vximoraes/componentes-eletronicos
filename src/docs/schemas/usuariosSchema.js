import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/swagger_utils/removeFields.js';
import Usuario from '../../models/Usuario.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const usuarioJsonSchema = Usuario.schema.jsonSchema();
delete usuarioJsonSchema.properties.__v;

const usuariosSchemas = {
    UsuarioFiltro: {
        type: "object",
        properties: {
            nome: usuarioJsonSchema.properties.nome,
            email: usuarioJsonSchema.properties.email,
            ativo: usuarioJsonSchema.properties.ativo,
        }
    },
    UsuarioListagem: {
        ...deepCopy(usuarioJsonSchema),
        description: "Schema para listagem de usuários"
    },
    UsuarioDetalhes: {
        ...deepCopy(usuarioJsonSchema),
        description: "Schema para detalhes de um usuário"
    },
    UsuarioPost: {
        ...deepCopy(usuarioJsonSchema),
        required: ["nome", "email", "senha"],
        description: "Schema para criação de usuário"
    },
    UsuarioPutPatch: {
        ...deepCopy(usuarioJsonSchema),
        required: [],
        description: "Schema para atualização de usuário"
    },
    UsuarioLogin: {
        ...deepCopy(usuarioJsonSchema),
        required: ["email", "senha"],
        description: "Schema para login de usuário"
    },
    UsuarioRespostaLogin: {
        ...deepCopy(usuarioJsonSchema),
        description: "Schema para resposta de login de usuário"
    }
};

const removalMapping = {
    UsuarioListagem: ['accesstoken', 'refreshtoken', 'tokenUnico', 'senha'],
    UsuarioDetalhes: ['accesstoken', 'tokenUnico', 'refreshtoken', 'senha'],
    UsuarioPost: ['accesstoken', 'refreshtoken', 'tokenUnico', 'createdAt', 'updatedAt', '__v', '_id'],
    UsuarioPutPatch: ['accesstoken', 'refreshtoken', 'tokenUnico', 'senha', 'email', 'createdAt', 'updatedAt', '__v', '_id'],
    UsuarioLogin: ['accesstoken', 'refreshtoken', 'tokenUnico', 'ativo', 'createdAt', 'updatedAt', '__v', '_id', 'nome'],
    UsuarioRespostaLogin: ['tokenUnico', 'senha', 'createdAt', 'updatedAt', '__v']
}

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
    if (usuariosSchemas[schemaKey]) {
        removeFieldsRecursively(usuariosSchemas[schemaKey], fields);
    }
});

const usuarioMongooseSchema = Usuario.schema;

usuariosSchemas.UsuarioListagem.example = await generateExample(usuariosSchemas.UsuarioListagem, null, usuarioMongooseSchema);
usuariosSchemas.UsuarioDetalhes.example = await generateExample(usuariosSchemas.UsuarioDetalhes, null, usuarioMongooseSchema);
usuariosSchemas.UsuarioPost.example = await generateExample(usuariosSchemas.UsuarioPost, null, usuarioMongooseSchema);
usuariosSchemas.UsuarioPutPatch.example = await generateExample(usuariosSchemas.UsuarioPutPatch, null, usuarioMongooseSchema);
usuariosSchemas.UsuarioLogin.example = await generateExample(usuariosSchemas.UsuarioLogin, null, usuarioMongooseSchema);
usuariosSchemas.UsuarioRespostaLogin.example = await generateExample(usuariosSchemas.UsuarioRespostaLogin, null, usuarioMongooseSchema);

export default usuariosSchemas;