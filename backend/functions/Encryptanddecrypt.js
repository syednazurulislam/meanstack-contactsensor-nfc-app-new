const bcrypt = require('bcryptjs');
const saltRounds = 10;
//this is password encryption function
function encrypt(data){
    return new Promise(function(resolve,reject){
bcrypt.hash(data, saltRounds).then(function(hash) {
    console.log(hash)
    resolve(hash);
});
    })
}
//this function decryp the password and comparing and give the result
function decrypt(data){
    return new Promise(function(resolve,reject){
    bcrypt.compare(data.requestedpassword, data.encryptpassword).then(function(res) {
        // res == true
        resolve(res);
    });
})
}
/* module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt; */
module.exports={
    encrypt,
    decrypt
}