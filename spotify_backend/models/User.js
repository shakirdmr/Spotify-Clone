const mongoose = require('mongoose');


const User = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
       

        email:{
            type:String,
            required:true,
        },
        password: {
            type: String, // Add the password field
            required: true,
          },

        username:{
            type:String,
            required:true,
        },

        likedSongs:{
            type:String,
            default:"",
        },
        likedPlaylists:{
            type:String,
            default:"",
        },

        subscribedArtists:{
            type:String,
            default:"",
        },
    }
);

const UserModal = mongoose.model("User",User);

module.exports = UserModal;