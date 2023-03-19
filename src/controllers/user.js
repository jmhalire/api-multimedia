const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config');

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email },
        config.JWTSECRET //,{expiresIn:86400}
    );
}

const signIn = async(req, res) => {
    const { email, password } = req.body;
    console.log(email,password);
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.json({ value: false, message: 'The user does not exists' });
    }

    const isMathPassword = await user.validPassword(password);

    if (isMathPassword) {
        return res.json({
            value: true,
            token: createToken(user),
            user: { email: email, names: user.names, surnames: user.surnames }
        })
    }

    return res.json({ value: false, message: 'password are incorrect' })
};

const signUp = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ value: false, message: 'The user already exists' });
        }
        const newUser = new User();
        const { email, password, names, surnames } = req.body;
        // set the user's local credentials
        newUser.email = email;
        newUser.password = newUser.encryptPasword(password); // use the generateHash function in our user model
        newUser.names = names;
        newUser.surnames = surnames;

        await newUser.save();

        return res.json({
            value: true,
            token: createToken(newUser),
            user: { email: email, names: names, surnames, surnames }
        });

    } catch (error) {
        return res.json({ error });
    }
}

const getUser = async(req, res) => {
    let id = req.user._conditions._id;
    const dateuser = await User.findById(id);
    return res.json({
        user: {
            id: dateuser._id,
            email: dateuser.email,
            names: dateuser.names,
            surnames: dateuser.surnames,
            createdAt: dateuser.createdAt,
            updatedAt: dateuser.updatedAt
        }
    })
}


const updateUser = async(req, res) => {
    const { id, names, surnames } = req.body;
    const user = await User.findById(id);
    if (user) {
        await User.findByIdAndUpdate(id, { names: names, surnames: surnames });
        return res.status(200).json({ message: 'user successfully updated', names: user.names })
    }

    return res.status(200).json({ message: 'user not found', user: null })

}

module.exports = {
    signIn,
    signUp,
    getUser,
    updateUser
}