import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import path, { extname } from "path";
import { connectDB } from "./config/connectionDB.js";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import { generateToken } from "./utils.js";
import { config } from "./config/config.js";

import { viewsRouter } from "./routes/views.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";

//~~~~~~~~~~~~INSTALACIÓN~~~~~~~~~~~~~~//
// npm init -y
// npm i express
// npm i express-session connect-mongo express-handlebars mongoose
// npm i jsonwebtoken
// npm i bcrypt
// npm i passport passport-local
// npm i dotenv
// npm i passport-github2

const port = 8080;
const app = express();

//~~~~~~~~~~~~~MIDDLEWARES~~~~~~~~~~~~~~~//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server Funcionando en puerto ${port}`));

connectDB();

//~~~~~~~~~~~~~TOKEN~~~~~~~~~~~~~~~//
app.get("/login", (req, res) => {
    const user = req.body; //Se pasa el usuario de la Base de Datos
    const token = generateToken(user); //Genera el Token
    res.json({ status: "success", accessToken: token }); //Se responde al usuario
});

//~~~~~~~~MOTOR DE PLANTILLAS~~~~~~~~~~//
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

//~~~~~~~~~~~~~SESSIONS~~~~~~~~~~~~~~~//
app.use(
    session({
        store: MongoStore.create({
            ttl: 4000,
            mongoUrl: config.mongo.url,
        }),
        secret: config.server.secretSession,
        resave: true,
        saveUninitialized: true,
    })
);

//~~~~~~~~~~~~~~~RUTAS~~~~~~~~~~~~~~~~//
app.use(viewsRouter);
app.use("/api/sessions", sessionsRouter);