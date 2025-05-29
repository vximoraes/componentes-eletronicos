import LocalizacaoFilterBuilder from '../../../../repositories/filters/LocalizacaoFilterBuilder.js';

describe('LocalizacaoFilterBuilder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar filtro vazio por padrão', () => {
        const builder = new LocalizacaoFilterBuilder();
        expect(builder.build()).toEqual({});
    });

    it('deve adicionar filtro de nome corretamente', () => {
        const builder = new LocalizacaoFilterBuilder().comNome('Estoque');
        expect(builder.build()).toEqual({ nome: { $regex: 'Estoque', $options: 'i' } });
    });

    it('não deve adicionar filtro de nome se valor for vazio', () => {
        const builder = new LocalizacaoFilterBuilder().comNome('');
        expect(builder.build()).toEqual({});
    });

    it('deve permitir encadeamento de métodos', () => {
        const builder = new LocalizacaoFilterBuilder().comNome('Sala 1').comNome('Sala 2');
        expect(builder.build()).toEqual({ nome: { $regex: 'Sala 2', $options: 'i' } });
    });
});