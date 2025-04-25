# Documento de Rotas - Sistema de Gestão de Componentes Eletrônicos

| **Endpoint**                          | **Método** | **Caso de Uso**                                            | **Descrição**                                                         |  
|---------------------------------------|------------|-----------------------------------------------------------|----------------------------------------------------------------------|  
| [/auth/register](#11-post-authregister)                        | POST       | Cadastro de Usuário                                       | Cria um novo registro de usuário no sistema.                        |  
| [/auth/login](#12-post-authlogin)                           | POST       | Login de Usuário                                          | Realiza a autenticação do usuário.                                   |  
| [/usuario/:id](#21-get-usuarioid)                          | GET        | Obter Perfil de Usuário                                   | Obtém informações detalhadas do perfil do usuário autenticado.      |  
| [/usuario/:id](#22-patch-usuarioid)                          | PATCH      | Atualizar Perfil de Usuário                               | Atualiza informações do perfil do usuário autenticado.              |  
| [/componentes](#31-post-componentes)                          | POST       | Adicionar Componente                                      | Adiciona um novo componente ao sistema.                             |  
| [/componentes](#32-get-componentes)                          | GET        | Listar Componentes                                        | Lista todos os componentes eletrônicos cadastrados.                 |  
| [/componentes/:id](#33-get-componentesid)                      | GET        | Obter Detalhes de Componente                              | Obtém detalhes de um componente específico.                         |  
| [/componentes/filtros](#34-get-componentesfiltros)                 | GET        | Filtragem Avançada de Componentes                        | Realiza busca e filtragem de componentes com parâmetros específicos. |  
| [/componentes/:id](#35-patch-componentesid)                      | PATCH      | Atualizar Componente                                      | Atualiza as informações de um componente existente no sistema.      |  
| [/componentes/:id](#36-delete-componentesid)                      | DELETE     | Remover Componente                                        | Remove um componente do sistema.                                    |  
| [/movimentacoes](#41-post-movimentacoes)                        | POST       | Registrar Movimentação                                    | Registra a movimentação de um componente (entrada ou saída).       |  
| [/movimentacoes](#42-get-movimentacoes)                        | GET        | Listar Movimentações                                      | Lista todas as movimentações de componentes.                        |  
| [/movimentacoes/:id](#43-get-movimentacoesid)                    | GET        | Obter Detalhes de Movimentação                            | Obtém detalhes de uma movimentação específica.                      |  
| [/notificacao](#51-post-notificacao)                          | POST       | Criar Notificação                                         | Cria uma nova notificação no sistema.                               |  
| [/notificacao](#52-get-notificacao)                          | GET        | Listar Notificações                                       | Lista todas as notificações de um usuário.                          |  
| [/notificacao/:id](#53-get-notificacaoid)                      | GET        | Obter Detalhes de Notificação                             | Obtém detalhes de uma notificação específica.                       |  
| [/orcamento](#61-post-orcamento)                            | POST       | Criar Orçamento                                          | Cria um novo orçamento no sistema.                                  |  
| [/orcamento](#62-get-orcamento)                            | GET        | Listar Orçamentos                                        | Lista todos os orçamentos existentes.                               |  
| [/orcamento/:id](#63-get-orcamentoid)                        | GET        | Obter Detalhes de Orçamento                               | Obtém detalhes de um orçamento específico.                          |  
| [/orcamento/:id/componente](#64-post-orcamentoidcomponente)            | POST       | Adicionar Componente a Orçamento                          | Adiciona um componente a um orçamento específico.                  |  
| [/orcamento/:id/componente/:id](#65-delete-orcamentoidcomponenteid)        | DELETE     | Remover Componente de Orçamento                           | Remove um componente de um orçamento específico.                   |  
| [/relatorios/componentes](#71-get-relatorioscomponentes)               | GET        | Relatório de Componentes                                  | Gera um relatório completo sobre os componentes.                    |  
| [/relatorios/movimentacoes](#72-get-relatoriosmovimentacoes)             | GET        | Relatório de Movimentações                                | Gera um relatório de movimentações de estoque.                      |  
| [/relatorios/orcamentos](#73-get-relatoriosorcamentos)                | GET        | Relatório de Orçamentos                                   | Gera um relatório histórico de orçamentos.                          |  

## 1. Cadastro e Login de Usuário

### 1.1 POST /auth/register

#### Caso de Uso
- Criar um novo registro de usuário no sistema.

#### Regras de Negócio Envolvidas
- Validação de dados (todos obrigatórios):
   - Nome: Mínimo 3 caracteres.
   - E-mail: Formato válido, único no sistema.
   - Senha: Mínimo 8 caracteres, letras maiúsculas, letras minúsculas, números, caracteres especiais.
   - Confirmação de senha deve ser idêntica.
- Segurança:
   - Criptografar senha antes do armazenamento.

#### Resultado Esperado
- Registro de usuário criado com sucesso.
- Retorno do objeto de usuário criado com identificador único.
- Em caso de falha, retornar mensagem de erro específica.

### 1.2 POST /auth/login

#### Caso de Uso
- Realizar autenticação de usuário no sistema, permitindo o acesso às funcionalidades internas.

#### Regras de Negócio Envolvidas
- Validação de Credenciais: Verificar se o e-mail e senha correspondem a um usuário cadastrado
  
#### Resultado Esperado
- Geração de token de autenticação para acesso ao sistema.
- Retorno do objeto de usuário.
- Em caso de falha, retornar mensagem de erro específica.

## 2. Perfil de Usuário

### 2.1 GET /usuario/:id

#### Caso de Uso
- Obter informações detalhadas do perfil do usuário autenticado.

#### Regras de Negócio
- Validação de Atributos: Recuperar apenas dados do usuário logado.
- Segurança: Acesso restrito ao próprio usuário.

#### Resultado
- Retorno de informações completas do perfil.
- Inclusão de estatísticas de uso.
- Em caso de falha, retornar mensagem de erro específica.

### 2.2 PATCH /usuario/:id

#### Caso de Uso
- Atualizar informações do perfil do usuário autenticado.

#### Regras de Negócio
- Permitir atualização de um ou mais campos independentemente.
- Verificar a integridade apenas dos campos enviados.
- Garantir unicidade e formato de e-mail válido, se alterado.

#### Resultado
- Atualização bem-sucedida de informações do perfil.
- Retorno apenas dos campos modificados.
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
   - Fornecedor.
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
- Campos obrigatórios: ID do componente, tipo de movimentação (entrada ou saída), data/hora, quantidade.
Resultado

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
