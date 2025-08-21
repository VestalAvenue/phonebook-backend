const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.9qbjqmw.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number : String,
})

const Phone = mongoose.model('phoneBook', phoneSchema)

if (process.argv.length > 3){
  const name = process.argv[3]
  const number = process.argv[4]
  const newPhone = new Phone({
    name,
    number,
  })
  newPhone.save().then(result => {
    console.log('Phone saved')
    mongoose.connection.close()
  })}

// const Phone = new Phone({
//   content: 'HTML is easy',
//   important: true,

//  })

if(process.argv.length === 3){
  Phone.find({}).then(result => {
    result.forEach(Phone => {
      console.log(`${Phone.name} ${Phone.number}`)
    })
    mongoose.connection.close()
  })
}

// Phone.save().then(result => {
//   console.log('Phone saved!')
//   mongoose.connection.close()
// })