const Users = require("../models/userModel")
const Session = require("../models/sessionModel")
const mongoose = require("mongoose")
const { uuid } = require('uuidv4');

const bcrypt = require('bcrypt');

const userSignUp = async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;


    const hasEmail = await Users.findOne({ email });

    if (hasEmail) {
        return res.status(400).json({ message: 'Os dados introduzidos não são válidos.', errors: { email: 'O endereço introduzido já está registado.' } });
    }

  
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

   
    const user = await Users.findOne({ email });

  
    if (!user) {
        return res.status(404).json({ message: 'O utilizador não foi encontrado!' });
    }

    // Compare the passwords
    /* const isPasswordValid = await bcrypt.compare(password, user.password); Nao esta a funcionar*/
    const isPasswordValid = password === user.password //nao e seguro

    
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'A password introduzida é inválida!' });
    }


    const token = uuid();

    
    await Session.create({ userId: user._id, token });

  
    res.status(200).json({ token });
}



const getUser = async (req, res) => {
   
    const token = req.headers.authorization;

   
    if (!token) {
        return res.status(401).json({ message: 'Não foi enviado o token de autenticação!' });
    }


    const session = await Session.findOne({ token });


    if (!session) {
        return res.status(403).json({ message: 'Não existe nenhuma sessão com o token indicado!' });
    }

  
    const user = await Users.findById(session.userId);

  
    if (!user) {
        return res.status(404).json({ message: 'O utilizador não foi encontrado!' });
    }

   
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