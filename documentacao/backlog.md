# PROJETO DE SOFTWARE - Componentes Eletrônicos

## TAREFAS 

- Requisitos (revisão)
- Modelagem do Banco (revisão)
- Protótipo Figma (revisão)
- Documentação de cada rota (incluindo regras de negócio)

## REQUISITOS DO SISTEMA

### REQUISITOS FUNCIONAIS

| IDENTIFICADOR | NOME | DESCRIÇÃO | PRIORIDADE |
:---|:---|:---|:---|
|RF-001| Cadastrar Usuários | O sistema deve permitir o cadastro de usuários com nome, e-mail, nível de acesso e senha obrigatórios. Os níveis de acesso são: Administrador, com acesso total para gerenciar o sistema; e Aluno/Estagiário, com acesso apenas para consultas, sem permissão para alterações.| Essencial|
|RF-002| Cadastrar Componentes | O sistema deve permitir o cadastro de componentes eletrônicos, exigindo os seguintes campos obrigatórios: nome do componente, descrição, quantidade, estoque mínimo, localização ou alocação do produto e valor unitário. Apenas usuários com permissão de administrador podem cadastrar novos componentes ou editar as informações dos já existentes.| Essencial |
|RF-003| Notificar Alerta de Estoque | O sistema deve gerar alertas automáticos para os usuários quando a quantidade de um componente estiver próxima ou abaixo do estoque mínimo ou quando alterações no estoque forem realizadas. As notificações devem ser visíveis para os administradores. | Importante |
|RF-004| Consultar Gestão de Estoque | O sistema deve exibir as informações dos componentes, incluindo a quantidade disponível, o status e a localização do componente no estoque. O sistema deve atualizar automaticamente os dados de estoque após entradas ou saídas de itens. | Essencial |
|RF-005| Cadastrar Categorias e Subcategorias | Administradores devem poder cadastrar e gerenciar categorias e subcategorias para classificar componentes. O sistema deve implementar mecanismos de busca e filtros por nome e categoria. | Essencial |
|RF-006| Realizar Orçamento | O sistema deve permitir o registro e consulta de orçamentos de componentes, incluindo os seguintes campos: nome do item, preço unitário, fornecedor e data da aquisição ou do orçamento. Além disso, deve calcular automaticamente o total do orçamento com base nas quantidades e valores dos itens.| Essencial |
|RF-007| Cadastrar Fornecedores | O sistema deve possibilitar o cadastro de fornecedores de componentes, incluindo as seguintes informações: nome do fornecedor e URL do fornecedor. Além disso, deve permitir que administradores editem ou excluam fornecedores cadastrados. | Essencial |
|RF-008| Registrar Relatórios | O sistema deve gerar relatórios detalhados sobre os componentes cadastrados, os orçamentos gerados e o histórico de movimentações de estoque, abrangendo entradas e saídas. Cada movimentação de componentes deve ser registrada com data e hora, quantidade movimentada e tipo de movimentação (entrada ou saída). Além disso, o sistema deve armazenar informações sobre orçamentos realizados e fornecer um relatório completo do estoque, incluindo o status atualizado de todos os itens. | Essencial |

### REQUISITOS NÃO FUNCIONAIS

| IDENTIFICADOR | NOME | DESCRIÇÃO | PRIORIDADE |
|:---|:---|:---|:---|
RNF-001| Interface Web Responsiva | O sistema deve ser acessível e funcional em diferentes dispositivos, como smartphones, tablets e computadores desktop. O design deve ser adaptável a diferentes tamanhos de tela, garantindo uma boa experiência do usuário e navegação intuitiva e rápida. | Desejável |
