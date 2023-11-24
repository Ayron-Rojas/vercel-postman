const express = require('express');
const app = express();
const port = process.env.PORT || 3000
app.use(express.json())
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
// Middleware para verificar la API key
const API_KEY = process.env.API_KEY;
const verificarApiKey = (req, res, next) => {
    const apiKey = req.get('x-api-key'); // Suponiendo que la clave se pasa en el encabezado 'api-key'
  
    // Verificar si la clave de API es válida (puedes implementar tu propia lógica aquí)
    if (apiKey && apiKey === API_KEY) {
      next(); // Continuar con la siguiente función en la cadena de middleware
    } else {
      res.status(401).send('Acceso no autorizado');
    }
  };
  
  // Aplicar el middleware a todas las rutas que requieren la API key
  app.use('/students', verificarApiKey);
  app.use('/students/:id',verificarApiKey);

const pool = new Pool({
    user: 'default',
    host: "ep-hidden-brook-15386703-pooler.us-east-1.postgres.vercel-storage.com",
    database: 'verceldb',
    password: "dJFbEgO2mf8S",
    port: 5432,
    ssl: {rejectUnauthorized: false}
});



app.get('/students',(req,res)=>{
    const listUsersQuery = `SELECT * FROM students;`;

pool.query(listUsersQuery)
    .then(res2 => {
        console.log("List students: ", res2.rows);
        res.status(201)
        res.send(res2.rows)
    })
    .catch(err => {
        console.error(err);
        res.status(400)
        console.log('ha ocurrido un error')
        res.send('hubo un error')
    });
})

app.get('/students/:id',(req,res)=>{
    const id = req.params.id
    const listUsersQuery =`SELECT *FROM students WHERE id=${id};`

pool.query(listUsersQuery)
    .then(res2 => {
        console.log("List students: ", res2.rows);
        res.send(res2.rows)
    })
    .catch(err => {
        console.error(err);
    });
})

app.post('/students',(req,res)=>{
    const insert = `INSERT INTO students (id, name, lastname, notes) VALUES('${req.body.id}','${req.body.name}','${req.body.lastname}','${req.body.notes}')`
    pool.query(insert)
    .then(data=>{
        console.log(res.rows);
        return res.send(data.rows)
    })
    console.log(req.body)
})

app.put('/students/:id',  (req,res)=>{
    const index = req.params.id;
    const modificar = `UPDATE students SET name='${req.body.name}' ,lastname='${req.body.lastname}',notes='${req.body.notes}' WHERE id = '${index}';`
    pool.query(modificar)
    .then(data=>{
        console.log(modificar);
        return res.send(data)
    })
    console.log(req.body)
  })

app.delete('/students/:id',(req,res)=>{
    const eliminar = `DELETE FROM students WHERE id = ${req.params.id}`
    pool.query(eliminar)
    .then(data=>{
        console.log(res.rows);
        return res.send(data)
    })
    console.log(req.body)

})

app.listen(port,()=>console.log('the server is up'))