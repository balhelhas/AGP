const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const sha1 = require('sha1');

import { Database } from './app.database';

export class Security {
    public passport = passport;

    public initMiddleware = (server : any) => {
        server.use(passport.initialize());
    };

    public authorize = this.passport.authenticate('bearer', { session: false });
}

let validPassword = (user: any, password: any) => {
    return sha1(password) === user.password;
}

passport.use(new LocalStrategy((username, password, done) => {
    Database.db.collection('users').findOne({
        username: username
    }).then(user => {
        if (user === null) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        if (!validPassword(user, password)) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        user.token = sha1(user.username+ Date.now());
        Database.db.collection('users')
            .updateOne({_id: user._id}, {$set: {token: user.token}})
            .then(r => r.modifiedCount !== 1 ? done(null, false) : done(null, user))
            .catch(err => done(err));
    }).catch(err => done(err));
}));

passport.use(new BearerStrategy((token, done) => {
    Database.db.collection('users')
        .findOne({token: token})
        .then((user) => user ? done(null, user, {scope:'all'}) : done(null, false))
        .catch(err => done(err));
}));

