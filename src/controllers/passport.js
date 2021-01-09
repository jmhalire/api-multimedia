const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('../config/config');
const User = require('../models/user');
const passport = require('passport');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWTSECRET
};

const newStrategy = new Strategy(opts, (payload, done) => {
    try {
        const user = User.findById(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return error;
    }
});

const authenticate = passport.authenticate('jwt', { session: false });

module.exports = {
    newStrategy,
    authenticate
};