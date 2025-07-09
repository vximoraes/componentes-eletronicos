import fornecedoresSchemas from "../schemas/fornecedorSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

const fornecedoresRoutes = {
    "/fornecedores": {
        post: {
            tags: ["Fornecedores"],
            summary: "Cria um novo fornecedor",
            description: `
            + Caso de uso: Criação de novo fornecedor no sistema.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado criar um novo fornecedor para registrar movimentações de entrada.
                + Recebe no corpo da requisição:
                    - Objeto conforme schema **FornecedorPost**, contendo o nome do fornecedor.

            + Regras de Negócio:
                - Campo obrigatório: nome (mínimo 3 caracteres).
                - Campo 'ativo' tem padrão true.
                - Nome deve ser único no sistema.
                - Não permite campos fora do schema.

            + Resultado Esperado:
                - HTTP 201 Created com corpo conforme **FornecedorDetalhes**, contendo todos os dados do fornecedor criado.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/FornecedorPost"
                        }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/FornecedorDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        
        get: {
            tags: ["Fornecedores"],
            summary: "Lista todos os fornecedores",
            description: `
        + Caso de uso: Listagem de fornecedores para gerenciamento e consulta.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista paginada de fornecedores cadastrados.
            + Recebe como query parameters (opcionais):
                • filtros: nome, ativo.  
                • paginação: page (número da página), limite (quantidade de itens por página).

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - Respeitar as permissões do usuário autenticado.  
            - Aplicar paginação e retornar metadados: total de registros e total de páginas.
            - Limite máximo de 100 itens por página.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **FornecedorListagem**, contendo:
                • **data**: array de fornecedores.  
                • **dados de paginação**: totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage.
            `,
            security: [{ bearerAuth: [] }],
            parameters: generateParameters(fornecedoresSchemas.FornecedorFiltro).concat([
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
                    description: "Lista de fornecedores retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FornecedorListagem"
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
    "/fornecedores/{id}": {
        get: {
            tags: ["Fornecedores"],
            summary: "Obtém detalhes de um fornecedor",
            description: `
            + Caso de uso: Consulta de detalhes de fornecedor específico.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de um fornecedor cadastrado.
                + Recebe como path parameter:
                    - **id**: identificador do fornecedor (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência do fornecedor.  
                - Checar permissões do solicitante para visualizar dados.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **FornecedorDetalhes**, contendo dados completos do fornecedor.
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
                    description: "ID do fornecedor"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/FornecedorDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        patch: {
            tags: ["Fornecedores"],
            summary: "Atualiza um fornecedor",
            description: `
            + Caso de uso: Atualização parcial de dados do fornecedor.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado modificar informações do fornecedor.
                + Recebe:
                    - **id** no path.  
                    - No corpo, objeto conforme **FornecedorPutPatch** com os campos a alterar.

            + Regras de Negócio:
                - Permite atualização parcial de campos.
                - Garantir unicidade do nome do fornecedor.  
                - Verificar se o fornecedor existe antes de atualizar.
                - Impedir alterações que violem regras de negócio.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **FornecedorDetalhes**, refletindo as alterações.
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
                    description: "ID do fornecedor"
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/FornecedorPutPatch"
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/FornecedorDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        delete: {
            tags: ["Fornecedores"],
            summary: "Deleta um fornecedor",
            description: `
            + Caso de uso: Exclusão de fornecedor.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado remover um fornecedor que não está sendo utilizado.
                + Recebe como path parameter:
                    - **id**: identificador do fornecedor.

            + Regras de Negócio:
                - Verificar se o fornecedor existe antes de excluir.
                - Não permitir exclusão se há movimentações vinculadas ao fornecedor.  
                - Registrar log de auditoria sobre a operação.  
                - Garantir que não haja vínculos críticos pendentes.

            + Resultado Esperado:
                - HTTP 200 OK - fornecedor excluído com sucesso.
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
                    description: "ID do fornecedor"
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

export default fornecedoresRoutes;