import { fakeMappings } from "./globalFakeMapping.js";
import Categoria from "../models/Categoria.js";


export default async function categoriaSeed() {
    await Categoria.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const categoria = {
            nome: fakeMappings.Categoria.nome.apply()
        };

        await Categoria.create(categoria);
    }
}