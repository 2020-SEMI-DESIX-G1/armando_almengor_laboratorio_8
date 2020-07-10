require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const connectDb = require('./dbConfig');
const Students = require('./models/students');

const PORT = 3000;

//Configuración
app.set('view engine','pug');
app.set('views', './views');

// Intermediarios
app.use(bodyParser.json());

// Controladores --Views
    //select all
    app.get('/students', async (req, res) => {
        const students = await Students.find().select('nombre edad');
        res.render('students', { students });
    });

// Controladores --API
    //root
    app.get('/', async (req, res) => {
        res.send("Laboratorio No.8 - Armando Almengor");
    });

    //select all
    app.get('/api/students/', async (req, res) => {
        const students = await Students.find().select('nombre edad');
        res.json({
            students,
            Total: students.length
        });
    });

    //create new
    app.post('/api/students/', async (req, res) => {
        const { nombre, edad } = req.body;
        await Students.create({ nombre, edad });
        res.json({ nombre, edad });
    });

    //select by id
    app.get('/api/students/:id', async (req, res) => {
        try {
            const students = await Students.findById(req.params.id).select('nombre edad');
            res.json(students);
        } catch (error) {
            console.log(error);
            res.json({});
        }
    });

    //update
    app.put('/api/students/:id', async (req, res) => {
        try {
            const students = await Students.findByIdAndUpdate(req.params.id,req.body,{useFindAndModify: false});
            res.json(students);
        } catch (error) {
            console.log(error);
            res.json({});
        }
    });

    //delete
    app.delete('/api/students/:id', async (req, res) => {
        try {
            const students = await Students.findByIdAndRemove(req.params.id,{useFindAndModify: false});
            res.json(students);
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