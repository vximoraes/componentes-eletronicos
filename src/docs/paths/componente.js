import componentesSchemas from "../schemas/componenteSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

const componentesRoutes = {
    "/componentes": {
        post: {
            tags: ["Componentes"],
            summary: "Cria um novo componente",
            description: `
            + Caso de uso: Criação de novo componente eletrônico no sistema.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado criar um novo componente eletrônico com todas as informações necessárias.
                + Recebe no corpo da requisição:
                    - Objeto conforme schema **ComponentePost**, contendo dados do componente.

            + Regras de Negócio:
                - Campos obrigatórios: nome, estoque_minimo, valor_unitario, categoria, localizacao.
                - quantidade, estoque_minimo e valor_unitario não podem ser negativos.
                - Campo 'ativo' tem padrão true.
                - Nome deve ser único no sistema.
                - Categoria e localização devem existir no sistema.
                - Quantidade inicial é 0 (alterada apenas via movimentação).

            + Resultado Esperado:
                - HTTP 201 Created com corpo conforme **ComponenteDetalhes**, contendo todos os dados do componente criado.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ComponentePost"
                        }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/ComponenteDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        
        get: {
            tags: ["Componentes"],
            summary: "Lista todos os componentes",
            description: `
        + Caso de uso: Listagem de componentes para gerenciamento e consulta.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista paginada de componentes cadastrados.
            + Recebe como query parameters (opcionais):
                • filtros: nome, categoria, localizacao, ativo, estoque_minimo, quantidade.  
                • paginação: page (número da página), limite (quantidade de itens por página).

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - Respeitar as permissões do usuário autenticado.  
            - Aplicar paginação e retornar metadados: total de registros e total de páginas.
            - Limite máximo de 100 itens por página.
            - Retorna componentes populados com dados de categoria e localização.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **ComponenteListagem**, contendo:
                • **data**: array de componentes.  
                • **dados de paginação**: totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage.
            `,
            security: [{ bearerAuth: [] }],
            parameters: generateParameters(componentesSchemas.ComponenteFiltro).concat([
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
                    description: "Lista de componentes retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ComponenteListagem"
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
    "/componentes/{id}": {
        get: {
            tags: ["Componentes"],
            summary: "Obtém detalhes de um componente",
            description: `
            + Caso de uso: Consulta de detalhes de componente específico.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de um componente cadastrado.
                + Recebe como path parameter:
                    - **id**: identificador do componente (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência do componente.  
                - Retorna componente populado com dados de categoria e localização.
                - Checar permissões do solicitante para visualizar dados.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **ComponenteDetalhes**, contendo dados completos do componente.
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
                    description: "ID do componente"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/ComponenteDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        patch: {
            tags: ["Componentes"],
            summary: "Atualiza um componente",
            description: `
            + Caso de uso: Atualização parcial de dados do componente.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado modificar informações do componente.
                + Recebe:
                    - **id** no path.  
                    - No corpo, objeto conforme **ComponentePutPatch** com os campos a alterar.

            + Regras de Negócio:
                - Permite atualização parcial de campos.
                - Não permite alterar quantidade diretamente (apenas via movimentação).
                - Garantir unicidade do nome do componente.  
                - Verificar se o componente existe antes de atualizar.
                - Validar se categoria e localização existem (se informados).

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **ComponenteDetalhes**, refletindo as alterações.
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
                    description: "ID do componente"
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ComponentePutPatch"
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/ComponenteDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        delete: {
            tags: ["Componentes"],
            summary: "Deleta um componente",
            description: `
            + Caso de uso: Exclusão de componente.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado remover um componente que não está sendo utilizado.
                + Recebe como path parameter:
                    - **id**: identificador do componente.

            + Regras de Negócio:
                - Verificar se o componente existe antes de excluir.
                - Não permitir exclusão se há movimentações vinculadas ao componente.  
                - Registrar log de auditoria sobre a operação.  
                - Garantir que não haja vínculos críticos pendentes.

            + Resultado Esperado:
                - HTTP 200 OK - componente excluído com sucesso.
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
                    description: "ID do componente"
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

export default componentesRoutes;