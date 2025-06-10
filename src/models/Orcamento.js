import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

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
            componentes: [
                {
                    _id: { 
                        type: mongoose.Schema.Types.ObjectId 
                    },
                    nome: {
                        type: String,
                        index: true,
                        unique: true,
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
                }
            ]
        });

        orcamentoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("orcamentos", orcamentoSchema);
    };
};

export default new Orcamento().model;