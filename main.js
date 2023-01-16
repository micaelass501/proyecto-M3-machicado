const express = require("express");
const bodyParser = require("body-parser");
const pg = require('pg');

const config = {
    user: 'db_m3_machicado_user',
    database: 'db_m3_machicado',
    password: 'eFcDBU1cfySGdy42BlsQw1Wbq4eG8mGf',
    host: 'dpg-cf177omn6mpkr69uj5eg-a.oregon-postgres.render.com',
    port: 5432,
    ssl: true,
    idleTimeoutMillis: 3000
}

const client = new pg.Pool(config);

// # MODELO
class RegUserModel{
    constructor(){
        this.todos = [];
    }

    async getUsuarios(){
        const res = await client.query('select * from usuarios;');
        console.log(res);
        return res.rows;
    }

    async addUsuarios(nombreCompleto, edad){
        const query = 'INSERT INTO public.usuarios(nombrecompleto, edad) VALUES($1, $2);';
        const values = [nombreCompleto,edad]
        const res = await client.query(query,values);
        return res;
    }
    
    async getPromedioEdad(){
        const res = await client.query('select SUM(edad)::float/count(*)::float as promedioEdad from usuarios;');
        console.log(res);
        return res.rows[0];
    }

    async getStatus(){
        const res = await client.query('select namesystem, version, developer, email from status;');
        console.log(res);
        return res.rows;
    }
}

// # CONTROLADOR

class RegUserController {
    constructor(model){
        this.model = model;
    }

    async getUsuarios(){
       return await this.model.getUsuarios();
    }

    async addUsuarios(nombreCompleto, edad){
        await this.model.addUsuarios(nombreCompleto, edad);
    }

    async getPromedioEdad(){
        return await this.model.getPromedioEdad();
     }

     async getStatus(){
        return await this.model.getStatus();
     }
}
// # VISTA

const reguserModel = new RegUserModel();
const reguserController = new RegUserController(reguserModel);

const app = express();

app.use(bodyParser.json());

app.get("/usuarios", async (req,res) => {
    const response = await reguserController.getUsuarios()
    res.json(response)
});

app.post("/usuarios", (req,res) => {
    const nombreCompleto  = req.body.nombreCompleto;
    const edad  = req.body.edad;
    console.log(req.body);
    reguserController.addUsuarios(nombreCompleto,edad);
    res.sendStatus(200);
});

app.get("/usuarios/promedio-edad", async (req,res) => {
    const response = await reguserController.getPromedioEdad()
    console.log(response);
    res.json(response)
});

app.get("/status", async (req,res) => {
    const response = await reguserController.getStatus()
    res.json(response)
});

app.listen(3000, () => {
    console.log("Compilado");
});