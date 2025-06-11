# PROJETO DE SOFTWARE - Componentes Eletrônicos

## REQUISITOS DO SISTEMA

### REQUISITOS FUNCIONAIS

| Código  | Requisito Funcional | Regra de Negócio Associada |
| ------- | ------------------- | -------------------------- |
| RF-001  | Cadastro de Usuário | O sistema deve permitir o cadastro de usuários, informando: nome, e-mail e senha. Deve validar a unicidade do e-mail e garantir que a senha atenda aos critérios mínimos de segurança. | Essencial |
| RF-002  | Login de Usuário | O sistema deve permitir que usuários cadastrados acessem suas contas existentes para gerenciar seus componentes, utilizando autenticação segura via JWT. | Essencial |
| RF-003  | Cadastrar e Editar Componentes | O sistema deve permitir cadastrar e editar componentes eletrônicos, informando: nome, código, quantidade, estoque mínimo, valor unitário, categoria, localização e fornecedor(caso seja uma entrada). Deve validar a existência da categoria e localização no banco de dados antes de permitir o cadastro ou edição, garantir a unicidade do nome do componente, e impedir alterações diretas na quantidade via edição (quantidade só pode ser alterada por movimentações de estoque). | Essencial |
| RF-004  | Notificar Alerta de Estoque | O sistema deverá gerar alertas automáticos quando um componente estiver abaixo do estoque mínimo, quando se tornar indisponível, e quando houver entradas ou saídas de componentes no estoque. Os alertas devem ser registrados e exibidos para os usuários responsáveis. | Importante |
| RF-005  | Consultar Gestão de Estoque | O sistema deve exibir informações detalhadas dos componentes (quantidade disponível, status, valor, categoria e localização física no estoque) e atualizar automaticamente os dados de estoque em tempo real após qualquer movimentação de entrada ou saída de itens. | Essencial |
| RF-006  | Buscar e Filtrar Componentes | O sistema deve possuir mecanismos de busca e filtragem por nome, status, categoria, localização e fornecedor, permitindo consultas rápidas e precisas. | Essencial |
| RF-007  | Realizar Orçamento | O sistema deve permitir registrar e consultar orçamentos de componentes, incluindo os seguintes campos: nome, protocolo, descrição, e, para cada componente adicionado ao orçamento: nome, fornecedor, quantidade, valor unitário e subtotal. O sistema deve calcular automaticamente o subtotal do componente (quantidade × valor unitário) e o valor total do orçamento, bem como permitir a exportação dos orçamentos em PDF. Após o salvamento, o orçamento deve ser automaticamente registrado no sistema para fins de histórico e consulta. | Essencial |
| RF-008  | Gerenciar Categorias, Localizações e Fornecedores | O sistema deve permitir o cadastro, edição, busca e exclusão de categorias, localizações e fornecedores, garantindo que não seja possível excluir registros vinculados a componentes ou movimentações existentes. | Essencial |

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

- [x] Requisitos Implementados na API (explicar como se deu a escolha e quantos vão ficar para a próxima milestone):
    - Usuário
    - Notificações 
    - Componentes
    - Movimentações
    ---
    Próxima Milestone: <br>
    - Componentes 
- [x] Documentação das rota implementadas (incluindo regras de negócio) 
- [x] Plano de Teste do projeto com cenários de teste implementados (explicar o fluxo principal associando a regra de negócio aos testes)
- [x] Teste unitário das funcionalidades implementadas (explicação do teste do fluxo principal, demonstrar a cobertura de testes unitários)

## TAREFAS - Milestone 3

- [ ] Requisitos Implementados na API ( Restante que sobrou) 
    - Componentes
- [ ] Documentação das rota implementadas (incluindo regras de negócio {Lembre-se de colocar no gitlab em formato MarkDown}) 
- [ ] Executar o Docker e docker-compose e explicar
- [ ] Teste unitário e de endpoint das funcionalidades implementadas (Explicação do teste do fluxo principal, demonstrar a cobertura de testes unitários)
- [ ] Apresentação prática do produto (SWAGGER)