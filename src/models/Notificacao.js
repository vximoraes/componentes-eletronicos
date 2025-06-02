import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
            visualizada: {
                type: Boolean,
                required: false,
                default: false
            },
            usuario: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "usuarios", 
                required: true
            }
        });

        notificacaoSchema.plugin(mongoosePaginate);
        this.model = mongoose.model("notificacoes", notificacaoSchema);
    }
}

export default new Notificacao().model;