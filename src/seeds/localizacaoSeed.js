import { fakeMappings } from "./globalFakeMapping.js";
import Localizacao from "../models/Localizacao.js";

export default async function localizacaoSeed() {
    await Localizacao.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const localizacao = {
            nome: fakeMappings.Localizacao.nome.apply()
        };

        await Localizacao.create(localizacao);
    };
};