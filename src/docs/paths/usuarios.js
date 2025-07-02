import usuariosSchemas from "../schemas/usuariosSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

const usuariosRoutes = {
    "/usuarios": {
        post: {
            tags: ["Usuários"],
            summary: "Cria um novo usuário",
            description: `
            + Caso de uso: Criação de novo usuário no sistema.
            
            + Função de Negócio:
                - Permitir ao perfil administrador inserir um novo usuário com todos os dados obrigatórios.
                + Recebe no corpo da requisição:
                    - Objeto conforme schema **UsuarioPost**, contendo campos como nome, email, senha.

            + Regras de Negócio:
                - Validação de campos obrigatórios (nome, email, senha).  
                - Verificação de unicidade para email.  
                - Definição de status inicial (ativo: false por padrão).  
                - Em caso de duplicidade ou erro de validação, retorna erro apropriado.

            + Resultado Esperado:
                - HTTP 201 Created com corpo conforme **UsuarioDetalhes**, contendo todos os dados do usuário criado.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UsuarioPost"
                        }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/UsuarioDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        
        get: {
            tags: ["Usuários"],
            summary: "Lista todos os usuários",
            description: `
        + Caso de uso: Listagem de usuários para gerenciamento e consulta.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista paginada de usuários cadastrados.
            + Recebe como query parameters (opcionais):
                • filtros: nome, email, ativo.  
                • paginação: page (número da página), limite (quantidade de itens por página).

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - Respeitar as permissões do usuário autenticado.  
            - Aplicar paginação e retornar metadados: total de registros e total de páginas.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **UsuarioListagem**, contendo:
                • **items**: array de usuários.  
                • **dados de paginação**: totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage.
            `,
            security: [{ bearerAuth: [] }],
            parameters: generateParameters(usuariosSchemas.UsuarioFiltro),
            responses: {
                200: commonResponses[200](usuariosSchemas.UsuarioListagem),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
    },
    "/usuarios/{id}": {
        get: {
            tags: ["Usuários"],
            summary: "Obtém detalhes de um usuário",
            description: `
            + Caso de uso: Consulta de detalhes de usuário específico.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de um usuário cadastrado.
                + Recebe como path parameter:
                    - **id**: identificador do usuário (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência do usuário e seu status (ativo/inativo).  
                - Checar permissões do solicitante para visualizar dados sensíveis.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **UsuarioDetalhes**, contendo dados completos do usuário.
        `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        patch: {
            tags: ["Usuários"],
            summary: "Atualiza um usuário",
            description: `
            + Caso de uso: Atualização parcial de dados do usuário.
            
            + Função de Negócio:
                - Permitir ao perfil administrador ou usuário autorizado modificar os campos desejados.
                + Recebe:
                    - **id** no path.  
                    - No corpo, objeto conforme **UsuarioPutPatch** com os campos a alterar.

            + Regras de Negócio:
                - Garantir unicidade de campos como email.  
                - Aplicar imediatamente alterações críticas (ex.: desativação inibe login).  
                - Impedir alterações inconsistentes com regras de negócio.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **UsuarioDetalhes**, refletindo as alterações.
        `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UsuarioPutPatch"
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        delete: {
            tags: ["Usuários"],
            summary: "Deleta um usuário",
            description: `
            + Caso de uso: Exclusão ou inativação de usuário.
            
            + Função de Negócio:
                - Permitir ao perfil administrador remover ou inativar um usuário sem afetar integridade de dados.
                + Recebe como path parameter:
                    - **id**: identificador do usuário.

            + Regras de Negócio:
                - Verificar impedimentos por relacionamento (conformidade ou auditoria) antes de excluir.  
                - Registrar log de auditoria sobre a operação.  
                - Garantir que não haja vínculos críticos pendentes.

            + Resultado Esperado:
                - HTTP 200 OK - usuário excluído ou inativado com sucesso.
            `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ],
            responses: {
                200: commonResponses[200](),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    }
};

export default usuariosRoutes;