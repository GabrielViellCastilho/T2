import express from "express";
import cors from "cors";
import continenteRoutes from "./routes/continenteRoutes";
import paisRoutes from "./routes/paisRoutes";
import cidadeRoutes from "./routes/cidadeRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/continentes", continenteRoutes);
app.use("/paises", paisRoutes);
app.use("/cidades", cidadeRoutes);

export default app;
