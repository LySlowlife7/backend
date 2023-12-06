import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import path, { extname } from "path";
import { viewsRouter } from "./routes/views.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { connectDB } from "./config/connectionDB.js";


const port = 8080;
const app = express();

//~~~~~~~~~~~~~MIDDLEWARES~~~~~~~~~~~~~~~//
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(port , () => console.log(`Server Funcionando en puerto ${port}`));

connectDB();

//~~~~~~~~MOTOR DE PLANTILLAS~~~~~~~~~~//
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "/views"));

//~~~~~~~~~~~~~SESSIONS~~~~~~~~~~~~~~~//
app.use(session({
    store: MongoStore.create({
        ttl:4000,
        mongoUrl:"mongodb+srv://azul:florymini22@cluster0.dg7nkrg.mongodb.net/login"
    }),
    secret:"funtimeworld",
    resave:true,
    saveUninitialized:true
}));

//~~~~~~~~~~~~~~~RUTAS~~~~~~~~~~~~~~~~//
app.use(viewsRouter);
app.use("/api/sessions", sessionsRouter);