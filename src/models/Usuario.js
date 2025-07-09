import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

class Usuario {
    constructor() {
        const usuarioSchema = new mongoose.Schema({
            nome: {
                type: String,
                index: true,
                required: true
            },
            email: {
                type: String,
                unique: true,
                required: true
            },
            senha: {
                type: String,
                select: false,
                required: true
            },
            ativo: {
                type: Boolean,
                default:
                    false
            },
            tokenUnico: { // Token único para recuperação de senha.
                type: String,
                select: false
            },
            refreshtoken: { // Refresh token para geração de access token de autenticação longa duração 7 dias para invalidação.
                type: String,
                select: false
            },
            accesstoken: { // Refresh token para  autenticação curta longa 15 minutos para invalidação.
                type: String,
                select: false
            },
            permissoes: [
                {
                    rota: { type: String, index: true, required: true }, // usuários / grupos / unidades / rotas
                    dominio: { type: String }, // http://localhost:3000
                    ativo: { type: Boolean, default: false },  // false
                    buscar: { type: Boolean, default: false },    // false
                    enviar: { type: Boolean, default: false },   // false
                    substituir: { type: Boolean, default: false },    // false
                    modificar: { type: Boolean, default: false },  // false
                    excluir: { type: Boolean, default: false }, // false
                }
            ],
        });

        usuarioSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("usuarios", usuarioSchema);
    };
};

export default new Usuario().model;