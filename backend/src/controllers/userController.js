const Users = require("../models/userModel")
const Session = require("../models/sessionModel")
const mongoose = require("mongoose")
const { uuid } = require('uuidv4');

const bcrypt = require('bcrypt');

const userSignUp = async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    // Check if the email already exists in the database
    const hasEmail = await Users.findOne({ email });

    if (hasEmail) {
        return res.status(400).json({ message: 'Os dados introduzidos não são válidos.', errors: { email: 'O endereço introduzido já está registado.' } });
    }

    // Check if the passwords match
    if (password !== passwordConfirmation) {
        return res.status(400).json({ message: 'Os dados introduzidos não são válidos.', errors: { passwordConfirmation: 'As passwords não coincidem.' } });
    }

    try {
        console.log(1)
        const user = await Users.create({ email, password, passwordConfirmation });
        res.status(201).json({messsage:"Utilizador criado com sucesso","_id": user._id});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(2)
    }
}


const userLogin = async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await Users.findOne({ email });

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'O utilizador não foi encontrado!' });
    }

    // Compare the passwords
    /* const isPasswordValid = await bcrypt.compare(password, user.password); Nao esta a funcionar*/
    const isPasswordValid = password === user.password //nao e seguro

    // Check if the password is correct
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'A password introduzida é inválida!' });
    }

    // Generate a token (using the user's _id as the token)
    const token = uuid();

    // Create a new session with the token
    await Session.create({ userId: user._id, token });

    // Return the token in the response
    res.status(200).json({ token });
}



const getUser = async (req, res) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization;

    // Check if the token is not received
    if (!token) {
        return res.status(401).json({ message: 'Não foi enviado o token de autenticação!' });
    }

    // Find the session with the token
    const session = await Session.findOne({ token });

    // Check if the session with the token is not found
    if (!session) {
        return res.status(403).json({ message: 'Não existe nenhuma sessão com o token indicado!' });
    }

    // Find the user by the userId in the session
    const user = await Users.findById(session.userId);

    // Check if the user is not found
    if (!user) {
        return res.status(404).json({ message: 'O utilizador não foi encontrado!' });
    }

    // Return the user's _id and email
    res.status(200).json({ _id: user._id, email: user.email });
}
const getUserById = async (req,res) => {

}



module.exports = {
    userSignUp,
    userLogin,
    getUser,
    getUserById
}