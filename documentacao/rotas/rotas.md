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
- Criar um novo registro de usuário no sistema.

#### Regras de Negócio Envolvidas
- Validação de dados (todos obrigatórios):
   - Nome: Mínimo 3 caracteres.
   - E-mail: Formato válido, único no sistema.
   - Senha: Mínimo 8 caracteres, letras maiúsculas, letras minúsculas, números e caracteres especiais.
   - Ativo: true ou false
- Segurança:
   - Criptografar senha antes do armazenamento.

#### Resultado Esperado
- Registro de usuário criado com sucesso.
- Retorno do objeto de usuário criado com identificador único.
- Em caso de falha, retornar mensagem de erro específica.

### 2.2 GET /usuarios

#### Caso de Uso
- Recuperar uma lista completa de todos os usuários cadastrados no sistema.

#### Regras de Negócio
- Paginação: A resposta deve suportar paginação, permitindo limitar a quantidade de usuários retornados por solicitação.
- Filtragem: Permitir filtragem por atributos como nome, e-mail ou status do usuário.
- A senha dos usuários não devem ser retornadas.

#### Resultado
- Retorno de uma lista de usuários, incluindo informações básicas (nome, e-mail, status).
- Inclusão de informações adicionais como contagem total de usuários e dados da página atual.
- Em caso de falha, retornar mensagem de erro específica.

### 2.3 GET /usuarios/:id

#### Caso de Uso
- Obter informações detalhadas do perfil do usuário autenticado.

#### Regras de Negócio
- A senha do usuário não deve ser retornada.

#### Resultado
- Retorno de informações completas do perfil.
- Em caso de falha, retornar mensagem de erro específica.

### 2.4 PATCH/PUT /usuarios/:id

#### Caso de Uso
- Atualizar informações do perfil do usuário.

#### Regras de Negócio
- Apenas o nome e o status ativo (true/false) podem ser atualizados.
- Verificar a integridade apenas dos campos enviados.
- A senha não pode ser alterada através desta requisição.
- O e-mail é único e não pode ser alterado.

#### Resultado
- Atualização bem-sucedida de informações do perfil.
- Retorno apenas dos campos modificados.
- Em caso de falha, retornar mensagem de erro específica.

### 2.5 DELETE /usuarios/:id

#### Caso de Uso
- Desativar um usuário do sistema.

#### Regras de Negócio
- Desativação em vez de Exclusão:
   - Ao invés de excluir o usuário, a operação deverá alterar o campo ```ativo``` deve para ```false```.
- Preservação de Dados:
   - Manter todos os dados históricos do usuário, garantindo a integridade referencial em relação a outros dados no sistema.

#### Resultado
- Em caso de sucesso, retornar uma mensagem confirmando que o usuário foi desativado.
- Em caso de falha, retornar mensagem de erro específica.

## 3. Componentes

### 3.1 POST /componentes

#### Caso de Uso
- Adicionar um novo componente ao sistema.

#### Regras de Negócio
- Validação de Campos Obrigatórios:
   - Nome.
   - Código (único).
   - Quantidade.
   - Estoque mínimo.
   - Valor unitário.
   - Categoria.
   - Localização.
- Validações de Integridade:
   - Código não pode ser duplicado no sistema.
   - Quantidade não pode ser negativa.
   - Estoque mínimo não pode ser negativo.
   - Valor unitário deve ser positivo.

#### Resultado
- Componente criado com sucesso.
- Retorno do objeto criado.
- Em caso de falha, retornar mensagem de erro específica.

### 3.2 GET /componentes

#### Caso de Uso
- Listar todos os componentes eletrônicos cadastrados no sistema de estoque.

#### Regras de Negócio
- Retornar informações essenciais de cada componente.

#### Resultado
- Retorna lista dos componentes cadastrados e seus dados.
- Informações de estoque (quantidade, localização, status).
- Em caso de lista vazia, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

### 3.3 GET /componentes/:id

