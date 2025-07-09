// src/repositories/utils/RotaFilterBuilder.js

class RotaFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comRota(rota) {
        if (rota) {
            this.filtros.rota = { $regex: rota, $options: 'i' }; // Filtro para rota usando regex (case-insensitive)
        }
        return this;
    }

    comDominio(dominio) {
        if (dominio) {
            this.filtros.dominio = { $regex: dominio, $options: 'i' }; // Filtro para domínio usando regex (case-insensitive)
        }
        return this;
    }

    comAtivo(ativo) {
        if (ativo === 'true') {
            this.filtros.ativo = true;
        } else if (ativo === 'false') {
            this.filtros.ativo = false;
        }
        return this;
    }


    comGet(buscar) {
        if (buscar === 'true') {
            this.filtros.buscar = true;
        } else if (buscar === 'false') {
            this.filtros.buscar = false;
        }
        return this;
    }

    comPost(enviar) {
        if (enviar === 'true') {
            this.filtros.enviar = true;
        } else if (enviar === 'false') {
            this.filtros.enviar = false;
        }
        return this;
    }

    comPut(substituir) {
        if (substituir === 'true') {
            this.filtros.substituir = true;
        } else if (substituir === 'false') {
            this.filtros.substituir = false;
        }
        return this;
    }

    comPatch(modificar) {
        if (modificar === 'true') {
            this.filtros.modificar = true;
        } else if (modificar === 'false') {
            this.filtros.modificar = false;
        }
        return this;
    }

    comDelete(excluir) { // 'delete' é uma palavra reservada, então usamos 'del'
        if (excluir === 'true') {
            this.filtros.excluir = true;
        } else if (excluir === 'false') {
            this.filtros.excluir = false;
        }
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default RotaFilterBuilder;
