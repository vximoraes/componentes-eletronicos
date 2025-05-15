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
            // tokenUnico: { // Token único para recuperação de senha.
            //     type: String, 
            //     select: false 
            // }, 
            // refreshtoken: { // Refresh token para geração de access token de autenticação longa duração 7 dias para invalidação.
            //     type: String, 
            //     select: false 
            // }, 
            // accesstoken: { // Refresh token para  autenticação curta longa 15 minutos para invalidação.
            //     type: String, 
            //     select: false 
            // }
        });

        usuarioSchema.plugin(mongoosePaginate);

        this.model = mongoose.model("usuarios", usuarioSchema);
    }
}

export default new Usuario().model;