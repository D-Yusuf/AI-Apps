import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/UserSchema';

passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    const user = await User.findById(payload.id);
    done(null, user);
}));

export default passport;
