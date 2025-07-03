import nodemon from 'nodemon';
import NotificacaoModel from '../../models/Notificacao.js';
import NotificacaoRepository from '../NotificacaoRepository.js';
import Fornecedor from '../../models/Fornecedor.js';

class NotificacaoFilterBuilder {
    constructor() {
        this.filtros = {};
        this.notificacaoRepository = new NotificacaoRepository();
        this.notificacaoModel = NotificacaoModel;
    };

    comUsuario(usuarioId) {
        if (usuarioId) {
            this.filtros.usuario = usuarioId;
        };
        return this;
    };

    comDataInicial(dataInicial) {
        if (dataInicial) {
            if (!this.filtros.dataCriacao) this.filtros.dataCriacao = {};
            this.filtros.dataCriacao.$gte = new Date(dataInicial);
        };
        return this;
    };

    comDataFinal(dataFinal) {
        if (dataFinal) {
            if (!this.filtros.dataCriacao) this.filtros.dataCriacao = {};
            this.filtros.dataCriacao.$lte = new Date(dataFinal);
        };
        return this;
    };

    comVisualizada(visualizada) {
        if (visualizada !== undefined) {
            this.filtros.visualizada = visualizada === 'true';
        };
        return this;
    };

    build() {
        return this.filtros;
    };
};

export default NotificacaoFilterBuilder;