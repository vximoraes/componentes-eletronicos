import OrcamentoFilterBuilder from '../../../../repositories/filters/OrcamentoFilterBuilder.js';

describe('OrcamentoFilterBuilder', () => {
    it('build deve retornar objeto vazio por padrão', () => {
        const builder = new OrcamentoFilterBuilder();
        expect(builder.build()).toEqual({});
    });

    it('comNome adiciona filtro regex de nome', () => {
        const builder = new OrcamentoFilterBuilder();
        builder.comNome('Teste');
        expect(builder.build()).toEqual({ nome: { $regex: 'Teste', $options: 'i' } });
    });

    it('comProtocolo adiciona filtro regex de protocolo', () => {
        const builder = new OrcamentoFilterBuilder();
        builder.comProtocolo('ABC123');
        expect(builder.build()).toEqual({ protocolo: { $regex: 'ABC123', $options: 'i' } });
    });

    it('comNome e comProtocolo juntos', () => {
        const builder = new OrcamentoFilterBuilder();
        builder.comNome('A').comProtocolo('B');
        expect(builder.build()).toEqual({ nome: { $regex: 'A', $options: 'i' }, protocolo: { $regex: 'B', $options: 'i' } });
    });

    it('ignora filtros se valores falsy', () => {
        const builder = new OrcamentoFilterBuilder();
        builder.comNome('').comProtocolo(null);
        expect(builder.build()).toEqual({});
    });
});