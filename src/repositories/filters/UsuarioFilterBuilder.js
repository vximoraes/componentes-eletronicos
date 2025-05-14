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
        this.filtros = {};
        return this;
    }

    async comGrupo(grupo) {
        if (grupo) {
            // Não re-instancie o grupoRepository aqui.
            const gruposEncontrados = await this.grupoRepository.buscarPorNome(grupo);

            const grupoIds = gruposEncontrados
                ? Array.isArray(gruposEncontrados)
                    ? gruposEncontrados.map(g => g._id)
                    : [gruposEncontrados._id]
                : [];

            this.filtros.grupos = { $in: grupoIds };
        }
        return this;
    }

    async comUnidade(unidade) {
        if (unidade) {
            const unidadesEncontradas = await this.unidadeRepository.buscarPorNome(unidade);

            const unidadeIds = unidadesEncontradas
                ? Array.isArray(unidadesEncontradas)
                    ? unidadesEncontradas.map(u => u._id)
                    : [unidadesEncontradas._id]
                : [];

            this.filtros.unidades = { $in: unidadeIds };
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
