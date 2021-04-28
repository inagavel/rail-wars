/**
 * Here we use mongoose module to connect to database
 * @type {module:mongoose}
 */
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/railWars', {
    useNewUrlParser: true,
        useUnifiedTopology: true
},
    err =>{
    if(!err){
        console.log('Connection succeeded')
     }
    else{
        console.log(" error database connection :" + err)

    }
})
require('./placeModel')