import FornecedorModel from '../../models/Fornecedor.js';
import FornecedorRepository from '../FornecedorRepository.js';

class FornecedorFilterBuilder {
    constructor() {
        this.filtros = {};
        this.fornecedorRepository = new FornecedorRepository();
        this.fornecedorModel = FornecedorModel;
    };

    comNome(nome) {
        if (nome !== undefined && nome !== null) {
            this.filtros.nome = { $regex: nome, $options: 'i' };
        };
        return this;
    };

    build() {
        return this.filtros;
    };
};

export default FornecedorFilterBuilder;