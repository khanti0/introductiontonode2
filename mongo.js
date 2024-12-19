const mongoose = require('mongoose')

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('give arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Fullstack:${password}@cluster0.uwjwo.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,

})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length === 3){
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(result => {
  console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
  mongoose.connection.close()
})}