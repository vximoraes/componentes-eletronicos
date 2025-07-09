import "dotenv/config";
import app from "./src/app.js";
import DbConnect from "./src/config/DbConnect.js";

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`)
});