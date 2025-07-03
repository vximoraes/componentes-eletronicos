import MovimentacaoModel from '../../models/Movimentacao.js';
import MovimentacaoRepository from '../MovimentacaoRepository.js';
import Componente from '../../models/Componente.js';
import Fornecedor from '../../models/Fornecedor.js';
import mongoose from 'mongoose';
const { Types } = mongoose;

class MovimentacaoFilterBuilder {
    constructor() {
        this.filtros = {};
        this.movimentacaoRepository = new MovimentacaoRepository();
        this.movimentacaoModel = MovimentacaoModel;
    };

    comTipo(tipo) {
        if (tipo) {
            this.filtros.tipo = { $regex: tipo, $options: 'i' };
        }
        return this;
    };

    comData(data) {
        if (data) {
            const inicio = new Date(data + "T00:00:00.000Z");
            const fim = new Date(data + "T23:59:59.999Z");
            this.filtros.data_hora = { $gte: inicio, $lte: fim };
        };
        return this;
    };

    comQuantidade(quantidade) {
        if (quantidade !== undefined && quantidade !== null && quantidade !== '') {
            const num = Number(quantidade);
            if (!isNaN(num)) {
                this.filtros.quantidade = num;
            };
        };
        return this; 
    };

    async comComponente(componente) {
        if (componente) {
            if (Types.ObjectId.isValid(componente)) {
                // Se já for um ObjectId, faz o populate direto.
                this.filtros.componente = componente;
                const componenteEncontrado = await Componente.findById(componente);
                if (!componenteEncontrado) {
                    // Caso não exista, força a busca “vazia”.
                    this.filtros.componente = { $in: [] };
                };
            } else {
                // Se for string.
                const componenteEncontrado = await Componente.findOne({
                    componente: { $regex: componente, $options: 'i' },
                });
                if (componenteEncontrado) {
                    this.filtros.componente = componenteEncontrado._id;
                } else {
                    // Força a busca “vazia”.
                    this.filtros.componente = { $in: [] };
                };
            };
        };
        return this;
    };

    async comFornecedor(fornecedor) {
        if (fornecedor) {
            if (Types.ObjectId.isValid(fornecedor)) {
                // Se já for um ObjectId, faz o populate direto.
                this.filtros.fornecedor = fornecedor;
                const fornecedorEncontrado = await Fornecedor.findById(fornecedor);
                if (!fornecedorEncontrado) {
                    // Caso não exista, força a busca “vazia”.
                    this.filtros.fornecedor = { $in: [] };
                };
            } else {
                // Se for string.
                const fornecedorEncontrado = await Fornecedor.findOne({
                    fornecedor: { $regex: fornecedor, $options: 'i' },
                });
                if (fornecedorEncontrado) {
                    this.filtros.fornecedor = fornecedorEncontrado._id;
                } else {
                    // Força a busca “vazia”.
                    this.filtros.fornecedor = { $in: [] };
                };
            };
        }; 
        return this;
    };

    build() {
        return this.filtros;
    };
};

export default MovimentacaoFilterBuilder;