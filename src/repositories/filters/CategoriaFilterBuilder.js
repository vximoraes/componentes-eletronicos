import CategoriaModel from '../../models/Categoria.js';
import CategoriaRepository from '../CategoriaRepository.js';

class CategoriaFilterBuilder {
    constructor() {
        this.filtros = {};
        this.categoriaRepository = new CategoriaRepository();
        this.categoriaModel = CategoriaModel;
    };

    comNome(nome) {
        if (nome) {
            this.filtros.nome = { $regex: nome, $options: 'i' };
        }
        return this;
    };

    build() {
        return this.filtros;
    };
};

export default CategoriaFilterBuilder;