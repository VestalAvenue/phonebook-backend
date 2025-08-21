const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }
// const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

console.log(`Connecting ot MongoDB at ${url}`)
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error conncting to MongoDB:' , error.message)
    })

const validator =  (number) => {
    const regex = /^\d{1,2,3}-\d+&/
    return regex.test(number) && number.length >= 8
}

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: [true, `number is required`],
    validate: {
        validator: validator,
        message: props => `%{props.value} is not a valid phone number`
    }
  }
})

const Phone = mongoose.model('phoneBook', phoneSchema)

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('phoneBook', phoneSchema)

// if (process.argv.length > 3){
//   const name = process.argv[3]
//   const number = process.argv[4]
//   const newPhone = new Phone({
//     name,
//     number,
//   })
//   newPhone.save().then(result => {
//     console.log(`Phone saved`)
//     mongoose.connection.close()
//   })}

// // const Phone = new Phone({
// //   content: 'HTML is easy',
// //   important: true,

// //  })

// if(process.argv.length === 3){
//   Phone.find({}).then(result => {
//   result.forEach(Phone => {
//     console.log(`${Phone.name} ${Phone.number}`)
//   })
//   mongoose.connection.close()
// })
// }

// Phone.save().then(result => {
//   console.log('Phone saved!')
//   mongoose.connection.close()
// })