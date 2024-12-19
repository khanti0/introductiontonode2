require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/persons')

app.use(express.json())

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())

app.get('/info', (request, response) => {
  response.send(
    `
    <p>Phonebook has info for ${Person.length} people</p>
    <p>${new Date()}</p>
    `
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing'})
  }
  
  Person.findOne({name: body.name}).then(person => {
    if (person !== null  && person.name === body.name){
      const person = {
        name: body.name,
        number: body.number,
      }
    
      Person.findOneAndUpdate({name: body.name}, person)
        .then(updatedNote => {
          response.json(updatedNote)
        })
        .catch(error => next(error))
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
    
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    }
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})