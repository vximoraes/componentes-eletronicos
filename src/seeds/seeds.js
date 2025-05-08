import DbConnect from "../config/DbConnect.js";
import categoriaSeed from "./categoriaSeed.js";
import localizacaoSeed from "./localizacaoSeed.js";
import componenteSeed from "./componenteSeed.js";

DbConnect.conectar();

await categoriaSeed();
await localizacaoSeed();
await componenteSeed();

DbConnect.desconectar();