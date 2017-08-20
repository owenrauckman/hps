import user from '../models/user';
import config from '../config.json';
import UserSchema from '../models/schemas/user';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = new user();


/* Setup work and export for the JWT passport strategy */
module.exports = (passport)=> {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
    // issuer: 'http://localhost:3000',
    // audience: 'http://localhost:8080'
  };

  passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    UserSchema.findOne({_id: jwt_payload.id}, (err, user)=> {
      if (err) {
        console.log(err);
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
