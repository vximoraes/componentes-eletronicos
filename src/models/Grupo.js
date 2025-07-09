// models/Grupo.js
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

class Grupo {
    constructor( ) {
        const grupoSchema = new mongoose.Schema(
            {
                nome: { type: String, index: true,  unique: true },
                descricao: { type: String, required: true },
                ativo: { type: Boolean, default: true },
                /**
                 * Permissões personalizadas para cada rota, a rota e o domínio 
                 * devem ser únicos e conrrespondentes a rota e domínio do sistema em /rotas
                 */
                permissoes: [
                    {
                        rota: { type: String, index: true, required: true }, // usuários / grupos / rotas
                        dominio: { type: String }, // http://localhost:3000
                        ativo: { type: Boolean, default: false },  // false
                        buscar: { type: Boolean, default: false },    // false
                        enviar: { type: Boolean, default: false },   // false
                        substituir: { type: Boolean, default: false },    // false
                        modificar: { type: Boolean, default: false },  // false
                        excluir: { type: Boolean, default: false }, // false
                    }
                ],
            },
            {
                timestamps: true,
                versionKey: false
            }
        );

        // Validação personalizada para garantir que rota + dominio sejam únicos dentro do grupo
        grupoSchema.pre('save', function (next) {
            const permissoes = this.permissoes;
            const combinacoes = permissoes.map(p => `${p.rota}_${p.dominio}`);
            const setCombinacoes = new Set(combinacoes);

            if (combinacoes.length !== setCombinacoes.size) {
                return next(new Error('Permissões duplicadas encontradas: rota + domínio devem ser únicos dentro de cada grupo.'));
            }

            next();
        });

        grupoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model('grupos', grupoSchema);
    }
}

export default new Grupo().model;