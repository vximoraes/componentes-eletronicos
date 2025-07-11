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

### 1.2 POST /auth/recover

#### Caso de Uso
- Recuperar senha de usuário esquecida através do e-mail cadastrado.

#### Regras de Negócio Envolvidas
- Validação de E-mail: Verificar se o e-mail existe na base de dados.
- Geração de Link/Código: Criar link temporário ou código de recuperação.
- Envio de E-mail: Enviar instruções de recuperação para o e-mail do usuário.

#### Resultado Esperado
- Envio bem-sucedido das instruções de recuperação.
- Retorno de mensagem de confirmação.
- Em caso de e-mail não encontrado, retornar erro específico.

### 1.3 POST /auth/signup

#### Caso de Uso
- Realizar cadastro de novo usuário com senha no sistema.

#### Regras de Negócio Envolvidas
- Validação de Dados: Verificar se todos os campos obrigatórios foram preenchidos.
- Unicidade de E-mail: Garantir que o e-mail não está em uso.
- Criptografia de Senha: Aplicar hash na senha antes do armazenamento.
- Regras de Senha: Validar complexidade da senha.

#### Resultado Esperado
- Usuário criado com sucesso.
- Retorno do objeto de usuário (sem senha).
- Em caso de e-mail duplicado, retornar erro 409.
- Em caso de dados inválidos, retornar erro 400.

### 1.4 POST /auth/logout

#### Caso de Uso
- Realizar logout do usuário, invalidando sua sessão ativa.

#### Regras de Negócio Envolvidas
- Invalidação de Token: Marcar o token atual como inválido.
- Limpeza de Sessão: Remover dados de sessão do usuário.

#### Resultado Esperado
- Logout realizado com sucesso.
- Retorno de confirmação de logout.
- Token invalidado para futuras requisições.

### 1.5 POST /auth/revoke

#### Caso de Uso
- Revogar token de acesso do usuário, impedindo seu uso futuro.

#### Regras de Negócio Envolvidas
- Validação de Token: Verificar se o token é válido e pertence ao usuário.
- Revogação: Marcar o token como revogado na base de dados.

#### Resultado Esperado
- Token revogado com sucesso.
- Retorno de confirmação de revogação.
- Token não poderá ser utilizado em futuras requisições.

### 1.6 POST /auth/refresh

#### Caso de Uso
- Gerar novo token de acesso utilizando refresh token válido.

#### Regras de Negócio Envolvidas
- Validação de Refresh Token: Verificar se o refresh token é válido e não expirado.
- Geração de Novo Token: Criar novo token de acesso com validade renovada.
- Manutenção de Sessão: Manter a sessão ativa do usuário.

#### Resultado Esperado
- Novo token de acesso gerado com sucesso.
- Retorno do novo token com tempo de expiração.
- Em caso de refresh token inválido, retornar erro de autenticação.

### 1.7 POST /auth/introspect

#### Caso de Uso
- Verificar validade e obter informações detalhadas de um token de acesso.

#### Regras de Negócio Envolvidas
- Validação de Token: Verificar se o token é válido e não expirado.
- Extração de Dados: Obter informações do payload do token.
- Verificação de Permissões: Validar se o token possui as permissões necessárias.

#### Resultado Esperado
- Informações do token retornadas com sucesso.
- Dados do usuário e permissões associadas.
- Em caso de token inválido ou expirado, retornar erro específico.

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

## 8. Notificações

### 8.1 POST /notificacoes

#### Caso de Uso
- Criar uma nova notificação para um usuário.

#### Regras de Negócio
- Campos obrigatórios: mensagem, usuario (id).
- Campo `visualizada`: padrão false.
- Não permite campos fora do schema.
- Usuário deve existir.

#### Resultado
- Notificação criada com sucesso, retornando `_id`, `mensagem`, `visualizada` como `false`, `usuario` e `data_hora`.
- Em caso de usuário inexistente, retorna erro 400.
- Em caso de dados inválidos, retorna erro 400.

