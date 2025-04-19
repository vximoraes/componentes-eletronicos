# PROJETO DE SOFTWARE - Componentes Eletrônicos

## REQUISITOS DO SISTEMA

### REQUISITOS FUNCIONAIS

| IDENTIFICADOR | NOME | DESCRIÇÃO | PRIORIDADE |
:---|:---|:---|:---|
|RF-001|Cadastro de Usuário|O sistema deve permitir o cadastro de usuários, informando: nome, e-mail e senha.|Essencial|
|RF-002|Login de Usuário|O sistema deve permitir que usuários cadastrados acessem suas contas existentes para gerenciar seus componentes.|Essencial|
|RF-003|Cadastrar Componentes|O sistema deve permitir cadastrar e editar componentes eletrônicos, informando: nome, código, quantidade, estoque mínimo, valor unitário, categoria, localização e fornecedor.|Essencial|
|RF-004|Notificar Alerta de Estoque|O sistema deverá gerar alertas automáticos quando um componente estiver abaixo do estoque mínimo, quando se tornar indisponível, e quando houver entradas ou saídas de componentes no estoque.|Importante|
|RF-005|Consultar Gestão de Estoque|O sistema deve exibir informações detalhadas dos componentes (quantidade disponível, status e localização física no estoque) e atualizar automaticamente os dados de estoque em tempo real após qualquer movimentação de entrada ou saída de itens.|Essencial|
|RF-006|Cadastrar Categorias|O sistema deve permitir cadastrar e gerenciar categorias para classificar componentes.|Essencial|
|RF-007|Buscar Componentes|O sistema deve possuir mecanismos de busca e filtragem por nome, status e categoria.|Essencial|
|RF-008|Realizar Orçamento|O sistema deve permitir registrar e consultar orçamentos de componentes, incluindo os seguintes campos: nome, código, quantidade, valor unitário, fornecedor e data da aquisição. Além disso, deve calcular automaticamente o valor total baseado nas quantidades e preços unitários.|Essencial|
|RF-009|Registrar Relatórios|O sistema deve gerar relatórios de componentes, orçamentos e movimentações de estoque. Cada movimentação registrará data/hora, quantidade e tipo (entrada/saída). O sistema também armazenará histórico de orçamentos e fornecerá relatório atualizado do estoque.|Essencial|

### REQUISITOS NÃO FUNCIONAIS

| IDENTIFICADOR | NOME | DESCRIÇÃO | PRIORIDADE |
|:---|:---|:---|:---|
|RNF-001|Acessibilidade Multiplataforma|O sistema deve ser acessível e funcional em diferentes dispositivos, como smartphones, tablets e computadores desktop. O design deve ser adaptável a diferentes tamanhos de tela, garantindo tanto uma boa experiência do usuário quanto uma navegação intuitiva e rápida.|Essencial|

## TAREFAS - Milestone 1

- Requisitos (revisão)
- Modelagem do Banco (revisão)
- Protótipo Figma (revisão)
- Documentação de cada rota (incluindo regras de negócio)
