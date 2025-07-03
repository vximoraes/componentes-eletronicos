import authSchemas from "../schemas/authSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";

const authPaths = {
    "/login": {
        post: {
            tags: ["Auth"],
            summary: "Realizar login no sistema",
            description: `
            + **Caso de uso**: Autenticação de usuário no sistema.
            
            + **Função de Negócio**:
                - Permitir que usuários cadastrados façam login no sistema.
                - Gerar tokens de acesso (access token) e renovação (refresh token).
                - Validar credenciais do usuário (email e senha).

            + **Regras de Negócio**:
                - Email deve estar cadastrado no sistema.
                - Senha deve corresponder ao hash armazenado.
                - Usuário deve estar ativo (ativo: true).
                - Retorna access token com validade de 15 minutos.
                - Retorna refresh token com validade de 7 dias.

            + **Resultado Esperado**:
                - HTTP 200 OK com dados do usuário e tokens.
                - Em caso de credenciais inválidas, retorna erro 401.
                - Em caso de usuário inativo, retorna erro 403.
            `,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/LoginRequest"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Login realizado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/LoginResponse"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Login realizado com sucesso"
                                    },
                                    errors: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                401: {
                    description: "Credenciais inválidas",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthError"
                            }
                        }
                    }
                },
                403: {
                    description: "Usuário inativo",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthError"
                            }
                        }
                    }
                },
                500: commonResponses[500]()
            }
        }
    },

    "/signup": {
        post: {
            tags: ["Auth"],
            summary: "Cadastrar novo usuário",
            description: `
            + **Caso de uso**: Registro de novo usuário no sistema.
            
            + **Função de Negócio**:
                - Permitir o cadastro de novos usuários.
                - Validar dados de entrada (nome, email, senha).
                - Criptografar senha antes do armazenamento.

            + **Regras de Negócio**:
                - Nome deve ter no mínimo 3 caracteres.
                - Email deve ser único e válido.
                - Senha deve ter no mínimo 8 caracteres com pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.
                - Usuário criado com status inativo por padrão (ativo: false).

            + **Resultado Esperado**:
                - HTTP 201 Created com dados do usuário criado.
                - Em caso de email já cadastrado, retorna erro 409.
                - Em caso de dados inválidos, retorna erro 400.
            `,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/SignupRequest"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Usuário criado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/SignupResponse"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Usuário criado com sucesso"
                                    },
                                    errors: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                409: {
                    description: "Email já cadastrado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthError"
                            }
                        }
                    }
                },
                500: commonResponses[500]()
            }
        }
    },

    "/logout": {
        post: {
            tags: ["Auth"],
            summary: "Realizar logout",
            description: `
            + **Caso de uso**: Invalidar tokens de acesso do usuário.
            
            + **Função de Negócio**:
                - Invalidar refresh token do usuário.
                - Remover tokens do banco de dados.
                - Encerrar sessão ativa.

            + **Regras de Negócio**:
                - Requer refresh token válido no corpo da requisição.
                - Token deve estar associado a um usuário válido.
                - Remove tokens de acesso e renovação do banco.

            + **Resultado Esperado**:
                - HTTP 200 OK com mensagem de confirmação.
                - Em caso de token inválido, retorna erro 401.
            `,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/TokenRequest"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Logout realizado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/LogoutResponse"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Logout realizado com sucesso"
                                    },
                                    errors: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                401: {
                    description: "Token inválido",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TokenError"
                            }
                        }
                    }
                },
                500: commonResponses[500]()
            }
        }
    },

    "/refresh": {
        post: {
            tags: ["Auth"],
            summary: "Renovar access token",
            description: `
            + **Caso de uso**: Gerar novo access token usando refresh token.
            
            + **Função de Negócio**:
                - Permitir renovação de access token expirado.
                - Validar refresh token fornecido.
                - Gerar novo access token com validade renovada.

            + **Regras de Negócio**:
                - Refresh token deve ser válido e não expirado.
                - Usuário deve estar ativo.
                - Novo access token tem validade de 15 minutos.
                - Refresh token permanece o mesmo.

            + **Resultado Esperado**:
                - HTTP 200 OK com novo access token.
                - Em caso de refresh token inválido, retorna erro 401.
            `,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/TokenRequest"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Token renovado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/RefreshResponse"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Token renovado com sucesso"
                                    },
                                    errors: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                401: {
                    description: "Refresh token inválido ou expirado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TokenError"
                            }
                        }
                    }
                },
                500: commonResponses[500]()
            }
        }
    },

    "/revoke": {
        post: {
            tags: ["Auth"],
            summary: "Revogar refresh token",
            description: `
            + **Caso de uso**: Invalidar refresh token específico.
            
            + **Função de Negócio**:
                - Revogar refresh token fornecido.
                - Impedir uso futuro do token.
                - Forçar nova autenticação.

            + **Regras de Negócio**:
                - Refresh token deve existir no sistema.
                - Remove token do banco de dados.
                - Invalida sessão associada ao token.

            + **Resultado Esperado**:
                - HTTP 200 OK com mensagem de confirmação.
                - Em caso de token não encontrado, retorna erro 404.
            `,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/TokenRequest"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Token revogado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/RevokeResponse"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Token revogado com sucesso"
                                    },
                                    errors: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                404: {
                    description: "Token não encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TokenError"
                            }
                        }
                    }
                },
                500: commonResponses[500]()
            }
        }
    },

    "/introspect": {
        post: {
            tags: ["Auth"],
            summary: "Validar access token",
            description: `
            + **Caso de uso**: Verificar validade e obter informações de um access token.
            
            + **Função de Negócio**:
                - Validar se access token é válido e não expirado.
                - Retornar informações sobre o token (claims, expiração, etc.).
                - Implementar padrão RFC 7662 (OAuth 2.0 Token Introspection).

            + **Regras de Negócio**:
                - Token deve ser válido e não expirado.
                - Retorna informações estruturadas do token.
                - Compatível com padrões OAuth 2.0.

            + **Resultado Esperado**:
                - HTTP 200 OK com informações do token.
                - Em caso de token inválido, retorna dados com active: false.
            `,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/IntrospectRequest"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Informações do token",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/IntrospectResponse"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Token validado com sucesso"
                                    },
                                    errors: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                500: commonResponses[500]()
            }
        }
    },

    "/recover": {
        post: {
            tags: ["Auth"],
            summary: "Solicitar recuperação de senha",
            description: `
            + **Caso de uso**: Iniciar processo de recuperação de senha.
            
            + **Função de Negócio**:
                - Gerar token de recuperação de senha.
                - Enviar email com link de recuperação.
                - Permitir reset de senha esquecida.

            + **Regras de Negócio**:
                - Email deve estar cadastrado no sistema.
                - Gera token único de recuperação.
                - Token tem validade limitada (ex: 1 hora).
                - Envia email com instruções de recuperação.

            + **Resultado Esperado**:
                - HTTP 200 OK com mensagem de confirmação.
                - Em caso de email não encontrado, retorna erro 404.
            `,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/RecoverRequest"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Email de recuperação enviado",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/RecoverResponse"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Email de recuperação enviado com sucesso"
                                    },
                                    errors: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                404: {
                    description: "Email não encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthError"
                            }
                        }
                    }
                },
                500: commonResponses[500]()
            }
        }
    }
};

export default authPaths;