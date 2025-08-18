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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/info',(request,response) => {
    const total = persons.length
    const currentTime = new Date()
    response.send(
        `<p>Phonebook has info of ${total} people</p>
        <p>${currentTime}</p>`)
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id > persons.length ? false : request.params.id
    if(id){
        const person = persons.find(p=> id === p.id)
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id // keep it as string
    const person = persons.find(p => p.id === id)

    if (person) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons/',(request,response) => {
    const id = Math.floor(Math.random() * 10000000) + 1;
    const person = request.body
    if(person.name === "" || person.number === ""){
        response.status(400).send({ error: 'name is missing' }).end()
        return
    }
    else if((duplicate = persons.some(p=> p.name === person.name))){
        response.status(400).send({error: "name must be unique"}).end()
        return
    }
    person.id = id
    persons = persons.concat(person)
    response.json(person)
})



const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

