import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

class Movimentacao {
    constructor() {
        const movimentacaoSchema = new mongoose.Schema({
            tipo: {
                type: String,
                index: true,
                required: true,
                enum: { values: ["entrada", "saida"] },
            },
            data_hora: {
                type: Date,
                required: true,
                default: Date.now
            },
            quantidade: {
                type: Number,
                required: true
            },
            componente: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "componentes", // corrigido para bater com o nome do modelo
                required: true,
            },
            fornecedor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "fornecedores", // corrigido para bater com o nome do modelo
                required: false,
            },
        });

        movimentacaoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("movimentacoes", movimentacaoSchema);
    };
};

export default new Movimentacao().model;