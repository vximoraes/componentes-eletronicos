import categoriaSeed from "./categoriaSeed";
import dbConnect from "../config/dbConnect.js"

dbConnect.conectar()

await categoriaSeed();