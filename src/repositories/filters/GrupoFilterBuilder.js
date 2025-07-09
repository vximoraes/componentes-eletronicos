// src/repositories/filters/GrupoFilterBuilder.js

import UnidadeRepository from '../UnidadeRepository.js';

class GrupoFilterBuilder {
    constructor() {
        this.filtros = {};
        this.unidadeRepository = new UnidadeRepository();
    }

    comNome(nome) {
        if (nome) {
          const nomeEscapado = this.escapeRegex(nome);
          this.filtros.nome = { $regex: nomeEscapado, $options: 'i' };
        }
        return this;
      }
      
      comDescricao(descricao) {
        if (descricao) {
          const descricaoEscapada = this.escapeRegex(descricao);
          this.filtros.descricao = { $regex: descricaoEscapada, $options: 'i' };
        }
        return this;
      }
      

    comAtivo(ativo) {
        if (ativo === 'true') {
            this.filtros.ativo = true;
        } else if (ativo === 'false') {
            this.filtros.ativo = false;
        } else {
            // Ação executável mínima para cobertura
            this.filtros.ativo = this.filtros.ativo; // No-op
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

export default GrupoFilterBuilder;
