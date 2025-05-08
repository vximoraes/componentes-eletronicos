import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

class ComponenteOrcamento {
    constructor() {
        const componenteOrcamentoSchema = new mongoose.Schema({
            nome: {
                type: String,
                index: true,
                required: true
            },
            fornecedor: {
                type: String,
                required: true
            },
            quantidade: {
                type: Number,
                required: true
            },
            valor_unitario: {
                type: Number,
                required: true
            },
            subtotal: {
                type: Number,
                required: true
            },
            orcamento: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "orcamento", required: true
            }
        })

        componenteOrcamentoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("componente_orcamento", componenteOrcamentoSchema);
    }
}

export default new ComponenteOrcamento().model