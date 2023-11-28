const express = require('express');
const app = express();
const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require('cors');    
const port =8080;

const songsRoutes = require('./routes/song');
const authRoutes  =require('./routes/auth');
const playlistRoutes = require('./routes/playlist');
const passport  = require('passport');
const User = require('./models/User');

require('dotenv').config();

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://ali_boy:"+process.env.MONGO_ATLAS_PASSWORD+"@cluster0.iuevhas.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((x) =>{
    console.log("CONNOCTED TO MONGO");
}).catch((err)=>{
    console.log("ERROR with mongo connection: " + err);
});


//PASSPORT JWT token

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretKey';

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findOne({ id: jwt_payload.sub });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    } catch (err) {
        return done(err, false);
    }
}));
//PASSPORT JWT token


app.get('/', function(req, res) {

    res.send('Welcome');
});
app.use("/song",songsRoutes);

app.use("/auth",authRoutes);

app.use("/playlist",playlistRoutes);


app.listen(port, function(){

    console.log('listening on '+port);
});