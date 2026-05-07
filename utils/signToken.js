const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('@/models/User');

function signToken(user){
    return jwt.sign(
        {
          email: user.email, 
          name: user.name,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
            subject: String(user._id), 
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    )
}