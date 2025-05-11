import {fakeMappings} from './globalFakeMapping.js';
import Notificacao from '../models/Notificacao.js';
import Usuario from '../models/Usuario.js';

export default async function notificacaoSeed() {
    const usuarios = await Usuario.find({});
    await Notificacao.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const usuarioRandom = usuarios[Math.floor(Math.random() * usuarios.length)];

        
    }

}           