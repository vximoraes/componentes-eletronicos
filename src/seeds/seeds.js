import DbConnect from "../config/DbConnect.js";
import categoriaSeed from "./categoriaSeed.js";
import localizacaoSeed from "./localizacaoSeed.js";
import componenteSeed from "./componenteSeed.js";
import fornecedorSeed from "./fornecedorSeed.js";
import movimentacaoSeed from "./movimentacaoSeed.js";
import usuarioSeed from "./usuarioSeed.js";
import notificacaoSeed from "./notificacaoSeed.js";
import componenteOrcamentoSeed from "./componenteOrcamentoSeed.js";
import orcamentoSeed from "./orcamentoSeed.js";

DbConnect.conectar();

await categoriaSeed();
await localizacaoSeed();
await componenteSeed();
await fornecedorSeed();
await movimentacaoSeed();
await usuarioSeed();
await notificacaoSeed();
await componenteOrcamentoSeed();
await orcamentoSeed();

DbConnect.desconectar();