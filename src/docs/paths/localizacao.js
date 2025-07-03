import localizacoesSchemas from "../schemas/localizacaoSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

const localizacoesRoutes = {
    "/localizacoes": {
        post: {
            tags: ["Localização"],
            summary: "Cria uma nova localização",
            description: `
            + Caso de uso: Criação de nova localização no sistema.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado criar uma nova localização para organizar componentes eletrônicos.
                + Recebe no corpo da requisição:
                    - Objeto conforme schema **LocalizacaoPost**, contendo o nome da localização.

            + Regras de Negócio:
                - Campo obrigatório: nome (mínimo 3 caracteres).
                - Campo 'ativo' tem padrão true.
                - Nome deve ser único no sistema.
                - Não permite campos fora do schema.

            + Resultado Esperado:
                - HTTP 201 Created com corpo conforme **LocalizacaoDetalhes**, contendo todos os dados da localização criada.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/LocalizacaoPost"
                        }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/LocalizacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        
        get: {
            tags: ["Localização"],
            summary: "Lista todas as localizações",
            description: `
        + Caso de uso: Listagem de localizações para gerenciamento e consulta.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista paginada de localizações cadastradas.
            + Recebe como query parameters (opcionais):
                • filtros: nome, ativo.  
                • paginação: page (número da página), limite (quantidade de itens por página).

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - Respeitar as permissões do usuário autenticado.  
            - Aplicar paginação e retornar metadados: total de registros e total de páginas.
            - Limite máximo de 100 itens por página.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **LocalizacaoListagem**, contendo:
                • **data**: array de localizações.  
                • **dados de paginação**: totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage.
            `,
            security: [{ bearerAuth: [] }],
            parameters: generateParameters(localizacoesSchemas.LocalizacaoFiltro).concat([
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
                    description: "Lista de localizações retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LocalizacaoListagem"
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
    "/localizacoes/{id}": {
        get: {
            tags: ["Localização"],
            summary: "Obtém detalhes de uma localização",
            description: `
            + Caso de uso: Consulta de detalhes de localização específica.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de uma localização cadastrada.
                + Recebe como path parameter:
                    - **id**: identificador da localização (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência da localização.  
                - Checar permissões do solicitante para visualizar dados.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **LocalizacaoDetalhes**, contendo dados completos da localização.
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
                    description: "ID da localização"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/LocalizacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        patch: {
            tags: ["Localização"],
            summary: "Atualiza uma localização",
            description: `
            + Caso de uso: Atualização parcial de dados da localização.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado modificar informações da localização.
                + Recebe:
                    - **id** no path.  
                    - No corpo, objeto conforme **LocalizacaoPutPatch** com os campos a alterar.

            + Regras de Negócio:
                - Permite atualização parcial de campos.
                - Garantir unicidade do nome da localização.  
                - Verificar se a localização existe antes de atualizar.
                - Impedir alterações que violem regras de negócio.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **LocalizacaoDetalhes**, refletindo as alterações.
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
                    description: "ID da localização"
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/LocalizacaoPutPatch"
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/LocalizacaoDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        delete: {
            tags: ["Localização"],
            summary: "Deleta uma localização",
            description: `
            + Caso de uso: Exclusão de localização.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado remover uma localização que não está sendo utilizada.
                + Recebe como path parameter:
                    - **id**: identificador da localização.

            + Regras de Negócio:
                - Verificar se a localização existe antes de excluir.
                - Não permitir exclusão se há componentes vinculados à localização.  
                - Registrar log de auditoria sobre a operação.  
                - Garantir que não haja vínculos críticos pendentes.

            + Resultado Esperado:
                - HTTP 200 OK - localização excluída com sucesso.
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
                    description: "ID da localização"
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

export default localizacoesRoutes;