import mongoose from 'mongoose';

const { Types } = mongoose;

class ComponenteOrcamentoFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comNome(nome) {
        if (nome) {
            this.filtros.nome = { $regex: nome, $options: 'i' };
        }
        return this;
    }

    comFornecedor(fornecedor) {
        if (fornecedor) {
            this.filtros.fornecedor = { $regex: fornecedor, $options: 'i' };
        }
        return this;
    }

    comQuantidade(quantidade) {
        if (quantidade !== undefined && quantidade !== null && quantidade !== '') {
            const num = Number(quantidade);
            if (!isNaN(num)) {
                this.filtros.quantidade = num;
            }
        }
        return this;
    }

    comQuantidadeMinima(min) {
        if (min !== undefined && min !== null && min !== '') {
            const num = Number(min);
            if (!isNaN(num)) {
                this.filtros.quantidade = { ...this.filtros.quantidade, $gte: num };
            }
        }
        return this;
    }

    comQuantidadeMaxima(max) {
        if (max !== undefined && max !== null && max !== '') {
            const num = Number(max);
            if (!isNaN(num)) {
                this.filtros.quantidade = { ...this.filtros.quantidade, $lte: num };
            }
        }
        return this;
    }

    comValorUnitarioMinimo(min) {
        if (min !== undefined && min !== null && min !== '') {
            const num = Number(min);
            if (!isNaN(num)) {
                this.filtros.valor_unitario = { ...this.filtros.valor_unitario, $gte: num };
            }
        }
        return this;
    }

    comValorUnitarioMaximo(max) {
        if (max !== undefined && max !== null && max !== '') {
            const num = Number(max);
            if (!isNaN(num)) {
                this.filtros.valor_unitario = { ...this.filtros.valor_unitario, $lte: num };
            }
        }
        return this;
    }

    comSubtotalMinimo(min) {
        if (min !== undefined && min !== null && min !== '') {
            const num = Number(min);
            if (!isNaN(num)) {
                this.filtros.subtotal = { ...this.filtros.subtotal, $gte: num };
            }
        }
        return this;
    }

    comSubtotalMaximo(max) {
        if (max !== undefined && max !== null && max !== '') {
            const num = Number(max);
            if (!isNaN(num)) {
                this.filtros.subtotal = { ...this.filtros.subtotal, $lte: num };
            }
        }
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default ComponenteOrcamentoFilterBuilder;