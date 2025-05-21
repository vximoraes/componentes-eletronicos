import ComponenteModel from '../../models/Componente.js';
import ComponenteRepository from '../ComponenteRepository.js';
import Localizacao from '../../models/Localizacao.js'
import Categoria from '../../models/Categoria.js'
import mongoose from 'mongoose';
const { Types } = mongoose;

class ComponenteFilterBuilder {
    constructor() {
        this.filtros = {};
        this.componenteRepository = new ComponenteRepository();
        this.componenteModel = ComponenteModel;
    }

    comNome(nome) {
        if (nome) {
            this.filtros.nome = { $regex: nome, $options: 'i' };
        }
        return this;
    }

    comCodigo(codigo) {
        if (codigo) {
            this.filtros.codigo = { $regex: codigo, $options: 'i' };
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

    comEstoqueMinimo(estoque_minimo) {
        if (estoque_minimo === 'true') {
            this.filtros.$expr = { $lt: ["$quantidade", "$estoque_minimo"] };
        }
        return this;
    }

    async comLocalizacao(localizacao) {
        if (localizacao) {
            if (Types.ObjectId.isValid(localizacao)) {
                // Se já for um ObjectId, faz o populate direto.
                this.filtros.localizacao = localizacao;
                const localizacaoEncontrada = await Localizacao.findById(localizacao);
                if (!localizacaoEncontrada) {
                    // Caso não exista, força a busca “vazia”.
                    this.filtros.localizacao = { $in: [] };
                }
            } else {
                // Se for string.
                const localizacaoEncontrada = await Localizacao.findOne({
                    localizacao: { $regex: localizacao, $options: 'i' },
                });
                if (localizacaoEncontrada) {
                    this.filtros.localizacao = localizacaoEncontrada._id;
                } else {
                    // Força a busca “vazia”.
                    this.filtros.localizacao = { $in: [] };
                }
            }
        }
        return this;
    }

    async comCategoria(categoria) {
        if (categoria) {
            if (Types.ObjectId.isValid(categoria)) {
                // Se já for um ObjectId, faz o populate direto.
                this.filtros.categoria = categoria;
                const categoriaEncontrada = await Categoria.findById(categoria);
                if (!categoriaEncontrada) {
                    // Caso não exista, força a busca “vazia”.
                    this.filtros.categoria = { $in: [] };
                }
            } else {
                // Se for string.
                const categoriaEncontrada = await Categoria.findOne({
                    categoria: { $regex: categoria, $options: 'i' },
                });
                if (categoriaEncontrada) {
                    this.filtros.categoria = categoriaEncontrada._id;
                } else {
                    // Força a busca “vazia”.
                    this.filtros.categoria = { $in: [] };
                }
            }
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

    build() {
        return this.filtros;
    }
}

export default ComponenteFilterBuilder;