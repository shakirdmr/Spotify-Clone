const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Playlist = require('../models/playlist');
const Song = require('../models/Song');


//route 1
router.post("/create",passport.authenticate("jwt",{session:false}), async (req,res)=>{

const currentUser = req.user;
const {name,thumbnail,songs} = req.body;

if(!name ||!thumbnail || !songs){
    return res.status(301).json({error:"Insufficient data"});
}

const playlistData = { name, thumbnail,songs,owner:currentUser._id, collaborators:[],};

const playlist = await Playlist.create(playlistData);
return res.status(200).json(playlist);

});


//route 2- get playlist by ID
router.post("/get/playlist/:playlistId",passport.authenticate("jwt",{session:false}), async (req,res)=>{

    const playlistId = req.params.playlistId;

    const playlist = await Playlist.findOne({_id:playlistId});

    if(!playlist)
    return res.status(301).json({error:"Invalid Id"});
    else
    return res.status(200).json(playlist);


    });


    //get all playlists made by artist
    router.get("/get/artist/:artistId",passport.authenticate("jwt",{session:false}), async (req,res)=>{

    const artistId = req.params.artistId;
    const artist = await User.findOne({_id:artistId});
  
    if(!artist )
    return res.status(304).json({error:"Invalid artist Id"});

    const playlists = await Playlist.find({owner:artistId});
     return res.status(200).json(playlists);

    });


    router.post("/add/song",passport.authenticate("jwt",{session:false}), async (req,res)=>{

         const currenntUser = req.user;
         const {playlistId,songId} = req.body;

        

         const playlist = await Playlist.findOne({_id:playlistId});
         if(!playlist)
        return res.status(404).json({error:"Playlist dosent exsiste"});


        // console.log(currenntUser+" "+playlistId+" "+songId+" "+playlist.owner);

        //step 1: check if user owns the playlist or is in collabartaors

        if(!playlist.owner===currenntUser._id && !playlist.collaborators.includes(currenntUser._id)){
            return res.status(404).json({error:"Action not allowed"});
        }
 
        //step 2: check if song is valid song

        const song = await  Song.findOne({_id:songId});
        if(!song)
        return res.status(404).json({error:"Song dosent exsiste"});

        //step 3: add the song to the playlist

        if (!playlist.songs) {
            playlist.songs = [];
          }
          
          playlist.songs.push(songId);
        await playlist.save();

        return res.status(200).json(playlist);

    });

module.exports = router;