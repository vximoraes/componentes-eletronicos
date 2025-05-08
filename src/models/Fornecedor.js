import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

class Fornecedor {
    constructor() {
        const fornecedorSchema = new mongoose.Schema({
            nome: {
                type: String,
                index: true,
                required: true
            },
        })

        fornecedorSchema.plugin(mongoosePaginate)

        this.model = mongoose.model("fornecedor", fornecedorSchema)
    }
}

export default new Fornecedor().model