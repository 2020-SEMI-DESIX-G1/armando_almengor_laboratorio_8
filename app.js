require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const connectDb = require('./dbConfig');
const Estudiantes = require('./models/Estudiantes');
const { restart } = require('nodemon');

const PORT = 3000;

//Configuración
app.set('view engine','pug');
app.set('views', './views');

// Intermediarios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Controladores --Views
//select all
app.get('/estudiantes', async (req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes', { estudiantes });
});

//Select by ID
app.get('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.render('estudiantes_detail', { estudiante });
    } catch (error) {
        console.log(error);
        throw error;
    }
});

//Create new
app.post('/estudiantes', async (req, res) => {
    const {nombre, edad} = req.body;
    await Estudiantes.create({nombre, edad});
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes', { estudiantes });
});

//Delete
app.post('/estudiantes/borrar/:id', async (req, res) => {
    try {
        const estudiantes = await Estudiantes.findByIdAndRemove(req.params.id,{useFindAndModify: false});
        res.redirect('/estudiantes');
        res.status(200).json({message:"Eliminado"});
    } catch (error) {
        console.log(error);
        throw error;
    }
 
});

//Update
app.post('/estudiantes/actualizar/:id', async (req, res) => {
    try {
        const estudiantes = await Estudiantes.findByIdAndUpdate(req.params.id,req.body,{useFindAndModify: false});
        res.redirect('/estudiantes');
        res.status(200).json({message:"Eliminado"});
    } catch (error) {
        console.log(error);
        throw error;
    }
});

// Controladores --API
//root
app.get('/', async (req, res) => {
    res.send("Laboratorio No.8 - Armando Almengor");
});

//select all
app.get('/api/estudiantes/', async (req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.json({
        estudiantes,
        Total: estudiantes.length
    });
});

//create new
app.post('/api/estudiantes/', async (req, res) => {
    const { nombre, edad } = req.body;
    await Estudiantes.create({ nombre, edad });
    res.json({ nombre, edad });
});

//select by id
app.get('/api/estudiantes/:id', async (req, res) => {
    try {
        const estudiantes = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.json(estudiantes);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

//update
app.put('/api/estudiantes/:id', async (req, res) => {
    try {
        const estudiantes = await Estudiantes.findByIdAndUpdate(req.params.id,req.body,{useFindAndModify: false});
        res.json(estudiantes);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

//delete
app.delete('/api/estudiantes/:id', async (req, res) => {
    try {
        const estudiantes = await Estudiantes.findByIdAndRemove(req.params.id,{useFindAndModify: false});
        res.json(estudiantes);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

//DB
connectDb().then(() => {
    app.listen(PORT, () => {
    console.log(`Ejecutando en el puerto ${PORT}`);
    });
});