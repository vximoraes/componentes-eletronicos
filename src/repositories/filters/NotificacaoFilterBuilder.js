import NotificacaoModel from '../../models/Notificacao.js';
import NotificacaoRepository from '../NotificacaoRepository.js';

class NotificacaoFilterBuilder {
    constructor() {
        this.filtros = {};
        this.notificacaoRepository = new NotificacaoRepository();
        this.notificacaoModel = NotificacaoModel;
    }

    comUsuario(usuarioId) {
        if (usuarioId) {
            this.filtros.usuario = usuarioId;
        }
        return this;
    }

    comDataInicial(dataInicial) {
        if (dataInicial) {
            if (!this.filtros.dataCriacao) this.filtros.dataCriacao = {};
            this.filtros.dataCriacao.$gte = new Date(dataInicial);
        }
        return this;
    }

    comDataFinal(dataFinal) {
        if (dataFinal) {
            if (!this.filtros.dataCriacao) this.filtros.dataCriacao = {};
            this.filtros.dataCriacao.$lte = new Date(dataFinal);
        }
        return this;
    }

    comLida(lida = 'true') {
        if (lida === 'true') {
            this.filtros.lida = true;
        } 
        if (lida === 'false') {
            this.filtros.lida = false;
        }
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default NotificacaoFilterBuilder;