### 8.2 GET /notificacoes e /notificacoes/:id

#### Caso de Uso
- Listar notificações ou obter notificação por id.

#### Regras de Negócio
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: usuario, visualizada.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada ou notificação específica.
- Em caso de erro de validação, retorna erro 400.

### 8.3 PATCH/PUT /notificacoes/:id/visualizar

#### Caso de Uso
- Marcar notificação como visualizada.

#### Regras de Negócio
- Permite atualização apenas do status de visualização (de `false` para `true`).
- Se notificação não existir, retorna erro 404.

#### Resultado
- Notificação marcada como visualizada.
- Em caso de erro, retorna mensagem específica.

## 9. Orçamentos

### 9.1 POST /orcamentos

#### Caso de Uso
- Criar novo orçamento.

#### Regras de Negócio
- Campos obrigatórios: nome, protocolo, descrição, lista de componentes.
- Para cada componente: nome, fornecedor, quantidade, valor unitário.
- Calcula subtotal do componente (quantidade × valor unitário) e valor total do orçamento.
- Não permite campos fora do schema.

#### Resultado
- Orçamento criado, com cálculo automático dos valores.
- Em caso de dados inválidos, retorna erro 400.

### 9.2 GET /orcamentos e /orcamentos/:id

#### Caso de Uso
- Listar orçamentos ou obter orçamento por id.

#### Regras de Negócio
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros: nome, protocolo, fornecedor, data.
- Se id não existir, retorna erro 404.

#### Resultado
- Lista paginada ou orçamento específico.
- Em caso de erro de validação, retorna erro 400.

### 9.3 PATCH/PUT /orcamentos/:id

#### Caso de Uso
- Atualizar orçamento.

#### Regras de Negócio
- Permite atualização parcial.
- Não permite alterar protocolo.
- Se orçamento não existir, retorna erro 404.

#### Resultado
- Orçamento atualizado.

### 9.4 DELETE /orcamentos/:id

#### Caso de Uso
- Remover orçamento.

#### Regras de Negócio
- Se orçamento não existir, retorna erro 404.

#### Resultado
- Orçamento removido.

## 10. Componentes do Orçamento

### 10.1 GET /orcamentos/:id/componentes

#### Caso de Uso
- Listar componentes de um orçamento específico.

#### Regras de Negócio
- Orçamento deve existir.
- Se orçamento não existir, retorna erro 404.

#### Resultado
- Lista de componentes do orçamento.

### 10.2 PATCH/PUT /orcamentos/:id/componentes/:componenteId

#### Caso de Uso
- Atualizar informações de um componente do orçamento.

#### Regras de Negócio
- Permite atualização parcial dos campos do componente.
- Se componente ou orçamento não existir, retorna erro 404.

#### Resultado
- Componente do orçamento atualizado.

### 10.3 DELETE /orcamentos/:id/componentes/:componenteId

#### Caso de Uso
- Remover componente de um orçamento.

#### Regras de Negócio
- Se componente ou orçamento não existir, retorna erro 404.

#### Resultado
- Componente removido do orçamento.

## 11. Grupos

### 11.1 POST /grupos

#### Caso de Uso
- Criar novo grupo para organização de usuários ou permissões.

#### Regras de Negócio Envolvidas
- Campo obrigatório: nome (mínimo 3 caracteres).
- Nome deve ser único no sistema.
- Não permite campos além dos definidos no schema.
- Campo `ativo`: padrão true, pode ser informado.

#### Resultado Esperado
- Grupo criado com sucesso.
- Retorno do objeto grupo com `_id`, `nome`, `ativo` e `data_criacao`.
- Em caso de nome duplicado, retorna erro 409.
- Em caso de dados inválidos, retorna erro 400.

### 11.2 GET /grupos e /grupos/:id

#### Caso de Uso
- Listar grupos cadastrados ou obter grupo específico por id.

#### Regras de Negócio Envolvidas
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros disponíveis: nome, ativo.
- Se id não existir na busca específica, retorna erro 404.

