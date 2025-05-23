# Plano de Teste

**Projeto Componentes Eletrônicos**

*versão 1.0*

## 1 - Introdução

O presente sistema tem como objetivo informatizar a gestão de uma biblioteca, oferecendo funcionalidades que abrangem o cadastro de livros, controle de empréstimos e devoluções, gerenciamento de usuários (alunos, funcionários e administradores), e aplicação de regras específicas como limite de empréstimos e cálculo de multas por atraso.

Este plano de teste descreve os cenários, critérios de aceitação e verificações que serão aplicados sobre as principais funcionalidades do sistema, visando garantir o correto funcionamento das regras de negócio, a integridade dos dados e a experiência do usuário.

## 2 - Arquitetura da API

A aplicação adota uma arquitetura modular em camadas, implementada com as tecnologias Node.js, Express, MongoDB (via Mongoose), Zod para validação de dados, JWT para autenticação e Swagger para documentação interativa da API. O objetivo é garantir uma estrutura clara, escalável e de fácil manutenção, com separação de responsabilidades e aderência a boas práticas de desenvolvimento backend.

### Camadas;

**Routes**: Responsável por definir os endpoints da aplicação e encaminhar as requisições para os controllers correspondentes. Cada recurso do sistema possui um arquivo de rotas dedicado.

**Controllers**: Gerenciam a entrada das requisições HTTP, realizam a validação de dados com Zod e invocam os serviços adequados. Também são responsáveis por formatar e retornar as respostas.

**Services**: Esta camada centraliza as regras de negócio do sistema. Ela abstrai a lógica do domínio, orquestra operações e valida fluxos antes de interagir com a base de dados.

**Repositories**: Encapsulam o acesso aos dados por meio dos modelos do Mongoose, garantindo que a manipulação do banco esteja isolada da lógica de negócio.

**Models**: Definem os esquemas das coleções do MongoDB, com o uso de Mongoose, representando as entidades principais do sistema como livros, leitores e empréstimos.

**Validations**: Utiliza Zod para garantir que os dados recebidos nas requisições estejam no formato esperado, aplicando validações personalizadas e mensagens de erro claras.

**Middlewares**: Implementam funcionalidades transversais, como autenticação de usuários com JWT, tratamento global de erros, e controle de permissões por tipo de perfil.

Existe um documento demonstrando quando e como aplicar as validações link: https://docs.google.com/document/d/1m2Ns1rIxpUzG5kRsgkbaQFdm7od0e7HSHfaSrrwegmM/edit?usp=sharing

## 3 - Categorização  dos  Requisitos  em  Funcionais  x  Não Funcionais

| Código | Requisito Funcional                                                                                   | Regra de Negócio Associada                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
|RF-001|Cadastro de Usuário|O sistema deve permitir o cadastro de usuários, informando: nome, e-mail e senha.|Essencial|
|RF-002|Login de Usuário|O sistema deve permitir que usuários cadastrados acessem suas contas existentes para gerenciar seus componentes.|Essencial|
|RF-003|Cadastrar Componentes|O sistema deve permitir cadastrar e editar componentes eletrônicos, informando: nome, código, quantidade, estoque mínimo, valor unitário, categoria, localização e fornecedor.|Essencial|
|RF-004|Notificar Alerta de Estoque|O sistema deverá gerar alertas automáticos quando um componente estiver abaixo do estoque mínimo, quando se tornar indisponível, e quando houver entradas ou saídas de componentes no estoque.|Importante|
|RF-005|Consultar Gestão de Estoque|O sistema deve exibir informações detalhadas dos componentes (quantidade disponível, status e localização física no estoque) e atualizar automaticamente os dados de estoque em tempo real após qualquer movimentação de entrada ou saída de itens.|Essencial|
|RF-006|Buscar Componentes|O sistema deve possuir mecanismos de busca e filtragem por nome, status e categoria.|Essencial|
|RF-007|Realizar Orçamento|O sistema deve permitir registrar e consultar orçamentos de componentes, incluindo os seguintes campos: nome, protocolo, descrição, e, para cada componente adicionado ao orçamento: nome, fornecedor, quantidade, valor unitário e subtotal. O sistema deve calcular automaticamente o subtotal do componente (quantidade × valor unitário) e o valor total do orçamento, bem como permitir a exportação dos orçamentos em PDF. Após o salvamento, o orçamento deve ser automaticamente registrado nos relatórios do sistema para fins de histórico e consulta.|Essencial|
|RF-008|Registrar Relatórios|O sistema deve gerar relatórios de componentes, movimentações de estoque e orçamentos. Cada movimentação de estoque registrará os dados do componente, data e hora, quantidade e tipo de movimentação (entrada ou saída). O sistema também armazenará o histórico completo de orçamentos salvos e as informações detalhadas sobre o estoque de componentes.|Essencial|

