import categoriasSchemas from "../schemas/categoriaSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

const categoriasRoutes = {
    "/categorias": {
        post: {
            tags: ["Categorias"],
            summary: "Cria uma nova categoria",
            description: `
            + Caso de uso: Criação de nova categoria de componentes no sistema.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado criar uma nova categoria para organizar componentes eletrônicos.
                + Recebe no corpo da requisição:
                    - Objeto conforme schema **CategoriaPost**, contendo o nome da categoria.

            + Regras de Negócio:
                - Nome é obrigatório e deve ter no mínimo 3 caracteres.
                - Nome deve ser único no sistema.
                - Em caso de duplicidade ou erro de validação, retorna erro apropriado.

            + Resultado Esperado:
                - HTTP 201 Created com corpo conforme **CategoriaDetalhes**, contendo todos os dados da categoria criada.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CategoriaPost"
                        }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/CategoriaDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        
        get: {
            tags: ["Categorias"],
            summary: "Lista todas as categorias",
            description: `
        + Caso de uso: Listagem de categorias para gerenciamento e consulta.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista paginada de categorias cadastradas.
            + Recebe como query parameters (opcionais):
                • filtros: nome.  
                • paginação: page (número da página), limite (quantidade de itens por página).

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - Respeitar as permissões do usuário autenticado.  
            - Aplicar paginação e retornar metadados: total de registros e total de páginas.
            - Limite máximo de 100 itens por página.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **CategoriaListagem**, contendo:
                • **data**: array de categorias.  
                • **dados de paginação**: totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage.
            `,
            security: [{ bearerAuth: [] }],
            parameters: generateParameters(categoriasSchemas.CategoriaFiltro).concat([
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
                    description: "Lista de categorias retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CategoriaListagem"
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
    "/categorias/{id}": {
        get: {
            tags: ["Categorias"],
            summary: "Obtém detalhes de uma categoria",
            description: `
            + Caso de uso: Consulta de detalhes de categoria específica.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de uma categoria cadastrada.
                + Recebe como path parameter:
                    - **id**: identificador da categoria (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência da categoria.  
                - Checar permissões do solicitante para visualizar dados.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **CategoriaDetalhes**, contendo dados completos da categoria.
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
                    description: "ID da categoria"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/CategoriaDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        patch: {
            tags: ["Categorias"],
            summary: "Atualiza uma categoria",
            description: `
            + Caso de uso: Atualização parcial de dados da categoria.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado modificar o nome da categoria.
                + Recebe:
                    - **id** no path.  
                    - No corpo, objeto conforme **CategoriaPutPatch** com os campos a alterar.

            + Regras de Negócio:
                - Garantir unicidade do nome da categoria.  
                - Verificar se a categoria existe antes de atualizar.
                - Impedir alterações que violem regras de negócio.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **CategoriaDetalhes**, refletindo as alterações.
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
                    description: "ID da categoria"
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CategoriaPutPatch"
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/CategoriaDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                409: commonResponses[409](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },

        delete: {
            tags: ["Categorias"],
            summary: "Deleta uma categoria",
            description: `
            + Caso de uso: Exclusão de categoria.
            
            + Função de Negócio:
                - Permitir ao usuário autenticado remover uma categoria que não está sendo utilizada.
                + Recebe como path parameter:
                    - **id**: identificador da categoria.

            + Regras de Negócio:
                - Verificar se a categoria existe antes de excluir.
                - Não permitir exclusão se há componentes vinculados à categoria.  
                - Registrar log de auditoria sobre a operação.  
                - Garantir que não haja vínculos críticos pendentes.

            + Resultado Esperado:
                - HTTP 200 OK - categoria excluída com sucesso.
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
                    description: "ID da categoria"
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

export default categoriasRoutes;