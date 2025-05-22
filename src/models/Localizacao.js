import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

class Localizacao {
    constructor() {
        const localizacaoSchema = new mongoose.Schema({
            nome: {
                type: String,
                index: true,
                unique: true,
                required: true
            },
        });

        localizacaoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("localizacoes", localizacaoSchema);
    }
}

export default new Localizacao().model;