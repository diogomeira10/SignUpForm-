const Users = require("../models/userModel")
const mongoose = require("mongoose")

const userSignUp = async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    // Check if the email already exists in the database
    const hasEmail = await Users.findOne({ email });

    if (hasEmail) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if the passwords match
    if (password !== passwordConfirmation) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const user = await Users.create({ email, password, passwordConfirmation });

        // Return the user
        res.status(201).json(user);
    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const userLogin = async (req,res) => {
    
}
const getUser = async (req,res) => {

}
const getUserById = async (req,res) => {

}



module.exports = {
    userSignUp,
    userLogin,
    getUser,
    getUserById
}