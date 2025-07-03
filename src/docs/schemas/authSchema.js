import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

const authSchemas = {
    // Schema para login de usuário
    LoginRequest: {
        type: "object",
        properties: {
            email: { 
                type: "string", 
                format: "email",
                description: "Email do usuário",
                example: "admin@admin.com"
            },
            senha: { 
                type: "string", 
                description: "Senha do usuário",
                minLength: 8,
                example: "Senha@123"
            }
        },
        required: ["email", "senha"],
        description: "Schema para requisição de login"
    },

    // Schema para cadastro de usuário
    SignupRequest: {
        type: "object",
        properties: {
            nome: { 
                type: "string", 
                description: "Nome completo do usuário",
                minLength: 3,
                example: "João Silva"
            },
            email: { 
                type: "string", 
                format: "email", 
                description: "Email do usuário",
                example: "joao@email.com"
            },
            senha: { 
                type: "string", 
                description: "Senha do usuário (mínimo 8 caracteres com letras maiúsculas, minúsculas, números e caracteres especiais)",
                minLength: 8,
                pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                example: "MinhaSenh@123"
            }
        },
        required: ["nome", "email", "senha"],
        description: "Schema para requisição de cadastro de usuário"
    },

    // Schema para recuperação de senha
    RecoverRequest: {
        type: "object",
        properties: {
            email: { 
                type: "string", 
                format: "email",
                description: "Email do usuário para recuperação de senha",
                example: "usuario@email.com"
            }
        },
        required: ["email"],
        description: "Schema para requisição de recuperação de senha"
    },

    // Schema para refresh token
    TokenRequest: {
        type: "object",
        properties: {
            refreshtoken: { 
                type: "string", 
                description: "Refresh token do usuário",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_token_payload.signature"
            }
        },
        required: ["refreshtoken"],
        description: "Schema para requisições que usam refresh token (logout, revoke, refresh)"
    },

    // Schema para introspect (validação de token)
    IntrospectRequest: {
        type: "object",
        properties: {
            accesstoken: { 
                type: "string", 
                description: "Access token para verificação",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access_token_payload.signature"
            }
        },
        required: ["accesstoken"],
        description: "Schema para requisição de validação de token"
    },

    // Respostas de sucesso
    LoginResponse: {
        type: "object",
        properties: {
            user: {
                type: "object",
                properties: {
                    _id: { type: "string", description: "ID do usuário", example: "64f234a0c781a7b30c2fe445" },
                    nome: { type: "string", description: "Nome do usuário", example: "João Silva" },
                    email: { type: "string", description: "Email do usuário", example: "joao@email.com" },
                    ativo: { type: "boolean", description: "Status do usuário", example: true },
                    accesstoken: { 
                        type: "string", 
                        description: "Token de acesso JWT",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                    refreshtoken: { 
                        type: "string", 
                        description: "Token de renovação",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                }
            },
            expires_in: { 
                type: "number", 
                description: "Tempo de expiração do access token em segundos",
                example: 900
            },
            token_type: { 
                type: "string", 
                description: "Tipo do token",
                example: "Bearer"
            }
        },
        description: "Schema para resposta de login bem-sucedido"
    },

    SignupResponse: {
        type: "object",
        properties: {
            _id: { type: "string", description: "ID do usuário criado", example: "64f234a0c781a7b30c2fe445" },
            nome: { type: "string", description: "Nome do usuário", example: "João Silva" },
            email: { type: "string", description: "Email do usuário", example: "joao@email.com" },
            ativo: { type: "boolean", description: "Status do usuário", example: false },
            createdAt: { type: "string", format: "date-time", description: "Data de criação" },
            updatedAt: { type: "string", format: "date-time", description: "Data de atualização" }
        },
        description: "Schema para resposta de cadastro bem-sucedido"
    },

    RefreshResponse: {
        type: "object",
        properties: {
            accesstoken: { 
                type: "string", 
                description: "Novo token de acesso",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            expires_in: { 
                type: "number", 
                description: "Tempo de expiração em segundos",
                example: 900
            },
            token_type: { 
                type: "string", 
                description: "Tipo do token",
                example: "Bearer"
            }
        },
        description: "Schema para resposta de renovação de token"
    },

    IntrospectResponse: {
        type: "object",
        properties: {
            active: { 
                type: "boolean", 
                description: "Indica se o token ainda é válido (não expirado)",
                example: true
            },
            client_id: { 
                type: "string", 
                description: "ID do cliente OAuth",
                example: "1234567890abcdef"
            },
            token_type: { 
                type: "string", 
                description: "Tipo de token, conforme RFC 6749",
                example: "Bearer"
            },
            exp: { 
                type: "number", 
                description: "Timestamp UNIX de expiração do token",
                example: 1672531199
            },
            iat: { 
                type: "number", 
                description: "Timestamp UNIX de emissão do token",
                example: 1672527600
            },
            nbf: { 
                type: "number", 
                description: "Timestamp UNIX de início de validade do token",
                example: 1672527600
            },
            sub: {
                type: "string",
                description: "Subject (ID do usuário)",
                example: "64f234a0c781a7b30c2fe445"
            }
        },
        description: "Schema para resposta de validação de token"
    },

    // Respostas de mensagens simples
    LogoutResponse: {
        type: "object",
        properties: {
            message: { 
                type: "string", 
                description: "Mensagem de confirmação",
                example: "Logout realizado com sucesso"
            }
        },
        description: "Schema para resposta de logout"
    },

    RevokeResponse: {
        type: "object",
        properties: {
            message: { 
                type: "string", 
                description: "Mensagem de confirmação",
                example: "Token revogado com sucesso"
            }
        },
        description: "Schema para resposta de revogação de token"
    },

    RecoverResponse: {
        type: "object",
        properties: {
            message: { 
                type: "string", 
                description: "Mensagem de confirmação",
                example: "Email de recuperação enviado com sucesso"
            }
        },
        description: "Schema para resposta de recuperação de senha"
    },

    // Schemas de erro específicos para autenticação
    AuthError: {
        type: "object",
        properties: {
            message: { 
                type: "string", 
                description: "Mensagem de erro",
                example: "Credenciais inválidas"
            },
            errors: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        field: { type: "string", example: "email" },
                        message: { type: "string", example: "Email não encontrado" }
                    }
                }
            }
        },
        description: "Schema para erros de autenticação"
    },

    TokenError: {
        type: "object",
        properties: {
            message: { 
                type: "string", 
                description: "Mensagem de erro",
                example: "Token inválido ou expirado"
            },
            code: {
                type: "number",
                description: "Código do erro",
                example: 401
            }
        },
        description: "Schema para erros relacionados a tokens"
    }
};

// Função para adicionar exemplos aos schemas
const addExamples = async () => {
    for (const key of Object.keys(authSchemas)) {
        const schema = authSchemas[key];
        
        // Gera exemplos para propriedades que ainda não têm
        if (schema.properties) {
            for (const [propKey, propertySchema] of Object.entries(schema.properties)) {
                if (!propertySchema.example && !propertySchema.properties) {
                    try {
                        propertySchema.example = await generateExample(propertySchema, propKey);
                    } catch (error) {
                        console.warn(`Erro ao gerar exemplo para ${key}.${propKey}:`, error);
                    }
                }
            }
        }
        
        // Gera exemplo para o schema completo se não existir
        if (!schema.example) {
            try {
                schema.example = await generateExample(schema);
            } catch (error) {
                console.warn(`Erro ao gerar exemplo para ${key}:`, error);
            }
        }
    }
};

// Executa a geração de exemplos
await addExamples();

export default authSchemas;