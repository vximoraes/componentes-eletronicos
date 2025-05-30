# Documento de Rotas - Sistema de Gestão de Componentes Eletrônicos

## 1. Login de Usuário

### 1.1 POST /auth/login

#### Caso de Uso
- Realizar autenticação de usuário no sistema, permitindo o acesso às funcionalidades internas.

#### Regras de Negócio Envolvidas
- Validação de Credenciais: Verificar se o e-mail e senha correspondem a um usuário cadastrado;
- Emissão de Token: gerar um JWT.
  
#### Resultado Esperado
- Geração de token de autenticação para acesso ao sistema.
- Retorno do objeto de usuário.
- Em caso de falha, retornar mensagem de erro específica.

## 2. Usuário

### 2.1 POST /usuarios

#### Caso de Uso
- Criar um novo usuário.

#### Regras de Negócio
- Nome: obrigatório, mínimo 3 caracteres.
- E-mail: obrigatório, formato válido, único.
- Senha: obrigatório, mínimo 8 caracteres, deve conter letras maiúsculas, minúsculas, números e caracteres especiais.
- Campo `ativo`: padrão true, pode ser informado.
- A senha é criptografada antes do armazenamento.
- Não é permitido informar campos além dos definidos no schema.

#### Resultado Esperado
- Usuário criado com sucesso, sem retornar o campo senha.
- Em caso de e-mail já cadastrado, retorna erro 409.
- Em caso de dados inválidos, retorna erro 400.

### 2.2 GET /usuarios e /usuarios/:id

#### Caso de Uso
- Listar usuários ou obter usuário por id.

#### Regras de Negócio
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: nome, e-mail, ativo.
- Não retorna o campo senha.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada de usuários ou usuário específico.
- Em caso de erro de validação, retorna erro 400.

### 2.3 PATCH/PUT /usuarios/:id

#### Caso de Uso
- Atualizar nome ou status ativo do usuário.

#### Regras de Negócio
- Só é permitido atualizar nome e ativo.
- E-mail e senha não podem ser alterados.
- Se usuário não existir, retorna erro 404.

#### Resultado
- Usuário atualizado, sem retornar senha.
- Em caso de dados inválidos, retorna erro 400.

### 2.4 DELETE /usuarios/:id

#### Caso de Uso
- Remover usuário.

#### Regras de Negócio Implementadas
- Se usuário tiver relacionamento com notificações, não pode ser deletado.
- Se usuário não existir, retorna erro 404.

#### Resultado
- Usuário deletado.
- Em caso de erro, retorna mensagem específica.

## 3. Componentes

### 3.1 POST /componentes

#### Caso de Uso
- Criar novo componente.

#### Regras de Negócio
- Campos obrigatórios: nome, estoque_minimo, valor_unitario, categoria, localizacao.
- quantidade, estoque_minimo e valor_unitario: não podem ser negativos.
- Campo `ativo`: padrão true.
- Não permite campos fora do schema.

#### Resultado
- Componente criado.
- Em caso de nome duplicado, retorna erro 409.
- Em caso de dados inválidos, retorna erro 400.
- Em caso de categoria ou localizacao não encontradas, retorna mensagem específica.

### 3.2 GET /componentes e /componentes/:id

#### Caso de Uso
- Listar componentes ou obter componente por id.

#### Regras de Negócio
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: nome, categoria, localizacao, ativo, estoque_minimo, quantidade.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada ou componente específico.
- Em caso de erro de validação, retorna erro 400.

### 3.3 PATCH/PUT /componentes/:id

#### Caso de Uso
- Atualizar informações do componente.

#### Regras de Negócio
- Permite atualização parcial.
- Não permite alterar quantidade diretamente (apenas via movimentação).
- Não permite nome duplicado.
- Se componente não existir, retorna erro 404.

#### Resultado
- Componente atualizado.
- Em caso de erro, retorna mensagem específica.

### 3.4 DELETE /componentes/:id

#### Caso de Uso
- Remover componente.

#### Regras de Negócio
- Se componente tiver relacionamento com movimentações, não pode ser deletado.
- Se componente não existir, retorna erro 404.

#### Resultado
- Confirmação de exclusão.
- Em caso de erro, retorna mensagem específica.

## 4. Movimentações

### 4.1 POST /movimentacoes

#### Caso de Uso
- Registrar movimentação de um componente (entrada ou saída).

#### Regras de Negócio
- Campos obrigatórios: componente, tipo (entrada/saida), quantidade.
- Para entrada: fornecedor é obrigatório e deve existir.
- Para saída: fornecedor não é necessário e ignorado caso seja informado no body.
- Não permite quantidade negativa ou maior que o estoque disponível (para saída).
- Atualiza a quantidade do componente automaticamente.
- Data/hora é gerada automaticamente pelo sistema.

