const jwt = require('jsonwebtoken');

exports = {};

exports.getToken = async (email,user)=>{

    const token = jwt.sign( {identifier:user._id},"secretKey");

    return token;
};

module.exports = exports;



// //VIDEO 7
// const jwt = require('jsonwebtoken'); // Use 'jsonwebtoken' instead of 'jwt'

// module.exports = {
//   getToken: async (email, user) => {

//     const token = jwt.sign({ identifier: user._id }, 'yourSecretKey'); // You need to provide a secret key for JWT signing

//     return token;
//   },
// };
