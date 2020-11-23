/* require packages */
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors');
const authRoutes = require('./api/v1/auth')
const userRoutes = require('./api/v1/users')

const app = express();
const router = express.Router();

/* use packages */
app.use(morgan('dev'))

/* connect to mongodb server */
mongoose.connect(`mongodb://${process.env.HOST}:${process.env.MONGODB_PORT}/${process.env.DB}`, {useNewUrlParser: true, useUnifiedTopology: true})
.catch((err) => {
    console.log(err)
})

/* use json data */
app.use(express.json())

/* enable cors */
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*'),
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Content-Type', 'application/json; charset=UTF-8')
    next()
})


/* global variables */
errorArray = []
errorRes = {}

resetGlobalVariables = (() =>{
    errorArray = []
    errorRes = {}
})

/* route middleware */
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

/* error middleware */
app.use((req,res,next)=>{
    const error = new Error("Not found.")
    error.status = 404
    next(error)
})

/* handle error */
app.use((error,req,res,next)=>{
    resetGlobalVariables() 
    switch(error.action){
        case 'register':
            switch(error.code){
                case 11000:
                    errorArray.push('User with email provided already exists.')
                    break;
                default:
                    error.message = error.message.split('User validation failed: ') //remove that text response
                    error.message.splice(0,1) // remove response
                    error.message  = error.message[0].split(', ') //convert to array
            
                    if(error.message.length > 0){
                        for(var i=0; i<error.message.length;i++){
                            let value =  error.message[i].split(': ')
                            errorArray.push(value[1])
                        }
                    }
                    break; 
            }
            break;
        default: 
            errorArray.push(error.message)
            break;
    }
    /* return response */
    errorRes['error']=errorArray
    res.status(error.status)
    res.json({
        "msg": "failed",
        "code": error.status,
        "errors": errorArray.length,
        "response": errorRes
    })
})

/* export app */
module.exports = app
