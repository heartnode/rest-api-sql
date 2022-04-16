const express = require('express');
const bcryptjs = require('bcryptjs');

const { asyncHandler } = require('../middleware/async-handler');
const {authenticateUser} = require('../middleware/auth-user');
const { User } = require('../models');

const router = express.Router();

router.get('/',authenticateUser, asyncHandler(async (req,res) =>{
    // Get ID from authenticated User and only show firstName, lastName and emailAddress
    const id = req.currentUser.id;
    // Excludes createdAt, updatedAt, Password from the User object.
    const user = await User.findByPk(id, {
        attributes:{
            exclude:['createdAt', 'updatedAt', 'password']
        }
    })
    // Sent back default status 200 
    res.json(user.get({plain:true}));
}));

router.post('/', asyncHandler(async (req,res)=>{
    try{
        //Create User object
        const user = await User.create(req.body);
        //If success send status code 201 and Location header to /
        res.status(201).location('/').end();
    } catch (error){
        // Validation and Unique constraint error message
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    } 
}))

module.exports = router;