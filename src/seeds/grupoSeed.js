import Grupo from "../models/Grupo.js";
import { fakeMappings } from "./globalFakeMapping.js";

export default async function seedGrupos(rotas) {
    // Remove
    await Grupo.deleteMany();

    const grupos = [];

    // Grupo fixo com acesso total
    const grupoAdministrador = {
        nome: "Administrador",
        descricao: "Grupo com acesso total a todas as rotas",
        ativo: true,
        permissoes: rotas.map((r) => ({ ...r.toObject(), _id: r._id })),
    };
    grupos.push(grupoAdministrador);

    const grupoVisitante = {
        nome: "Usuario",
        descricao: "Grupo com acesso aos visualização de pontos históricos",
        ativo: true,
        permissoes: rotas.map((r) => {
            if (r.rota === "usuarios" || r.rota === "usuarios:id") {
                return {
                    ...r.toObject(),
                    _id: r._id,
                    buscar: true,
                    enviar: true,
                    modificar: true,
                    substituir: true,
                    excluir: false,
                };
            }
            return {
                ...r.toObject(),
                _id: r._id,
                buscar: true,
                enviar: true,
                modificar: true,
                substituir: true,
                excluir: true,
            };
        }),
    };
    grupos.push(grupoVisitante);

    const result = await Grupo.collection.insertMany(grupos);
    console.log(Object.keys(result.insertedIds).length + " Grupos inseridos!");

    // Retorna grupos atualizados
    return Grupo.find();
}