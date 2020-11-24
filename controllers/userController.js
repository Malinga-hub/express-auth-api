const mongoose = require('mongoose');
const User = require('../collections/user');
const bcrypt = require('bcrypt');

/* get all  */
exports.getAll = async (req, res, next) =>{

    try{
        const users = await User.find({})

        /* return response */
        usersFiltered = users.filter((user)=>{
            delete Object.values(user)[5].password
            delete Object.values(user)[5].__v
            return user
        })

        res.status(200)
        res.json({
            "msg": "success",
            "code": 200,
            "records": users.length,
            "response": {data: usersFiltered}
        })
    }
    catch(error){
        error.status = 500
        next(error)
    }
}

/* get one */
exports.getOne = async (req, res, next) => {

    try{

        const id = req.params.id;

        /* get user */
        const user = await User.findOne({_id: id})

        /* return response */
        delete Object.values(user)[5].password
        delete Object.values(user)[5].__v

        res.status(200)
        res.json({
            "msg": "success",
            "code": 200,
            "records": 1,
            "respose": {data: user}
        })
    }
    catch(error){
        error.message = 'record not found'
        error.status = 404
        next(error)
    }
}

/* update one */
exports.updateOne = async (req, res, next) => {

    try{
        /* get id */
        const id = req.params.id;

        /* set update object */
        let updateData = {}
        let key  = Object.keys(req.body);
        let values = Object.values(req.body);
        /* get fields */
        for(var i=0; i < values.length; i++){
            if(values[i] != '' && values[i] != null){
                updateData[key[i]] = values[i]
            }
        }

        /* update data */
        const result = await User.updateOne({_id: id}, {$set: updateData})

        switch(result.nModified){
            case 1:
                const user = await User.findOne({_id: id})
                /* return response */
                delete Object.values(user)[5].password
                delete Object.values(user)[5].__v
                const resultObj = {msg: "successfully updated record", id: user.id, email: user.email}
                res.status(200)
                res.json({
                    "msg": "success",
                    "code": 200,
                    "records": 1,
                    "respose": {data: resultObj}
                })
            case 0:
                const error = new Error("Nothing to update")
                error.status = 400
                next(error)
        }
        

    }
    catch(error){
        error.status = 500
        error.message = "Internal server error"
        next(error)
    }
}

/* chnage password */
exports.changePassword = async (req, res, next) => {

    try{
        /* get and set vairables */
        const id = req.params.id;
        const newPassword = req.body.newPassword
        const oldPassword = req.body.oldPassword;

        const user = await User.findOne({_id: id})

        switch(user != null){
            case true:
                const passwordMatch = await bcrypt.compare(oldPassword, user.password)
                switch(passwordMatch){
                    case true:
                        switch(newPassword.length >= 5){
                            case true:
                                const passwordHash = await bcrypt.hash(newPassword, 8)
                                const result = await User.updateOne({_id: id}, {$set: {password: passwordHash}})
                                switch(result.nModified){
                                    case 1:
                                        /* return response */
                                        delete Object.values(user)[5].password
                                        delete Object.values(user)[5].__v
                                        const resultObj = {msg: "successfully updated record", id: user.id, email: user.email}
                                        res.status(200)
                                        res.json({
                                            "msg": "success",
                                            "code": 200,
                                            "records": 1,
                                            "respose": {data: resultObj}
                                        })
                                        break;
                                    case 0:
                                        const error = new Error("Nothing to update")
                                        error.status = 400
                                        next(error)
                                        break;
                                }
                                break;
                            case false:
                                const error = new Error("password must be greater than 5 charecters")
                                error.status = 400
                                next(error)
                                break;
                        }
                        break;
                    case false:
                        const error = new Error("Record not found")
                        error.status = 400
                        next(error)
                        break;
                }
                break;
            case false:
                const error = new Error("Record not found")
                error.status = 400
                next(error)
                break;
        }

    }
    catch(error){
        error.status = 500
        next(error)
    }
}