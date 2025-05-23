import { fakeMappings } from "./globalFakeMapping.js";
import Categoria from "../models/Categoria.js";

export default async function categoriaSeed() {
    await Categoria.deleteMany({});

    for (let i = 0; i < fakeMappings.Categoria.categorias.length; i++) {
        const categoria = {
            nome: fakeMappings.Categoria.nome(i)
        };

        await Categoria.create(categoria);
    };
};