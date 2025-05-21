import UsuarioModel from '../../models/Usuario.js';
import UsuarioRepository from '../UsuarioRepository.js';

class UsuarioFilterBuilder {
    constructor() {
        this.filtros = {};
        this.usuarioRepository = new UsuarioRepository();
        this.usuarioModel = UsuarioModel;
    }

    comNome(nome) {
        if (nome) {
            this.filtros.nome = { $regex: nome, $options: 'i' };
        }
        return this;
    }

    comEmail(email) {
        if (email) {
            this.filtros.email = { $regex: email, $options: 'i' };
        }
        return this;
    }

    comAtivo(ativo = 'true') {
        if (ativo === 'true') {
            this.filtros.ativo = true;
        }
        if (ativo === 'false') {
            this.filtros.ativo = false;
        }
        return this;
    }

    escapeRegex(texto) {
        return texto.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    build() {
        return this.filtros;
    }
}

export default UsuarioFilterBuilder;