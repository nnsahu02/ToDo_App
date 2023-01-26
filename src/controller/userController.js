const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')

//validation import
const { isValidName, isValidPassword, isValidEmail } = require('../validation/validation')

//----------------------------------------><< REGISTER USER >><--------------------------------------//
const registerUser = async (req, res) => {
    try {
        const bodyData = req.body //geting request bodydata
        if (typeof (bodyData) == "undefined" || Object.keys(bodyData).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Request body doesn't be empty"
            })
        }
        const { name, email, password } = bodyData //destructuring requestbody

        //name validation
        if (!name) {
            return res.status(400).send({
                status: false,
                message: 'fname is required'
            })
        }
        if (!isValidString(name)) {
            return res.status(400).send({
                status: false,
                message: "Please enter the valid name"
            })
        }
        if (!isValidName(name)) {
            return res.status(400).send({
                status: false,
                message: "Please enter the valid name(SpecialCase & Number is not Allowed)"
            })
        }

        //email validation
        if (!email) {
            return res.status(400).send({
                status: false,
                message: 'email is required'
            })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({
                status: false,
                message: "Please enter the valid email"
            })
        }
        let emailPresent = await userModel.findOne({ email: email })
        if (emailPresent) {
            return res.status(400).send({
                status: false,
                message: "Email is already exist"
            })
        }

        //password validation
        if (!password) {
            return res.status(400).send({
                status: false,
                message: 'password is required'
            })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({
                status: false,
                message: "Password must contain 1 Uppercase and Lowecase letter with at least 1 special charachter , password length should be 8-15 charachter. ex - Rahul@123"
            })
        }

        //hasing password using bcrypt
        bodyData.password = await bcrypt.hash(password, 10)

        //creating user
        const userData = await userModel.create(bodyData)
        return res.status(201).send({
            status: true,
            message: "User created successfully", data: userData
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//--------------------------------------------><< LOGIN USER >><-----------------------------------------//
const login = async (req, res) => {
    try {
        const { email, password } = req.body //getting request body and destructuring

        //email validation
        if (!email) return res.status(400).send({
            status: false,
            message: 'email is required'
        })
        if (!isValidEmail(email)) return res.status(400).send({
            status: false,
            message: "Please enter the valid email"
        })

        //password validation
        if (!password) return res.status(400).send({
            status: false,
            message: 'password is required'
        })

        //unique email check
        const userData = await userModel.findOne({ email: email })
        if (!userData) return res.status(404).send({
            status: false,
            message: "This email is not Registered."
        })

        //verifying password using bcrypt
        let checkPassword = await bcrypt.compare(password, userData.password)
        if (!checkPassword) {
            return res.status(401).send({
                status: false,
                message: "Incorrect Password."
            })
        }

        //creating token using jwt
        const userId = userData._id
        const token = jwt.sign({ userId: userId.toString() }, "strongpassword", { expiresIn: "24h" })
        const data = {
            userId: userId,
            token: token
        }
        return res.status(200).send({ status: true, message: "User login successfull", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { registerUser, login }