#### Resultado Esperado
- Lista paginada de grupos ou grupo específico.
- Retorno com informações completas do grupo.
- Em caso de erro de validação, retorna erro 400.

### 11.3 PATCH/PUT /grupos/:id

#### Caso de Uso
- Atualizar informações de um grupo existente.

#### Regras de Negócio Envolvidas
- Permite atualização parcial dos campos.
- Nome deve continuar sendo único.
- Se grupo não existir, retorna erro 404.
- Não permite campos além dos definidos no schema.

#### Resultado Esperado
- Grupo atualizado com sucesso.
- Retorno do objeto grupo atualizado.
- Em caso de nome duplicado, retorna erro 409.
- Em caso de dados inválidos, retorna erro 400.

### 11.4 DELETE /grupos/:id

#### Caso de Uso
- Remover grupo do sistema.

#### Regras de Negócio Envolvidas
- Verificar se grupo não possui relacionamentos ativos.
- Se grupo não existir, retorna erro 404.
- Não permite exclusão se houver usuários vinculados.

#### Resultado Esperado
- Grupo removido com sucesso.
- Retorno de confirmação da exclusão.
- Em caso de relacionamentos ativos, retorna erro de integridade.

## 12. Rotas

### 12.1 POST /rotas

#### Caso de Uso
- Criar nova rota de acesso no sistema para controle de permissões.

#### Regras de Negócio Envolvidas
- Campo obrigatório: nome (mínimo 3 caracteres).
- Nome deve ser único no sistema.
- Não permite campos além dos definidos no schema.
- Campo `ativo`: padrão true, pode ser informado.

#### Resultado Esperado
- Rota criada com sucesso.
- Retorno do objeto rota com `_id`, `nome`, `ativo` e `data_criacao`.
- Em caso de nome duplicado, retorna erro 409.
- Em caso de dados inválidos, retorna erro 400.

### 12.2 GET /rotas e /rotas/:id

#### Caso de Uso
- Listar rotas cadastradas ou obter rota específica por id.

#### Regras de Negócio Envolvidas
- Paginação: parâmetros `page` e `limite` opcionais, limite máximo 100.
- Filtros disponíveis: nome, ativo.
- Se id não existir na busca específica, retorna erro 404.

#### Resultado Esperado
- Lista paginada de rotas ou rota específica.
- Retorno com informações completas da rota.
- Em caso de erro de validação, retorna erro 400.

### 12.3 PATCH/PUT /rotas/:id

#### Caso de Uso
- Atualizar informações de uma rota existente.

#### Regras de Negócio Envolvidas
- Permite atualização parcial dos campos.
- Nome deve continuar sendo único.
- Se rota não existir, retorna erro 404.
- Não permite campos além dos definidos no schema.

#### Resultado Esperado
- Rota atualizada com sucesso.
- Retorno do objeto rota atualizado.
- Em caso de nome duplicado, retorna erro 409.
- Em caso de dados inválidos, retorna erro 400.

### 12.4 DELETE /rotas/:id

#### Caso de Uso
- Remover rota do sistema.

#### Regras de Negócio Envolvidas
- Verificar se rota não possui relacionamentos ativos.
- Se rota não existir, retorna erro 404.
- Não permite exclusão se houver permissões vinculadas.

#### Resultado Esperado
- Rota removida com sucesso.
- Retorno de confirmação da exclusão.
- Em caso de relacionamentos ativos, retorna erro de integridade.

---

# Considerações Finais
- Segurança: Em todos os endpoints, a segurança deve ser uma prioridade, com a implementação de mecanismos de autenticação, autorização e registro de logs.
- Validação e Tratamento de Erros: É fundamental validar as entradas dos usuários e retornar mensagens de erro claras para auxiliar na resolução de problemas.
- Documentação e Monitoramento: Manter uma documentação atualizada dos endpoints e monitorar as requisições para garantir a integridade e disponibilidade do sistema.
