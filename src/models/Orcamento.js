import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

// Falta colocar as chaves estrangeiras e array de componente_orcamento
class Orcamento {
    constructor() {
        const orcamentoSchema = new mongoose.Schema({
            nome: {
                type: String,
                index: true,
                required: true
            },
            protocolo: {
                type: String,
                unique: true,
                required: true
            },
            descricao: {
                type: String,
                required: false
            },
            valor: {
                type: Number,
                required: true
            },
            componentes:
                [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "componente_orcamento"
                }]
        })

        orcamentoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("orcamento", orcamentoSchema);
    }
}

export default new Orcamento().model