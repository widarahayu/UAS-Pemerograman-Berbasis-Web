const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedParams) => {
    return await bcrypt.compare(password, hashedParams);
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
};
