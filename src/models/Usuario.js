import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

class Usuario {
    constructor() {
        const usuarioSchema = new mongoose.Schema ({
            nome: { type: String, index: true, required: true },
            email: { type: String, unique: true, required: true },
            senha: { type: String, select: false, required: true }
        })

        usuarioSchema.plugin(mongoosePaginate)

        this.model = mongoose.model("usuario", usuarioSchema);
    }
}

export default new Usuario().model