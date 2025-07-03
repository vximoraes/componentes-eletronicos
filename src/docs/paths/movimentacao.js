import movimentacoesSchemas from "../schemas/movimentacaoSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

const movimentacoesRoutes = {
    "/movimentacoes": {
        post: {
            tags: ["Movimentação"],
            summary: "Registra uma nova movimentação",
            description: `
            + Caso de uso: Registrar movimentação de um componente (entrada ou saída).
            
            + Função de Negócio:
                - Permitir ao usuário autenticado registrar entrada ou saída de componentes do estoque.
                + Recebe no corpo da requisição:
                    - Objeto conforme schema **MovimentacaoPost**, contendo dados da movimentação.

            + Regras de Negócio:
                - Campos obrigatórios: componente, tipo (entrada/saida), quantidade.
                - Para entrada: fornecedor é obrigatório e deve existir.
                - Para saída: fornecedor não é necessário e ignorado caso seja informado no body.
                - Não permite quantidade negativa ou maior que o estoque disponível (para saída).
                - Atualiza a quantidade do componente automaticamente.
                - Data/hora é gerada automaticamente pelo sistema.

            + Resultado Esperado:
                - HTTP 201 Created com corpo conforme **MovimentacaoDetalhes**, contendo todos os dados da movimentação criada.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/MovimentacaoPost"
                        }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/MovimentacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        
        get: {
            tags: ["Movimentação"],
            summary: "Lista todas as movimentações",
            description: `
        + Caso de uso: Listagem de movimentações para controle de estoque e auditoria.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista paginada de movimentações registradas.
            + Recebe como query parameters (opcionais):
                • filtros: tipo, data, componente, fornecedor, quantidade.  
                • paginação: page (número da página), limite (quantidade de itens por página).

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - Respeitar as permissões do usuário autenticado.  
            - Aplicar paginação e retornar metadados: total de registros e total de páginas.
            - Limite máximo de 100 itens por página.
            - Retorna movimentações populadas com dados de componente e fornecedor.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **MovimentacaoListagem**, contendo:
                • **data**: array de movimentações.  
                • **dados de paginação**: totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage.
            `,
            security: [{ bearerAuth: [] }],
            parameters: generateParameters(movimentacoesSchemas.MovimentacaoFiltro).concat([
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
                    description: "Lista de movimentações retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/MovimentacaoListagem"
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
    "/movimentacoes/{id}": {
        get: {
            tags: ["Movimentação"],
            summary: "Obtém detalhes de uma movimentação",
            description: `
            + Caso de uso: Consulta de detalhes de movimentação específica.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de uma movimentação registrada.
                + Recebe como path parameter:
                    - **id**: identificador da movimentação (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência da movimentação.  
                - Retorna movimentação populada com dados de componente e fornecedor.
                - Checar permissões do solicitante para visualizar dados.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **MovimentacaoDetalhes**, contendo dados completos da movimentação.
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
                    description: "ID da movimentação"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/MovimentacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    }
};

export default movimentacoesRoutes;