#### Caso de Uso
- Obter detalhes de um componente específico.

#### Regras de Negócio
- Confirmar se o componente existe no sistema.

#### Resultado
- Retorna os dados do componente.
- Em caso de nenhum componente encontrado, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

### 3.4 GET /componentes/filtros

#### Caso de Uso
- Realizar busca e filtragem avançada de componentes no sistema.

#### Parâmetros de Filtro
- categoria: Filtrar por categoria do componente.
- localizacao: Filtrar por localização física do componente.
- status: Filtrar por status de estoque.
   - em_estoque: Componentes com quantidade adequada.
   - baixo_estoque: Componentes com quantidade abaixo do mínimo.
   - indisponivel: Componentes com quantidade zero.

#### Regras de Negócio
- Validação de Parâmetros:
   - Garantir que os filtros sejam válidos
   - Permitir combinação de filtros

#### Exemplos de Uso
```bash
GET /componentes/filtros?categoria=microcontroladores  
GET /componentes/filtros?localizacao=B23  
GET /componentes/filtros?status=baixo_estoque  
GET /componentes/filtros?categoria=sensores&status=em_estoque  
```

#### Resultado
- Retorna a lista de componentes filtrados.
- Retorna o total de resultados encontrados.
- Em caso de nenhum componente encontrado com os filtros específicados, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

### 3.5 PATCH /componentes/:id

#### Caso de Uso
- Atualizar as informações de um componente existente no sistema.

#### Regras de Negócio
- Permitir atualização de um ou mais campos independentemente.
- Verificar a integridade apenas dos campos enviados.
- Código não pode ser duplicado no sistema (se foi atualizado).
- Quantidade não pode ser negativa.
- Estoque mínimo não pode ser negativo.
- Valor unitário deve ser positivo.

#### Resultado
- Componente atualizado com sucesso.
- Retorno do objeto atualizado.
- Em caso de falha, retornar mensagem de erro específica.

### 3.6 DELETE /componentes/:id

#### Caso de Uso
- Remover um componente do sistema.

#### Regras de Negócio
- Confirmar se o componente existe no sistema.

#### Resultado
- Componente excluído com sucesso.
- Em caso de componente não encontrado, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

## 4. Movimentações

### 4.1 POST /movimentacoes

#### Caso de Uso
- Registrar a movimentação de um componente (entrada ou saída).

#### Regras de Negócio
- Campos obrigatórios: ID do componente, tipo de movimentação (entrada ou saída), data/hora, quantidade e fornecedor (caso seja uma movimentação de entrada).

#### Resultado
- Registro de movimentação com sucesso.
- Em caso de falha, retornar mensagem de erro específica.

### 4.2 GET /movimentacoes

#### Caso de Uso
- Listar todas as movimentações de componentes, com a indicação de tipo (entrada ou saída).

#### Resultado
- Retorna todas as movimentações, mostrando tipo, componente, quantidade e data/hora.
- Em caso de falha, retornar mensagem de erro específica.

### 4.3 GET /movimentacoes/:id

#### Caso de Uso
- Obter detalhes de uma movimentação específica.

#### Resultado
- Retorna os detalhes da movimentação.

## 5. Notificações

### 5.1 POST /notificacao

#### Caso de Uso
- Criar uma nova notificação no sistema.

#### Regras de Negócio
- Validação de Campos Obrigatórios:
   - Mensagem da notificação.
   - Data e hora da notificação.
   - ID do usuário que receberá a notificação.

#### Resultado
- Notificação criada com sucesso.
- Retorno do objeto criado.
- Em caso de falha, retornar mensagem de erro específica.

### 5.2 GET /notificacao

#### Caso de Uso
- Listar todas as notificações de um usuário.

#### Regras de Negócio
- Retornar as notificações associadas ao ID do usuário.

#### Resultado
- Retorna lista de notificações.
- Em caso de lista vazia, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

### 5.3 GET /notificacao/:id