#### Resultado
- Movimentação registrada.
- Em caso de componente/fornecedor inexistente, retorna erro 404.
- Em caso de quantidade insuficiente, retorna erro 400.

### 4.2 GET /movimentacoes e /movimentacoes/:id

#### Caso de Uso
- Listar movimentações ou obter movimentação por id.

#### Regras de Negócio Implementadas
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: tipo, data, componente, fornecedor.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada ou movimentação específica.
- Em caso de erro de validação, retorna erro 400.

## 5. Fornecedores

### 5.1 POST /fornecedores

#### Caso de Uso
- Criar fornecedor.

#### Regras de Negócio Implementadas
- Campo obrigatório: nome (mínimo 3 caracteres).
- Campo `ativo`: padrão true.
- Nome deve ser único.
- Não permite campos fora do schema.

#### Resultado
- Fornecedor criado.
- Em caso de nome duplicado, retorna erro 409.

### 5.2 GET /fornecedores e /fornecedores/:id

#### Caso de Uso
- Listar fornecedores ou obter fornecedor por id.

#### Regras de Negócio Implementadas
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: nome, ativo.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada ou fornecedor específico.

### 5.3 PATCH/PUT /fornecedores/:id

#### Caso de Uso
- Atualizar fornecedor.

#### Regras de Negócio
- Permite atualização parcial.
- Nome deve ser único.
- Se fornecedor não existir, retorna erro 404.

#### Resultado
- Fornecedor atualizado.

### 5.4 DELETE /fornecedores/:id

#### Caso de Uso
- Remover fornecedor.

#### Regras de Negócio Implementadas
- Não permite remover fornecedor vinculado a movimentações.
- Se fornecedor não existir, retorna erro 404.

#### Resultado
- Fornecedor removido.

## 6. Localizações

### 6.1 POST /localizacoes

#### Caso de Uso
- Criar localização.

#### Regras de Negócio Implementadas
- Campo obrigatório: nome (mínimo 3 caracteres).
- Campo `ativo`: padrão true.
- Nome deve ser único.
- Não permite campos fora do schema.

#### Resultado
- Localização criada.
- Em caso de nome duplicado, retorna erro 409.

### 6.2 GET /localizacoes e /localizacoes/:id

#### Caso de Uso
- Listar localizações ou obter localização por id.

#### Regras de Negócio Implementadas
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: nome, ativo.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada ou localização específica.

### 6.3 PATCH/PUT /localizacoes/:id

#### Caso de Uso
- Atualizar localização.

#### Regras de Negócio Implementadas
- Permite atualização parcial.
- Nome deve ser único.
- Se localização não existir, retorna erro 404.

#### Resultado
- Localização atualizada.

### 6.4 DELETE /localizacoes/:id

#### Caso de Uso
- Remover localização.

#### Regras de Negócio Implementadas
- Não permite remover localização vinculada a componentes.
- Se localização não existir, retorna erro 404.

#### Resultado
- Localização removida.

## 7. Categorias

### 7.1 POST /categorias

#### Caso de Uso
- Criar categoria.

#### Regras de Negócio Implementadas
- Campo obrigatório: nome (mínimo 3 caracteres).
- Nome deve ser único.
- Não permite campos fora do schema.

#### Resultado
- Categoria criada.
- Em caso de nome duplicado, retorna erro 409.

### 7.2 GET /categorias e /categorias/:id

#### Caso de Uso
- Listar categorias ou obter categoria por id.

#### Regras de Negócio Implementadas
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: nome.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada ou categoria específica.

### 7.3 PATCH/PUT /categorias/:id

#### Caso de Uso
- Atualizar categoria.

#### Regras de Negócio Implementadas
- Permite atualização parcial.
- Nome deve ser único.
- Se categoria não existir, retorna erro 404.

#### Resultado
- Categoria atualizada.

### 7.4 DELETE /categorias/:id

#### Caso de Uso
- Remover categoria.

#### Regras de Negócio Implementadas
- Remove o registro do banco.
- Se categoria não existir, retorna erro 404.

#### Resultado
- Categoria removida.

# Considerações Finais
- Segurança: Em todos os endpoints, a segurança deve ser uma prioridade, com a implementação de mecanismos de autenticação, autorização e registro de logs.
- Validação e Tratamento de Erros: É fundamental validar as entradas dos usuários e retornar mensagens de erro claras para auxiliar na resolução de problemas.
- Documentação e Monitoramento: Manter uma documentação atualizada dos endpoints e monitorar as requisições para garantir a integridade e disponibilidade do sistema.
