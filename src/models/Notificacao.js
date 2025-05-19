import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
    default: null
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuario", 
    required: true
  }
});

notificacaoSchema.plugin(mongoosePaginate);

export default mongoose.model("notificacao", notificacaoSchema);