#### Caso de Uso
- Obter detalhes de uma notificação específica.

#### Regras de Negócio
- Confirmar se a notificação existe no sistema.

#### Resultado
- Retorna os dados da notificação.
- Em caso de notificação não encontrada, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

## 6. Orçamentos

### 6.1 POST /orcamento

#### Caso de Uso
- Criar um novo orçamento no sistema.

#### Regras de Negócio
- Validação de Campos Obrigatórios:
   - Nome do orçamento;
   - Protocolo;
   - Descrição;
   - Deve incluir pelo menos um componente associado.

#### Resultado
- Orçamento criado com sucesso.
- Retorno do objeto criado.
- Em caso de falha, retornar mensagem de erro específica.

### 6.2 GET /orcamento

#### Caso de Uso
- Listar todos os orçamentos existentes.

#### Resultado
- Retorna uma lista de orçamentos.
- Se não houver orçamentos, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

### 6.3 GET /orcamento/:id

#### Caso de Uso
- Obter detalhes de um orçamento específico.

#### Regras de Negócio
- Confirmar se o orçamento existe no sistema.

#### Resultado
- Retorna os dados do orçamento, incluindo lista de componentes associados.
- Se o orçamento não for encontrado, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

### 6.4 POST /orcamento/:id/componente

#### Caso de Uso
- Adicionar um componente a um orçamento específico.

#### Regras de Negócio
- Validação de Campos Obrigatórios:
   - ID do componente;
   - Quantidade;
   - Valor unitário.

#### Resultado
- Componente adicionado ao orçamento com sucesso.
- Retorno do objeto criado na tabela componente_orcamento.
- Se o orçamento não existir, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

### 6.5 DELETE /orcamento/:id/componente/:id

#### Caso de Uso
- Remover um componente de um orçamento específico.

#### Regras de Negócio
- Confirmar se a associação do componente ao orçamento existe.

#### Resultado
- Componente removido do orçamento com sucesso.
- Se o componente não for encontrado, retornar mensagem específica.
- Em caso de falha, retornar mensagem de erro específica.

## 7. Relatórios

### 7.1 GET /relatorios/componentes

#### Caso de Uso
- Gerar um relatório completo sobre os componentes.

#### Regras de Negócio
- O relatório deve incluir: código do componente, nome, quantidade, status, localização e fornecedor.
- O sistema deve gerar um arquivo PDF.

#### Resultado
- Retorna o arquivo PDF gerado do relatório de componentes.
- Em caso de falha, retornar mensagem de erro específica.

### 7.2 GET /relatorios/movimentacoes

#### Caso de Uso
- Gerar um relatório de movimentações de estoque.

#### Regras de Negócio
- O relatório deve incluir: código do componente, nome, quantidade, tipo de movimentação (entrada ou saída), localização e data/hora.
- O sistema deve gerar um arquivo PDF.

#### Resultado
- Retorna o arquivo PDF gerado do relatório de movimentações.
- Em caso de falha, retornar mensagem de erro específica.

### 7.3 GET /relatorios/orcamentos

#### Caso de Uso
- Gerar um relatório histórico de orçamentos.

#### Regras de Negócio
- O relatório deve incluir: protocolo, nome do orçamento, valor total e data.
- O sistema deve gerar um arquivo PDF.

#### Resultado
- Retorna o arquivo PDF gerado do relatório de orçamentos.
- Em caso de falha, retornar mensagem de erro específica.

# Considerações Finais
- Segurança: Em todos os endpoints, a segurança deve ser uma prioridade, com a implementação de mecanismos de autenticação, autorização e registro de logs.
- Validação e Tratamento de Erros: É fundamental validar as entradas dos usuários e retornar mensagens de erro claras para auxiliar na resolução de problemas.
- Documentação e Monitoramento: Manter uma documentação atualizada dos endpoints e monitorar as requisições para garantir a integridade e disponibilidade do sistema.
