import messages from '../../../../utils/helpers/messages.js';

describe('Messages Helper', () => {
    describe('Informative Messages', () => {
        test('deve retornar mensagem de boas-vindas', () => {
            expect(messages.info.welcome).toBe("Bem-vindo à nossa aplicação!");
        });

        test('deve retornar mensagem de usuário logado', () => {
            const username = 'Gilberto';
            expect(messages.info.userLoggedIn(username)).toBe(`Usuário ${username} logado com sucesso.`);
        });
    });

    describe('Success Messages', () => {
        test('deve retornar mensagem de sucesso padrão', () => {
            expect(messages.success.default).toBe("Operação concluída com sucesso.");
        });
    });

    describe('Error Messages', () => {
        test('deve retornar mensagem de erro padrão', () => {
            expect(messages.error.default).toBe("Ocorreu um erro ao processar a solicitação.");
        });

        test('deve retornar mensagem de erro de servidor', () => {
            expect(messages.error.serverError()).toBe("Erro interno do servidor. Tente novamente mais tarde.");
        });

        test('deve retornar mensagem de erro de validação', () => {
            expect(messages.error.validationError()).toBe("Erro de validação. Verifique os dados fornecidos e tente novamente.");
        });

        test('deve retornar mensagem de requisição inválida', () => {
            expect(messages.error.invalidRequest).toBe("Requisição inválida. Verifique os parâmetros fornecidos.");
        });

        test('deve retornar mensagem de acesso não autorizado', () => {
            expect(messages.error.unauthorizedAccess).toBe("Acesso não autorizado. Faça login para continuar.");
        });

        test('deve retornar mensagem de URL inválida', () => {
            expect(messages.error.invalidURL).toBe("URL inválida. Verifique a URL fornecida.");
        });

        test('deve retornar mensagem de operação não suportada', () => {
            expect(messages.error.unsupportedOperation).toBe("Operação não suportada neste contexto.");
        });

        test('deve retornar mensagem de erro ao analisar os dados', () => {
            expect(messages.error.dataParsingError).toBe("Erro ao analisar os dados recebidos.");
        });

        test('deve retornar mensagem de erro ao comunicar com serviço externo', () => {
            expect(messages.error.externalServiceError).toBe("Erro ao se comunicar com um serviço externo.");
        });

        test('deve retornar mensagem de chave de API inválida', () => {
            expect(messages.error.invalidApiKey).toBe("Chave de API inválida.");
        });

        test('deve retornar mensagem de operação cancelada pelo usuário', () => {
            expect(messages.error.operationCanceled).toBe("Operação cancelada pelo usuário.");
        });

        test('deve retornar mensagem de recurso não encontrado', () => {
            const fieldName = 'Recurso';
            expect(messages.error.resourceNotFound(fieldName)).toBe(`${fieldName} não encontrado(a).`);
        });

        test('deve retornar mensagem de página não disponível', () => {
            const page = 'Página';
            expect(messages.error.pageIsNotAvailable(page)).toBe(`A página ${page} não está disponível.`);
        });

        test('deve retornar mensagem de página sem dados', () => {
            const page = 'Página';
            expect(messages.error.pageNotContainsData(page)).toBe(`A página ${page} não contém dados.`);
        });

        test('deve retornar mensagem de entrada duplicada', () => {
            const fieldName = 'Campo';
            expect(messages.error.duplicateEntry(fieldName)).toBe(`Já existe um registro com o dado informado no(s) campo(s) ${fieldName}.`);
        });

        test('deve retornar mensagem de recurso em uso', () => {
            const fieldName = 'Recurso';
            expect(messages.error.resourceInUse(fieldName)).toBe(`Recurso em uso em ${fieldName}.`);
        });

        test('deve retornar mensagem de erro interno do servidor', () => {
            expect(messages.error.internalServerError()).toMatch(/servidor/i);
        });

        test('deve retornar mensagem de erro de validação', () => {
            expect(messages.error.validationError()).toMatch(/validação/i);
        });

        test('deve retornar mensagem de acesso não autorizado', () => {
            expect(messages.error.unauthorized()).toMatch(/não autorizado/i);
        });

        test('deve retornar mensagem de requisição inválida', () => {
            expect(messages.error.badRequest('Campo')).toMatch(/Campo/);
        });

        test('deve retornar mensagem de recurso não encontrado', () => {
            expect(messages.error.resourceNotFound('Categoria')).toMatch(/Categoria/);
        });

        test('deve retornar mensagem de erro de servidor', () => {
            expect(messages.error.serverError()).toMatch(/servidor/i);
        });

        test('deve retornar mensagem de permissão negada', () => {
            expect(messages.error.forbidden('Ação')).toMatch(/Ação/);
        });

        test('deve retornar mensagem de entrada duplicada', () => {
            expect(messages.error.duplicateEntry('Campo')).toMatch(/Campo/);
        });

        test('deve retornar mensagem de erro de servidor com recurso', () => {
            expect(messages.error.serverError('Usuário')).toBe('Erro interno do servidor ao processar Usuário.');
        });

        test('deve retornar mensagem de erro de validação com campo', () => {
            expect(messages.error.validationError('email')).toBe('Erro de validação no campo email.');
        });

        test('deve retornar mensagem de erro de permissão', () => {
            const fieldName = 'Usuário';
            expect(messages.error.permissionError(fieldName)).toBe(`Erro de permissão em ${fieldName}.`);
        });

        test('deve retornar mensagem de conflito de recurso', () => {
            const resource = 'Usuário';
            const conflictField = 'email';
            expect(messages.error.resourceConflict(resource, conflictField)).toBe(`Conflito de recurso em ${resource} contém ${conflictField}.`);
        });

        test('deve retornar mensagem de erro de autenticação', () => {
            const fieldName = 'Usuário';
            expect(messages.error.authenticationError(fieldName)).toBe(`Erro de autenticação em ${fieldName}.`);
        });

        test('deve retornar mensagem de acesso não autorizado com e sem recurso', () => {
            expect(messages.error.unauthorized('Usuário')).toBe('Acesso não autorizado: Usuário.');
            expect(messages.error.unauthorized()).toBe('Acesso não autorizado. Faça login para continuar.');
        });
        
        test('deve retornar mensagem de permissão negada com e sem ação', () => {
            expect(messages.error.forbidden('exclusão')).toBe('Permissão negada para exclusão.');
            expect(messages.error.forbidden()).toBe('Permissão negada.');
        });

        test('deve retornar mensagem de badRequest com e sem campo', () => {
            expect(messages.error.badRequest('campoTeste')).toBe('Requisição inválida: campoTeste');
            expect(messages.error.badRequest()).toBe('Requisição inválida. Verifique os parâmetros fornecidos.');
        });
    });

    describe('Validation Messages', () => {
        test('deve retornar mensagem de campo obrigatório', () => {
            const fieldName = 'Campo';
            expect(messages.validation.generic.fieldIsRequired(fieldName)).toBe(`O campo ${fieldName} é obrigatório.`);
        });

        test('deve retornar mensagem de campo repetido', () => {
            const fieldName = 'Campo';
            expect(messages.validation.generic.fieldIsRepeated(fieldName)).toBe(`O campo ${fieldName} informado já está cadastrado.`);
        });

        test('deve retornar mensagem de formato de entrada inválido', () => {
            const fieldName = 'Campo';
            expect(messages.validation.generic.invalidInputFormat(fieldName)).toBe(`Formato de entrada inválido para o campo ${fieldName}.`);
        });

        test('deve retornar mensagem de valor inválido', () => {
            const fieldName = 'Campo';
            expect(messages.validation.generic.invalid(fieldName)).toBe(`Valor informado em ${fieldName} é inválido.`);
        });

        test('deve retornar mensagem de valor não encontrado', () => {
            const fieldName = 'Campo';
            expect(messages.validation.generic.notFound(fieldName)).toBe(`Valor informado para o campo ${fieldName} não foi encontrado.`);
        });

        test('deve retornar mensagem de valor deve ser um dos especificados', () => {
            const fieldName = 'Campo';
            const values = ['Valor1', 'Valor2'];
            expect(messages.validation.generic.mustBeOneOf(fieldName, values)).toBe(`O campo ${fieldName} deve ser um dos seguintes valores: ${values.join(", ")}.`);
        });

        test('deve retornar mensagem de recurso criado com sucesso', () => {
            const fieldName = 'Recurso';
            expect(messages.validation.generic.resourceCreated(fieldName)).toBe(`${fieldName} criado(a) com sucesso.`);
        });

        test('deve retornar mensagem de recurso atualizado com sucesso', () => {
            const fieldName = 'Recurso';
            expect(messages.validation.generic.resourceUpdated(fieldName)).toBe(`${fieldName} atualizado(a) com sucesso.`);
        });

        test('deve retornar mensagem de recurso excluído com sucesso', () => {
            const fieldName = 'Recurso';
            expect(messages.validation.generic.resourceDeleted(fieldName)).toBe(`${fieldName} excluído(a) com sucesso.`);
        });

        test('deve retornar mensagem de recurso já existente', () => {
            const fieldName = 'Recurso';
            expect(messages.validation.generic.resourceAlreadyExists(fieldName)).toBe(`${fieldName} já existe.`);
        });

        test('deve retornar mensagem de recurso com referência', () => {
            const resource = 'Recurso';
            const reference = 'Referência';
            expect(messages.validation.reference.resourceWithReference(resource, reference)).toBe(`${resource} com referência em ${reference}. Exclusão impedida.`);
        });

        test('deve retornar mensagem de CPF inválido', () => {
            expect(messages.validation.custom.invalidCPF.message).toBe("CPF inválido. Verifique o formato e tente novamente.");
        });

        test('deve retornar mensagem de CNPJ inválido', () => {
            expect(messages.validation.custom.invalidCNPJ.message).toBe("CNPJ inválido. Verifique o formato e tente novamente.");
        });

        test('deve retornar mensagem de CEP inválido', () => {
            expect(messages.validation.custom.invalidCEP.message).toBe("CEP inválido. Verifique o formato e tente novamente.");
        });

        test('deve retornar mensagem de número de telefone inválido', () => {
            expect(messages.validation.custom.invalidPhoneNumber.message).toBe("Número de telefone inválido. Verifique o formato e tente novamente.");
        });

        test('deve retornar mensagem de email inválido', () => {
            expect(messages.validation.custom.invalidMail.message).toBe("Email no formato inválido.");
        });

        test('deve retornar mensagem de ano inválido', () => {
            expect(messages.validation.custom.invalidYear.message).toBe("Ano inválido. Verifique o formato e tente novamente.");
        });

        test('deve retornar mensagem de data inválida', () => {
            expect(messages.validation.custom.invalidDate.message).toBe("Data inválida. Verifique o formato e tente novamente.");
        });

        test('deve retornar mensagem de quilometragem inicial inválida', () => {
            expect(messages.validation.custom.invalidKilometerInitial.message).toBe("Quilometragem inicial inválida.");
        });

        test('deve retornar mensagem de quilometragem inválida', () => {
            expect(messages.validation.custom.invalidKilometer.message).toBe("Quilometragem inválida.");
        });

        test('deve retornar mensagem de data de início inválida (passada)', () => {
            expect(messages.validation.custom.invalidDatePast.message).toBe("Data do início deve ser uma data atual ou futura.");
        });

        test('deve retornar mensagem de data de conclusão inválida (futura)', () => {
            expect(messages.validation.custom.invalidDateFuture.message).toBe("A data de conclusão deve ser maior do que a data de início!");
        });

        test('deve retornar mensagem de data de início inválida (atual ou passada)', () => {
            expect(messages.validation.custom.invalidDateCurrent.message).toBe("Data do início deve ser uma data atual ou passada.");
        });

        test('deve retornar mensagem de vigência com período maior que 12 meses', () => {
            expect(messages.validation.custom.invalidDateMonths.message).toBe("A data final da vigência não pode ser um período maior que 12 meses após a data de início da vigência.");
        });

        test('deve retornar mensagem de data de nascimento inválida', () => {
            expect(messages.validation.custom.invalidDataNascimento.message).toBe("Data de nascimento deve ser uma data passada e maior que 18 anos.");
        });

        test('deve retornar mensagem de data de admissão inválida', () => {
            expect(messages.validation.custom.invalidDataAdmissao.message).toBe("Data de admissão deve ser uma data atual ou passada.");
        });

        test('deve retornar mensagem de ano/semestre inválido', () => {
            expect(messages.validation.custom.invalidYearSemester.message).toBe("Ano/semestre. Verifique o formato e tente novamente.");
        });

        test('deve retornar mensagem de data de início do semestre inválida', () => {
            expect(messages.validation.custom.invalidYearStartSemester.message).toBe("Data do início do semestre deve ser menor que a data fim de semestre.");
        });
    });

    describe('Authentication Messages', () => {
        test('deve retornar mensagem de falha na autenticação', () => {
            expect(messages.auth.authenticationFailed).toBe("Falha na autenticação. Credenciais inválidas.");
        });

        test('deve retornar mensagem de usuário não encontrado', () => {
            const userId = '123';
            expect(messages.auth.userNotFound(userId)).toBe(`Usuário com ID ${userId} não encontrado.`);
        });

        test('deve retornar mensagem de permissão insuficiente', () => {
            expect(messages.auth.invalidPermission).toBe("Permissão insuficiente para executar a operação.");
        });

        test('deve retornar mensagem de entrada duplicada', () => {
            const fieldName = 'Campo';
            expect(messages.auth.duplicateEntry(fieldName)).toBe(`Já existe um registro com o mesmo ${fieldName}.`);
        });

        test('deve retornar mensagem de conta bloqueada', () => {
            expect(messages.auth.accountLocked).toBe("Conta bloqueada. Entre em contato com o suporte.");
        });

        test('deve retornar mensagem de token inválido', () => {
            expect(messages.auth.invalidToken).toBe("Token inválido. Faça login novamente.");
        });

        test('deve retornar mensagem de tempo de espera excedido', () => {
            expect(messages.auth.timeoutError).toBe("Tempo de espera excedido. Tente novamente mais tarde.");
        });

        test('deve retornar mensagem de erro de conexão com o banco de dados', () => {
            expect(messages.auth.databaseConnectionError).toBe("Erro de conexão com o banco de dados. Tente novamente mais tarde.");
        });

        test('deve retornar mensagem de email já existente', () => {
            const email = 'email@example.com';
            expect(messages.auth.emailAlreadyExists(email)).toBe(`O endereço de email ${email} já está em uso.`);
        });

        test('deve retornar mensagem de credenciais inválidas', () => {
            expect(messages.auth.invalidCredentials).toBe("Credenciais inválidas. Verifique seu usuário e senha.");
        });
    });
});
