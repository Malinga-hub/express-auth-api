const User = require('../collections/user')
const bcrypt = require('bcrypt')

/* get all */
exports.getAll = (re,res,next)=>{
    res.status(200)
    res.json({
        "msg": "success"
    })
}

/* create user */
exports.register = async (req,res,next)=>{

    try{
        const user = new User(req.body)
        const result = await user.save()

        delete Object.values(result)[5].password
        delete Object.values(result)[5].__v
        res.status(200)
        res.json({
            "msg": "success",
            "code": process.env.SUCCESS_CODE,
            "records": 1,
            "reponse": {data: result}
        })

    }
    catch (error){
        error.action = 'register'
        error.status = 400
        next(error)
    }
}

/* login user */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email: email})

        switch(user != null){
            case true:
                const passwordMatch = await bcrypt.compare(password, user.password)
                switch(passwordMatch){
                    case true:
                        delete Object.values(user)[5].password
                        delete Object.values(user)[5].__v
                        res.status(200)
                        res.json({
                            "msg": "success",
                            "code": 200,
                            "records": 1,
                            "reponse": {data: user}
                        })
                        break;
                    case false:
                       const error = new Error('Login failed. Bad credentials')
                       error.status = 404
                       next(error)

                }
            case false:
                const error = new Error("Login failed. Bad credentials")
                error.status = 404
                next(error)
        }
    } 
    catch (err) {
        const error = new Error("Internal server error. PLease try again later")
        error.status = 500
        next(error)
    }
}
