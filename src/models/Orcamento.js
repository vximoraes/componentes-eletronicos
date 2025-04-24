import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

class Orcamento {
    constructor() {
        const orcamentoSchema = new mongoose.Schema ({
            nome: { type: String, index: true, required: true },
            protocolo: { type: String, unique: true, required: true },
            descricao: { type: String, required: false }
        })
    }
}