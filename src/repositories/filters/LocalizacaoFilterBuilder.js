import LocalizacaoModel from '../../models/Localizacao.js';
import LocalizacaoRepository from '../LocalizacaoRepository.js';

class LocalizacaoFilterBuilder {
    constructor() {
        this.filtros = {};
        this.localizacaoRepository = new LocalizacaoRepository();
        this.localizacaoModel = LocalizacaoModel;
    };

    comNome(nome) {
        if (nome) {
            this.filtros.nome = { $regex: nome, $options: 'i' };
        };
        return this;
    };

    build() {
        return this.filtros;
    };
};

export default LocalizacaoFilterBuilder;