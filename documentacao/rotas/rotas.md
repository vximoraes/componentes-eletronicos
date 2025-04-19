# Endpoints com Foco em Casos de Uso

## 3.1 /login (ou endpoint de autenticação)

### Função de Negócio
- Permitir que os usuários (ou sistemas externos) entrem no sistema e obtenham acesso às funcionalidades internas.

### Regras de Negócio Envolvidas

- **Verificação de Credenciais:** Validar login/senha ou outro método de autenticação.
- Bloqueio de Usuários:** Impedir o acesso de usuários inativos ou sem autorização específica.
- Gestão de Tokens:** Gerar e armazenar tokens de acesso e refresh (se aplicável) de forma segura, permitindo revogação futura.

### Resultado Esperado
- Retorno dos tokens de acesso e refresh (se aplicável).
- Dados básicos do usuário, como nome, status (ativo/inativo) e outras informações relevantes ao contexto de negócio.

## 3.2 / (CRUD Principal)

Endpoints principais responsáveis pelas operações de CRUD (Create, Read, Update, Delete) do recurso central do sistema, que pode ser, por exemplo, /usuarios, /produtos ou /contratos.

## 3.2.1 POST /

**Caso de Uso**
- Criar um novo registro (ex.: novo usuário, produto, item, etc.).

**Regras de Negócio**
- **Validação de Atributos Obrigatórios:** Garantir que dados essenciais (ex.: e-mail, nome, código interno) sejam fornecidos.
- **Exclusividade de Campos:** Assegurar que campos únicos, como o e-mail, não sejam duplicados.
- **Definição de Status Inicial:** Atribuir um status inicial (ex.: ativo, pendente) conforme o fluxo de negócio.

**Resultado**
- Registro criado com sucesso, retornando o objeto criado ou seu identificador.
- Em caso de falha, retorno de erro de validação (por exemplo, e-mail duplicado).

## 3.2.2 GET /

**Caso de Uso**
- Listar todos os registros existentes, possibilitando a geração de relatórios ou uma visão geral dos dados.

**Regras de Negócio**
- **Filtros e Paginação:** Implementar filtros e paginação para evitar sobrecarga em consultas volumosas.
- **Políticas de Acesso:** Respeitar restrições de visualização de acordo com o perfil do usuário.
- **Filtros Específicos:** Permitir filtragem por atributos como nome, status, data, entre outros, conforme as necessidades de cada área.

**Resultado**
- Lista dos registros conforme os filtros aplicados.
- Metadados de paginação, como total de páginas e total de registros.

## 3.2.3 GET //:id

**Caso de Uso**
- Obter detalhes de um registro específico para exibição em painéis, relatórios ou interfaces administrativas.

**Regras de Negócio**
- **Validação de Existência:** Confirmar se o registro existe e seu status (ativo/inativo).
- **Retorno de Relacionamentos:** Opcionalmente, incluir estatísticas ou dados relacionados (ex.: quantas unidades ou grupos estão vinculados).
- **Controle de Permissão:** Assegurar que apenas usuários autorizados possam acessar dados sensíveis.

**Resultado**
- Detalhamento completo do registro (campos principais, relacionamentos, permissões).
- Retorno de erro se o registro não for encontrado ou o acesso não for permitido.

## 3.2.4 PATCH/PUT //:id

**Caso de Uso**
- Atualizar informações de um registro (ex.: status, atributos de cadastro, permissões, etc.).

**Regras de Negócio**
- **Exclusividade de Campos:** Manter a unicidade de campos (ex.: e-mail).
- **Ações Imediatas em Alterações Críticas:** Caso o registro seja marcado como inativo, remover ou limitar o acesso imediatamente.
- **Validação de Restrições:** Impedir alterações que violem regras de negócio (ex.: mudança de campos não permitidos após a criação).

**Resultado**
- Registro atualizado com as novas informações.
- Mensagem de erro se houver violação de regras (por exemplo, duplicidade de e-mail).

## 3.2.5 DELETE //:id

**Caso de Uso**
- Excluir ou inativar um registro que não será mais utilizado (ex.: usuário desligado, produto descontinuado).

**Regras de Negócio**
- **Verificação de Impedimentos:** Avaliar impedimentos como regras de compliance ou auditoria; muitas vezes, é preferível apenas inativar o registro.
- **Registro de Logs:** Disparar logs ou notificações para manter um histórico de alterações.
- **Respeito aos Relacionamentos:** Garantir que a exclusão não viole vínculos críticos (ex.: pedidos vinculados).

**Resultado**
- Registro excluído ou inativado conforme a política definida.
- Emissão de logs ou eventos para sistemas de auditoria, se aplicável.

## 3.3 Endpoints Adicionais (Exemplos)
Dependendo da complexidade do sistema, podem existir endpoints extras para funcionalidades específicas.

## 3.3.1 POST //:id/foto

**Caso de Uso**
- Atualizar a foto de perfil ou outro arquivo relacionado ao registro (ex.: foto de usuário, imagem de produto).

**Regras de Negócio**
- **Validação de Formato e Dimensões:** Verificar se a imagem atende aos requisitos (ex.: formato JPEG, dimensões mínimas ou máximas como 400x400).
- **Substituição de Arquivo:** Caso exista um arquivo anterior, substituí-lo ou manter uma versão histórica, conforme a política definida.
- **Registro de Metadata:** Armazenar informações como data e hora do upload, associando-as ao registro correspondente.

**Resultado**
- Foto/arquivo atualizado com sucesso.
- Retorno de erro em caso de formato inválido ou dimensões que não atendam aos critérios estabelecidos.

## 3.3.2 GET //:id/foto

**Caso de Uso**
- Exibir a foto ou arquivo associado a um registro para ser utilizado em painéis, aplicativos móveis ou relatórios.

**Regras de Negócio**
- **Verificação de Existência:** Confirmar se o arquivo existe; caso contrário, retornar uma imagem padrão ou uma mensagem de erro.
- **Controle de Acesso:** Assegurar que apenas usuários com as devidas permissões possam visualizar o arquivo.
- **Otimização do Download:** Limitar o tamanho do download ou converter a imagem para um formato adequado à exibição.

**Resultado**
- Retorno do arquivo em formato binário ou de um link direto para visualização.
- Mensagem de erro se o arquivo não existir ou se o acesso estiver negado.

## Considerações Finais
- **Segurança:** Em todos os endpoints, a segurança deve ser uma prioridade, com a implementação de mecanismos de autenticação, autorização e registro de logs.
- **Validação e Tratamento de Erros:** É fundamental validar as entradas dos usuários e retornar mensagens de erro claras para auxiliar na resolução de problemas.
- **Escalabilidade e Performance:** Considerar a aplicação de filtros, paginação e caching para otimizar o desempenho das consultas e operações.
- **Documentação e Monitoramento:** Manter uma documentação atualizada dos endpoints e monitorar as requisições para garantir a integridade e disponibilidade do sistema.
