import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

class Movimentacao {
    constructor() {
        const movimentacaoSchema = new mongoose.Schema({
            tipo: {
                type: String,
                index: true,
                required: true,
                enum: { values: ["Entrada", "Saída"] },
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
                ref: "componente",
                required: true,
            },
            fornecedor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "fornecedor",
                required: true,
            },
        });

        movimentacaoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("movimentacao", movimentacaoSchema);
    }
}

export default new Movimentacao().model;
