import Usuario from "../models/Usuario.js";
import { fakeMappings } from "./globalFakeMapping.js";
import bcrypt from 'bcrypt';

export default async function usuarioSeed() {
    await Usuario.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const senhaGerada = fakeMappings.Usuario.senha.apply();
        const senhaCriptografada = await bcrypt.hash(senhaGerada, 10);

        const usuario = {
            nome: fakeMappings.Usuario.nome.apply(),
            email: fakeMappings.Usuario.email.apply(),
            senha: senhaCriptografada,
            ativo: fakeMappings.Usuario.ativo.apply()
        };

        await Usuario.create(usuario);
    }
}