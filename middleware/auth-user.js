const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const {User} = require('../models');

exports.authenticateUser = async (req,res,next) => {
    let message;
    // Get authentication information from basic auth
    const credentials = auth(req);

    // If credentials found then look up user
    if (credentials){

        // Find the user from database where email matches with login
        const user = await User.findOne({where:{emailAddress: credentials.name}});
        
        // If User found compare password
        if (user){        
            
            // Authenticate the user if password matches with existing User record
            const authenticated = await bcryptjs.compare(credentials.pass,user.password);
            if (authenticated) {
                // Update reqs object to set the current User
                req.currentUser = user;
            } else {
                // Set message to Authentication failed
                message = 'Authentication failed';
            }
        } else {
            // Set message no User found
            message = 'No user found with the given emailAddress';
        }
    } else {
        // No authentication set
        message = 'Auth header not found';
    }

    if (message){
        console.warn(message);
        res.status(401).json({message: "Access Denied"});
    } else {
        next();
    }
};