import DbConnect from "../config/DbConnect.js";
import categoriaSeed from "./categoriaSeed.js";
import localizacaoSeed from "./localizacaoSeed.js";
import componenteSeed from "./componenteSeed.js";
import fornecedorSeed from "./fornecedorSeed.js";
import movimentacaoSeed from "./movimentacaoSeed.js";

DbConnect.conectar();

await categoriaSeed();
await localizacaoSeed();
await componenteSeed();
await fornecedorSeed();
await movimentacaoSeed();

DbConnect.desconectar();