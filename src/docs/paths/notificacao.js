import notificacoesSchemas from "../schemas/notificacaoSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

const notificacoesRoutes = {
    "/notificacoes": {
        post: {
            tags: ["Notificações"],
            summary: "Cria uma nova notificação",
            description: `
            + Caso de uso: Criar uma nova notificação para um usuário.
            
            + Função de Negócio:
                - Permitir ao sistema criar notificações direcionadas a usuários específicos.
                + Recebe no corpo da requisição:
                    - Objeto conforme schema **NotificacaoPost**, contendo dados da notificação.

            + Regras de Negócio:
                - Campos obrigatórios: mensagem, usuario (id).
                - Campo \`visualizada\`: padrão false.
                - Não permite campos fora do schema.
                - Usuário deve existir.

            + Resultado Esperado:
                - HTTP 201 Created com corpo conforme **NotificacaoDetalhes**, contendo todos os dados da notificação criada.
                - Retorna _id, mensagem, visualizada como false, usuario e data_hora.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/NotificacaoPost"
                        }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/NotificacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        
        get: {
            tags: ["Notificações"],
            summary: "Lista todas as notificações",
            description: `
        + Caso de uso: Listar notificações para controle e consulta.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista paginada de notificações.
            + Recebe como query parameters (opcionais):
                • filtros: usuario, visualizada, mensagem.  
                • paginação: page (número da página), limite (quantidade de itens por página).

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - Respeitar as permissões do usuário autenticado.  
            - Aplicar paginação e retornar metadados: total de registros e total de páginas.
            - Limite máximo de 100 itens por página.
            - Retorna notificações populadas com dados do usuário.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **NotificacaoListagem**, contendo:
                • **data**: array de notificações.  
                • **dados de paginação**: totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage.
            `,
            security: [{ bearerAuth: [] }],
            parameters: generateParameters(notificacoesSchemas.NotificacaoFiltro).concat([
                {
                    name: "page",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                        minimum: 1,
                        default: 1
                    },
                    description: "Número da página"
                },
                {
                    name: "limite",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                        minimum: 1,
                        maximum: 100,
                        default: 10
                    },
                    description: "Quantidade de itens por página (máximo 100)"
                }
            ]),
            responses: {
                200: {
                    description: "Lista de notificações retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/NotificacaoListagem"
                            }
                        }
                    }
                },
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
    },
    "/notificacoes/{id}": {
        get: {
            tags: ["Notificações"],
            summary: "Obtém detalhes de uma notificação",
            description: `
            + Caso de uso: Consulta de detalhes de notificação específica.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de uma notificação.
                + Recebe como path parameter:
                    - **id**: identificador da notificação (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência da notificação.  
                - Retorna notificação populada com dados do usuário.
                - Checar permissões do solicitante para visualizar dados.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **NotificacaoDetalhes**, contendo dados completos da notificação.
        `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "ID da notificação"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/NotificacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    },
    "/notificacoes/{id}/visualizar": {
        patch: {
            tags: ["Notificações"],
            summary: "Marca uma notificação como visualizada",
            description: `
            + Caso de uso: Marcar notificação como visualizada pelo usuário.
            
            + Função de Negócio:
                - Permitir ao usuário marcar uma notificação como lida/visualizada.
                + Recebe como path parameter:
                    - **id**: identificador da notificação (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência da notificação.  
                - Atualizar campo visualizada para true.
                - Registrar data/hora da visualização.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **NotificacaoDetalhes**, contendo dados atualizados da notificação.
        `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "ID da notificação"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/NotificacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    }
};

export default notificacoesRoutes;
