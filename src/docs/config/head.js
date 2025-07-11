import authSchemas from "../schemas/authSchema.js";
import usuariosSchemas from "../schemas/usuariosSchema.js";
import categoriasSchemas from "../schemas/categoriaSchema.js";
import componentesSchemas from "../schemas/componenteSchema.js";
import fornecedoresSchemas from "../schemas/fornecedorSchema.js";
import localizacoesSchemas from "../schemas/localizacaoSchema.js";
import movimentacoesSchemas from "../schemas/movimentacaoSchema.js";
import notificacoesSchemas from "../schemas/notificacaoSchema.js";
import orcamentosSchemas from "../schemas/orcamentoSchema.js";
import usuariosPaths from "../paths/usuarios.js";
import authPaths from "../paths/auth.js";
import categoriasPaths from "../paths/categoria.js";
import componentesPaths from "../paths/componente.js";
import fornecedoresPaths from "../paths/fornecedor.js";
import localizacoesPaths from "../paths/localizacao.js";
import movimentacoesPaths from "../paths/movimentacao.js";
import notificacoesPaths from "../paths/notificacao.js";
import orcamentosPaths from "../paths/orcamento.js";

// Função para definir as URLs do servidor dependendo do ambiente
const getServersInCorrectOrder = () => {
    const PORT = process.env.PORT
    const devUrl = { url: process.env.SWAGGER_DEV_URL || `http://localhost:${PORT}` };

    if (process.env.NODE_ENV === "production") return [devUrl];
    else return [devUrl, prodUrl1];
};

// Função para obter as opções do Swagger
const getSwaggerOptions = () => {
    return {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "API Componentes Eletrônicos",
                version: "1.0.0",
                description: "API para gestão de componentes eletrônicos \n\nÉ necessário autenticar com token JWT antes de utilizar a maioria das rotas. Faça isso na rota /login com um email e senha válido. Esta API conta com refresh token, que pode ser obtido na rota /refresh, e com logout, que pode ser feito na rota /logout. Para revogação de acesso use a rota /revoke. Para mais informações, acesse a documentação.",
                contact: {
                    name: "Equipe de Desenvolvimento",
                    email: "dev@componentes-eletronicos.com",
                },
            },
            servers: getServersInCorrectOrder(),
            tags: [
                {
                    name: "Auth",
                    description: "Rotas para autenticação e autorização"
                },
                {
                    name: "Usuários",
                    description: "Rotas para gestão de usuários"
                },
                {
                    name: "Componentes",
                    description: "Rotas para gestão de componentes eletrônicos"
                },
                {
                    name: "Categorias",
                    description: "Rotas para gestão de categorias de componentes"
                },
                {
                    name: "Fornecedores",
                    description: "Rotas para gestão de fornecedores"
                },
                {
                    name: "Localização",
                    description: "Rotas para gestão de localização de componentes"
                },
                {
                    name: "Movimentação",
                    description: "Rotas para gestão de movimentação de componentes"
                },
                {
                    name: "Orçamentos",
                    description: "Rotas para gestão de orçamentos"
                },
                {
                    name: "Notificações",
                    description: "Rotas para gestão de notificações"
                }
            ],
            paths: {
                ...authPaths,
                ...usuariosPaths,
                ...categoriasPaths,
                ...componentesPaths,
                ...fornecedoresPaths,
                ...localizacoesPaths,
                ...movimentacoesPaths,
                ...notificacoesPaths,
                ...orcamentosPaths,
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                },
                schemas: {
                    ...authSchemas,
                    ...usuariosSchemas,
                    ...categoriasSchemas,
                    ...componentesSchemas,
                    ...fornecedoresSchemas,
                    ...localizacoesSchemas,
                    ...movimentacoesSchemas,
                    ...notificacoesSchemas,
                    ...orcamentosSchemas,
                }
            },
            security: [{
                bearerAuth: []
            }]
        },
        apis: ["./src/routes/*.js"]
    };
};

export default getSwaggerOptions;