import Rota from "../models/Rota.js";
import { fakeMappings } from "./globalFakeMapping.js";
import bcrypt from 'bcrypt';

export default async function seedRotas() {
    // Remove
    await Rota.deleteMany();

    const rotas_array = [
        "rotas",
        "rotas:id",
        "grupos",
        "grupos:id",
        "usuarios",
        "usuarios:id",
        "categorias",
        "categorias:id",
        "localizacoes",
        "localizacoes:id",
        "componentes",
        "componentes:id",
        "fornecedores",
        "fornecedores:id",
        "movimentacoes",
        "movimentacoes:id",
        "notificacoes",
        "notificacoes:id",
        "orcamentos",
        "orcamentos:id",
    ];

    const rotas = rotas_array.map((rota) => ({
        rota,
        dominio: "localhost",
        ativo: true,
        buscar: true,
        enviar: true,
        substituir: true,
        modificar: true,
        excluir: true,
    }));

    const result = await Rota.collection.insertMany(rotas);
    console.log(Object.keys(result.insertedIds).length + " Rotas inseridas!");

    return Rota.find();
}