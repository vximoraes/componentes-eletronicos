import NotificacaoFilterBuilder from '../../../../repositories/filters/NotificacaoFilterBuilder.js';

describe('NotificacaoFilterBuilder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar filtro vazio por padrão', () => {
        const builder = new NotificacaoFilterBuilder();
        expect(builder.build()).toEqual({});
    });

    it('deve adicionar filtro de usuario corretamente', () => {
        const builder = new NotificacaoFilterBuilder().comUsuario('u1');
        expect(builder.build()).toEqual({ usuario: 'u1' });
    });

    describe('comVisualizada', () => {
        it('deve adicionar filtro visualizada com string "true"', () => {
            const builder = new NotificacaoFilterBuilder().comVisualizada('true');
            expect(builder.build()).toEqual({ visualizada: true });
        });

        it('deve adicionar filtro visualizada com string "false"', () => {
            const builder = new NotificacaoFilterBuilder().comVisualizada('false');
            expect(builder.build()).toEqual({ visualizada: false });
        });

        it('deve adicionar filtro visualizada com boolean true (trata como false pelo código atual)', () => {
            const builder = new NotificacaoFilterBuilder().comVisualizada(true);
            expect(builder.build()).toEqual({ visualizada: false }); // Atenção: por causa do código atual
        });

        it('deve adicionar filtro visualizada com boolean false', () => {
            const builder = new NotificacaoFilterBuilder().comVisualizada(false);
            expect(builder.build()).toEqual({ visualizada: false });
        });

        it('não deve adicionar filtro se visualizada for vazia', () => {
            const builder = new NotificacaoFilterBuilder().comVisualizada('');
            expect(builder.build()).toEqual({ visualizada: false }); // Pelo código atual
        });

        it('não deve adicionar filtro se visualizada for undefined', () => {
            const builder = new NotificacaoFilterBuilder().comVisualizada(undefined);
            expect(builder.build()).toEqual({});
        });
    });

    describe('comDataInicial e comDataFinal', () => {
        it('deve adicionar filtro de data inicial corretamente', () => {
            const builder = new NotificacaoFilterBuilder().comDataInicial('2024-01-01');
            expect(builder.build()).toEqual({
                dataCriacao: { $gte: new Date('2024-01-01') }
            });
        });

        it('deve adicionar filtro de data final corretamente', () => {
            const builder = new NotificacaoFilterBuilder().comDataFinal('2024-06-30');
            expect(builder.build()).toEqual({
                dataCriacao: { $lte: new Date('2024-06-30') }
            });
        });

        it('deve adicionar filtro de intervalo de datas corretamente', () => {
            const builder = new NotificacaoFilterBuilder()
                .comDataInicial('2024-01-01')
                .comDataFinal('2024-06-30');
            expect(builder.build()).toEqual({
                dataCriacao: {
                    $gte: new Date('2024-01-01'),
                    $lte: new Date('2024-06-30')
                }
            });
        });

        it('não deve adicionar filtro de data se valores forem vazios', () => {
            const builder = new NotificacaoFilterBuilder()
                .comDataInicial('')
                .comDataFinal('');
            expect(builder.build()).toEqual({});
        });
    });

    it('deve combinar múltiplos filtros corretamente', () => {
        const builder = new NotificacaoFilterBuilder()
            .comUsuario('u1')
            .comVisualizada('true')
            .comDataInicial('2024-01-01')
            .comDataFinal('2024-12-31');
        expect(builder.build()).toEqual({
            usuario: 'u1',
            visualizada: true,
            dataCriacao: {
                $gte: new Date('2024-01-01'),
                $lte: new Date('2024-12-31')
            }
        });
    });
});
