import { UsuarioSchema, UsuarioUpdateSchema } from '../../../../../../utils/validators/schemas/zod/UsuarioSchema.js';

describe('UsuarioSchema', () => {
    it('deve validar dados válidos corretamente', () => {
        const dadosValidos = {
            nome: 'João Silva',
            email: 'joao@email.com',
            senha: 'Senha@123',
            ativo: false,
        };
        const resultado = UsuarioSchema.parse(dadosValidos);
        expect(resultado).toEqual(dadosValidos);
    });

    it('deve aplicar valor padrão para "ativo" quando não fornecido', () => {
        const dadosValidos = {
            nome: 'Maria',
            email: 'maria@email.com',
            senha: 'Senha@123',
        };
        const resultado = UsuarioSchema.parse(dadosValidos);
        expect(resultado.ativo).toBe(true);
    });

    it('deve lançar erro quando "nome" está ausente', () => {
        const dadosInvalidos = {
            email: 'joao@email.com',
            senha: 'Senha@123',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/Required/);
    });

    it('deve lançar erro quando "nome" está vazio', () => {
        const dadosInvalidos = {
            nome: '',
            email: 'joao@email.com',
            senha: 'Senha@123',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/obrigat/);
    });

    it('deve lançar erro quando "email" está ausente', () => {
        const dadosInvalidos = {
            nome: 'João',
            senha: 'Senha@123',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/Required/);
    });

    it('deve lançar erro quando "email" está vazio', () => {
        const dadosInvalidos = {
            nome: 'João',
            email: '',
            senha: 'Senha@123',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/obrigat/);
    });

    it('deve lançar erro quando "email" é inválido', () => {
        const dadosInvalidos = {
            nome: 'João',
            email: 'joaoemail.com',
            senha: 'Senha@123',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/email.*inválido/);
    });

    it('deve lançar erro quando "senha" é muito curta', () => {
        const dadosInvalidos = {
            nome: 'João',
            email: 'joao@email.com',
            senha: 'S@1a',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/senha.*8 caracteres/);
    });

    it('deve lançar erro quando "senha" não atende à complexidade', () => {
        const dadosInvalidos = {
            nome: 'João',
            email: 'joao@email.com',
            senha: 'senhasimples',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/senha.*maiúscula.*minúscula.*número.*especial/);
    });

    it('deve lançar erro quando "senha" está vazia', () => {
        const dadosInvalidos = {
            nome: 'João',
            email: 'joao@email.com',
            senha: '',
            ativo: true,
        };
        expect(() => UsuarioSchema.parse(dadosInvalidos)).toThrow(/8 caracteres/);
    });
});

describe('UsuarioUpdateSchema', () => {
    it('deve validar dados parciais corretamente', () => {
        const dadosParciais = { nome: 'Novo Nome' };
        const resultado = UsuarioUpdateSchema.parse(dadosParciais);
        expect(resultado.nome).toBe('Novo Nome');
        expect(resultado.senha).toBeUndefined();
        expect(resultado.ativo).toBeUndefined();
    });

    it('deve aceitar objeto vazio e manter campos indefinidos', () => {
        const resultado = UsuarioUpdateSchema.parse({});
        expect(resultado.nome).toBeUndefined();
        expect(resultado.senha).toBeUndefined();
        expect(resultado.ativo).toBeUndefined();
    });

    it('deve lançar erro quando "senha" é muito curta', () => {
        const dadosInvalidos = { senha: 'S@1a' };
        expect(() => UsuarioUpdateSchema.parse(dadosInvalidos)).toThrow(/senha.*8 caracteres/);
    });

    it('deve lançar erro quando "senha" não atende à complexidade', () => {
        const dadosInvalidos = { senha: 'senhasimples' };
        expect(() => UsuarioUpdateSchema.parse(dadosInvalidos)).toThrow(/senha.*maiúscula.*minúscula.*número.*especial/);
    });

    it('deve lançar erro quando "senha" está vazia', () => {
        const dadosInvalidos = { senha: '' };
        expect(() => UsuarioUpdateSchema.parse(dadosInvalidos)).toThrow(/8 caracteres/);
    });
});