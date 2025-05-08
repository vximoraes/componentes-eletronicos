import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

class Notificacao {
    constructor() {
        const notificacaoSchema = new mongoose.Schema({
            mensagem: {
                type: String,
                index: true,
                required: true
            },
            data_hora: {
                type: Date,
                required: true,
                default: Date.now
            },
            visualizacao: {
                type: Date,
                required: false,
                default: Date.now
            },
            usuario: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "usuario", required: true
            }
        })

        notificacaoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("notificacao", notificacaoSchema);
    }
}

export default new Notificacao().model