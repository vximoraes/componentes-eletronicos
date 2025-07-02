import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

const authSchemas = {
    loginPost: {
        type: "object",
        properties: {
            email: { type: "string", description: "Email do usuário" },
            senha: { type: "string", description: "Senha do usuário" }
        },
        required: ["email", "senha"]
    },
    RespostaPass: {
        type: "object",
        properties: {
            active: { type: "boolean", description: "Indica se o token ainda é válido (não expirado)", example: true, },
            client_id: { type: "string", description: "ID do cliente OAuth", example: "1234567890abcdef", },
            token_type: { type: "string", description: "Tipo de token, conforme RFC 6749", example: "Bearer", },
            exp: { type: "string", description: "Timestamp UNIX de expiração do token", example: 1672531199, },
            iat: { type: "string", description: "Timestamp UNIX de emissão do token", example: 1672527600, },
            nbf: { type: "string", description: "Timestamp UNIX de início de validade do token", example: 1672527600, },
        },
    },
    signupPost: {
        type: "object",
        properties: {
            nome: { type: "string", description: "Nome do usuário" },
            email: { type: "string", format: "email", description: "Email do usuário" },
            senha: { type: "string", description: "Senha do usuário" }
        },
        required: ["nome", "email", "senha"]
    },
    TokenRequest: {
        type: "object",
        properties: {
            refreshtoken: { type: "string", description: "Refresh token do usuário" }
        },
        required: ["refreshtoken"],
        description: "Schema para requisições que usam refresh token (logout, revoke, refresh)"
    },
    IntrospectRequest: {
        type: "object",
        properties: {
            accesstoken: { type: "string", description: "Access token para verificação" }
        },
        required: ["accesstoken"],
        description: "Schema para requisição de introspect"
    },
    RespostaLogin: {
        type: "object",
        properties: {
            accesstoken: { type: "string", description: "Token de acesso", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            refreshtoken: { type: "string", description: "Token de renovação", example: "refresh_token_example_123..." },
            expires_in: { type: "number", description: "Tempo de expiração em segundos", example: 3600 },
            token_type: { type: "string", description: "Tipo do token", example: "Bearer" }
        },
        description: "Schema para resposta de login bem-sucedido"
    },
    RespostaLogout: {
        type: "object",
        properties: {
            message: { type: "string", description: "Mensagem de confirmação", example: "Logout realizado com sucesso" }
        },
        description: "Schema para resposta de logout"
    },
    RespostaRevoke: {
        type: "object",
        properties: {
            message: { type: "string", description: "Mensagem de confirmação", example: "Token revogado com sucesso" }
        },
        description: "Schema para resposta de revogação de token"
    },
    RespostaRefresh: {
        type: "object",
        properties: {
            accesstoken: { type: "string", description: "Novo token de acesso", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            expires_in: { type: "number", description: "Tempo de expiração em segundos", example: 3600 },
            token_type: { type: "string", description: "Tipo do token", example: "Bearer" }
        },
        description: "Schema para resposta de renovação de token"
    }
};

const addExamples = async () => {
    for (const key of Object.keys(authSchemas)) {
        const schema = authSchemas[key];
        if (schema.properties) {
            for (const [propKey, propertySchema] of Object.entries(schema.properties)) {
                propertySchema.example = await generateExample(propertySchema, propKey);
            }
        }
        schema.example = await generateExample(schema);
    }
};

await addExamples();

export default authSchemas;