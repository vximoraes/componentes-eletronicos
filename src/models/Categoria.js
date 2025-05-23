import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

class Categoria {
    constructor() {
        const categoriaSchema = new mongoose.Schema({
            nome: {
                type: String,
                index: true,
                unique: true,
                required: true
            },
        });

        categoriaSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("categorias", categoriaSchema);
    };
};

export default new Categoria().model;