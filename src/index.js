import  Express from "express";
import {engine} from "express-handlebars";
import { __dirname } from "./utils.js";
import * as path from "path";

const app = Express();
const PORT =3030; 

app.engine("handlebars", engine());
app.set("view engine","handlebars");
app.set("views",path.resolve(__dirname + "/views"));
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log('server run Express port: ${PORT}');
});