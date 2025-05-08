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
|RF-006|Buscar Componentes|O sistema deve possuir mecanismos de busca e filtragem por nome, status e categoria.|Essencial|
|RF-007|Realizar Orçamento|O sistema deve permitir registrar e consultar orçamentos de componentes, incluindo os seguintes campos: nome, protocolo, descrição, e, para cada componente adicionado ao orçamento: nome, fornecedor, quantidade, valor unitário e subtotal. O sistema deve calcular automaticamente o subtotal do componente (quantidade × valor unitário) e o valor total do orçamento, bem como permitir a exportação dos orçamentos em PDF. Após o salvamento, o orçamento deve ser automaticamente registrado nos relatórios do sistema para fins de histórico e consulta.|Essencial|
|RF-008|Registrar Relatórios|O sistema deve gerar relatórios de componentes, movimentações de estoque e orçamentos. Cada movimentação de estoque registrará os dados do componente, data e hora, quantidade e tipo de movimentação (entrada ou saída). O sistema também armazenará o histórico completo de orçamentos salvos e as informações detalhadas sobre o estoque de componentes.|Essencial|

### REQUISITOS NÃO FUNCIONAIS

| IDENTIFICADOR | NOME | DESCRIÇÃO | PRIORIDADE |
|:---|:---|:---|:---|
|RNF-001|Acessibilidade Multiplataforma|O sistema deve ser acessível e funcional em diferentes dispositivos, como smartphones, tablets e computadores desktop. O design deve ser adaptável a diferentes tamanhos de tela, garantindo tanto uma boa experiência do usuário quanto uma navegação intuitiva e rápida.|Essencial|

## TAREFAS - Milestone 1

- [x] Requisitos (revisão)
- [x] Modelagem do Banco (revisão)
- [x] Protótipo Figma (revisão)
- [x] Documentação de cada rota (incluindo regras de negócio)

## TAREFAS - Milestone 2

- [ ] Requisitos Implementados na API (explicar como se deu a escolha e quantos vão ficar para a próxima milestone) 
    - Perfil de Usuário
    - Notificações 
    - Componentes
    - Movimentações
- [ ] Documentação das rota implementadas (incluindo regras de negócio) 
- [ ] Plano de Teste do projeto com cenários de teste implementados (explicar o fluxo principal associando a regra de negócio aos testes)
- [ ] Teste unitário das funcionalidades implementadas (explicação do teste do fluxo principal, demonstrar a cobertura de testes unitários)
