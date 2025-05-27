import UsuarioFilterBuilder from '../../../../repositories/filters/UsuarioFilterBuilder.js';

describe('UsuarioFilterBuilder', () => {
    it('deve criar filtro vazio por padrão', () => {
        const builder = new UsuarioFilterBuilder();
        expect(builder.build()).toEqual({});
    });

    it('deve adicionar filtro de nome corretamente', () => {
        const builder = new UsuarioFilterBuilder().comNome('João');
        expect(builder.build()).toEqual({ nome: { $regex: 'João', $options: 'i' } });
    });

    it('deve adicionar filtro de email corretamente', () => {
        const builder = new UsuarioFilterBuilder().comEmail('teste@email.com');
        expect(builder.build()).toEqual({ email: { $regex: 'teste@email.com', $options: 'i' } });
    });

    it('deve adicionar filtro de ativo true', () => {
        const builder = new UsuarioFilterBuilder().comAtivo('true');
        expect(builder.build()).toEqual({ ativo: true });
    });

    it('deve adicionar filtro de ativo false', () => {
        const builder = new UsuarioFilterBuilder().comAtivo('false');
        expect(builder.build()).toEqual({ ativo: false });
    });

    it('deve combinar filtros de nome, email e ativo', () => {
        const builder = new UsuarioFilterBuilder()
            .comNome('Maria')
            .comEmail('maria@email.com')
            .comAtivo('true');
        expect(builder.build()).toEqual({
            nome: { $regex: 'Maria', $options: 'i' },
            email: { $regex: 'maria@email.com', $options: 'i' },
            ativo: true
        });
    });

    it('escapeRegex deve escapar caracteres especiais', () => {
        const builder = new UsuarioFilterBuilder();
        const texto = 'nome.*[teste]';
        expect(builder.escapeRegex(texto)).toBe('nome\\.\\*\\[teste\\]');
    });

    it('não deve adicionar filtro de nome/email se valor for vazio', () => {
        const builder = new UsuarioFilterBuilder().comNome('').comEmail('');
        expect(builder.build()).toEqual({});
    });
});