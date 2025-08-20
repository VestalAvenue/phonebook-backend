
require('dotenv').config()
const Phone = require (`./models/phoneBook`)
const http = require("http")
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors()) 

const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [
//     { "id": "1", "name": "Arto Hellas", "number": "040-123456" },
//     { "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" },
//     { "id": "3", "name": "Dan Abramov", "number": "12-43-234345" },
//     { "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122" }
// ]

app.get('/api/persons', (request,response) => {
    Phone.find({})
        .then(phones => {
            response.json(phones)
            console.log(phones)
        })
})

app.get('/info',(request,response) => {
    const total = persons.length
    const currentTime = new Date()
    response.send(
        `<p>Phonebook has info of ${total} people</p>
        <p>${currentTime}</p>`)
})

app.get('/api/persons/:id', (request,response) => {
    Phone.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Phone.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
    })

app.post('/api/persons/',(request,response) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const savedPhone = new Phone({
        name: body.name,
        number: body.number
    })

    savedPhone.save().then(savedPhone =>{
        response.json(savedPhone)
    })
})

const path = require('path')

// 🔹 Catch-all route for React frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
