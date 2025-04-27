import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

class Categoria {
    constructor() {
        const categoriaSchema = new mongoose.Schema ({
            nome: { type: String, index: true, required: true },
        })

        categoriaSchema.plugin(mongoosePaginate)
        
        this.model = mongoose.model("categoria", categoriaSchema)
    }
}

export default new Categoria().model