
require('dotenv').config()
const Phone = require ('./models/phoneBook')
const http = require('http')
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

app.get('/info', (req, res, next) => {
  Phone.countDocuments({})
    .then(count => {
      const currentTime = new Date()
      res.send(`<p>Phonebook has info of ${count} people</p><p>${currentTime}</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request,response,next) => {
  Phone.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons/',(request,response,next) => {
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

  savedPhone.save().then(savedPhone => {
    response.json(savedPhone)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log('updating id', request.params.id)
  const person = {
    name: body.name,
    number: body.number
  }

  Phone.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})



const path = require('path')

// 🔹 Catch-all route for React frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