| Código | Requisito Não Funcional                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------------------- |
| RNF001 | Acessibilidade Multiplataforma|O sistema deve ser acessível e funcional em diferentes dispositivos, como smartphones, tablets e computadores desktop. O design deve ser adaptável a diferentes tamanhos de tela, garantindo tanto uma boa experiência do usuário quanto uma navegação intuitiva e rápida. |

## 4 - Casos de Teste
Os casos de teste serão implementados ao longo do desenvolvimento, organizados em arquivos complementares. De forma geral, serão considerados cenários de sucesso, cenários de falha e as regras de negócio associadas a cada funcionalidade.

## 5 - Estratégia de Teste

A estratégia de teste adotada neste projeto busca garantir a qualidade funcional e estrutural do sistema da biblioteca por meio da aplicação de testes em múltiplos níveis, alinhados ao ciclo de desenvolvimento.

Serão executados testes em todos os níveis conforme a descrição abaixo.

**Testes Unitários**: Focados em verificar o comportamento isolado das funções, serviços e regras de negócio, o código terá uma cobertura de 70% de testes unitários, que são de responsabilidade dos desenvolvedores.

**Testes de Integração**: Verificarão a interação entre diferentes camadas (ex: controller + service + repository) e a integração com o banco de dados, serão executados testes de integração em todos os endpoints, e esses testes serão dos desenvolvedores.

**Testes Manuais**: Realizados pontualmente na API por meio do Swagger ou Postman, com o objetivo de validar diferentes fluxos de uso e identificar comportamentos inesperados durante o desenvolvimento. A execução desses testes é de responsabilidade dos desenvolvedores, tanto durante quanto após a implementação das funcionalidades.

Os testes serão implementados de forma incremental, acompanhando o desenvolvimento das funcionalidades. Cada funcionalidade terá seu próprio plano de teste específico, com os casos detalhados, critérios de aceitação e cenários de sucesso e falha.

## 6 - Ambiente e Ferramentas

Os testes serão feitos do ambiente de desenvolvimento, e contém as mesmas configurações do ambiente de produção.

As seguintes ferramentas serão utilizadas no teste:

Ferramenta | 	Time |	Descrição 
-----------|--------|--------
POSTMAN, Swagger UI 	| Desenvolvimento|	Ferramenta para realização de testes manuais de API
Jest|	Desenvolvimento |Framework utilizada para testes unitários e integração
Supertest|	Desenvolvimento|	Framework utilizada para testes de endpoints REST
MongoDB Memory Server|	Desenvolvimento|	Para testes com banco em memória, garantindo isolamento dos dados

## 7 - Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:

ID 	|Nivel de Severidade |	Descrição 
-----------|--------|--------
1	|Blocker |	●	Bug que bloqueia o teste de uma função ou feature causa crash na aplicação. <br>●	Botão não funciona impedindo o uso completo da funcionalidade. <br>●	Bloqueia a entrega. 
2	|Grave |	●	Funcionalidade não funciona como o esperado <br>●	Input incomum causa efeitos irreversíveis
3	|Moderada |	●	Funcionalidade não atinge certos critérios de aceitação, mas sua funcionalidade em geral não é afetada <br>●	Mensagem de erro ou sucesso não é exibida
4	|Pequena |	●	Quase nenhum impacto na funcionalidade porém atrapalha a experiência  <br>●	Erro ortográfico<br>● Pequenos erros de UI

### 8 - Definição de Pronto 
Será considerada pronta as funcionalidades que passarem pelas verificações e testes descritas nos casos de teste, não apresentarem bugs com a severidade acima de moderada, e passarem por uma validação da equipe.
