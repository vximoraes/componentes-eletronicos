import DbConnect from "../config/DbConnect.js";
import categoriaSeed from "./categoriaSeed.js";
import localizacaoSeed from "./localizacaoSeed.js";

DbConnect.conectar();

await categoriaSeed();
await localizacaoSeed();