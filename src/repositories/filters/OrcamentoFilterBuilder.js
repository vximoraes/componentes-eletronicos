import OrcamentoModel from '../../models/Orcamento.js';
import OrcamentoRepository from '../OrcamentoRepository.js';
import mongoose from 'mongoose';
const { Types } = mongoose;

class OrcamentoFilterBuilder {
    constructor() {
        this.filtros = {};
        this.orcamentoRepository = new OrcamentoRepository();
        this.orcamentoModel = OrcamentoModel;
    };

    comNome(nome) {
        if (nome) {
            this.filtros.nome = { $regex: nome, $options: 'i' };
        };
        return this;
    };

    comProtocolo(protocolo) {
        if (protocolo) {
            this.filtros.protocolo = { $regex: protocolo, $options: 'i' };
        };
        return this;
    };

    build() {
        return this.filtros;
    };
};

export default OrcamentoFilterBuilder;