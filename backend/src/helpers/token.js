const jwt = require("jsonwebtoken");

exports.create = (data)=> {
    try {
        return jwt.sign(data, process.env.JWT_SECRET,{expiresIn: `${process.env.JWT_EXPIRATION_MINUTES}m`});
    } catch (err) {
        throw err;
    }
};

exports.decode = (data)  => {
    try {
        return jwt.verify(data, process.env.JWT_SECRET);
    } catch (err) {
        throw err;
    }
};