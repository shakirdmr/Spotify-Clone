const express = require('express');
const router = express.Router();
const passport = require('passport');
const Song = require('../models/Song');
const User = require('../models/User');


router.post("/create",passport.authenticate("jwt",{session:false}), async (req,res)=>{

    const {name,thumbnail,track} = req.body;

     if(!name || !thumbnail || !track){
        return res.status(403).json({error:"Innsufficient deatisls to create song"});
     }

     const artist = req.user._id;
     const songDetails = {name,thumbnail,track,artist};


     const createSong = await Song.create(songDetails);
     return res.status(200).json( {success:createSong} );

});

//songs i uploaded
router.get('/get/mysongs', passport.authenticate("jwt",{session:false}),
 async (req, res) => {

     const currentUser = req.user;

     const songs = await Song.find({artist: req.user._id}).populate("artist");
     return res.status(200).json({data: songs});
 });


 router.get("/get/artist/:artistId", passport.authenticate("jwt",{session:false}), async (req,res) => {


    const {artistId} = req.params;
   const artist = await User.findOne({_id:artistId});

   

    if(!artist) 
    return res.status(301).json({error:"Artist dosent exsist"});

    const songs = await Song.find({artist: artistId});

    return res.status(200).json({data: songs});
 });

 router.get("/get/songname/:songName", passport.authenticate("jwt",{session:false}), async (req,res) => {

    const songName = req.params.songName;

    //exact name matching. no pattern matching- no regex
    const songs = await Song.find({name: songName});

    return res.status(200).json({data: songs});
 });

module.exports = router;