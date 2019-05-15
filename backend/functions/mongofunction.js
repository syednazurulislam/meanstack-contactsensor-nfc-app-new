//importing schema
const details = require('../model/mongoSchema/productdetails');
const registerusers = require('../model/mongoSchema/userdetails');
const customerDB= require('../model/mongoSchema/customerDataBase');

//importing multichain function's
const multichain = require('./multichain');
//importing epochtime function's
const ecpochtoist = require('./EPOCHtoIST');

var citynamearray=[];
var productlist=[];

const state={};





//when we scan the tag we will be finding whether it is exist in mongo or not 
function findproduct(data,status) {
    console.log(data+" mongo");
    var findThisId = { ProductId: data }
    console.log(findThisId);
    return new Promise(function(resolve,reject){

 details.findOne(findThisId, function (err, products) {
        if (err) {
            res.json(err);
        } else {
            console.log("verifyed");
            console.log(products);
            if(products==null){
             mongodata="DataDoNotExist";
            }else{
             mongodata="DataExist";
            }
            //now same id-data is sent to the multichain.js to check its existence
            multichain.findasset(data,mongodata,status).then(result => {
                resolve(result);
            })


        }

    });
});
}



//this function will find the city name when we pass the address in parameters
function findcity(FindCity){
    console.log("im in find adddress "+FindCity);
    return new Promise(function(resolve,reject){
     
        registerusers.findOne( {$or:[{BlockChainReturnAddress:FindCity},{BlockChainValidAddress:FindCity}]}, function (err, addressDetails) {
               if (err) {
                   console.log(err)
                   reject(err);
               } else {
                   console.log("addressDetails");
                   console.log(addressDetails.BranchName);
                   if(addressDetails.BlockChainValidAddress==FindCity){

                    resolve({BranchName:addressDetails.BranchName,warehouse:"NonTamper"});

                   }else if(addressDetails.BlockChainReturnAddress==FindCity){

                    resolve({BranchName:addressDetails.BranchName,warehouse:"Tamper"});

                   }


               }
           });
            
        
      
       });
       
}




//we will recive transaction data from multichain and convert cityAddress to CityName and EpochTime to ISTTime
async function getTracking(data){
console.log(data);
var looper = 0;
var tracking = [];
while(data[looper]){
  var cityName = await findcity(data[looper].cityAddress);
console.log("im in loop "+cityName);
var ISTTime=ecpochtoist.epocihtoist(data[looper].time);
console.log("time "+ISTTime);
var trackingData = { cityname: cityName.BranchName,warehouse:cityName.warehouse, time: ISTTime, transactionid: data[looper].transactionid }
tracking.push(trackingData);
looper++;
}
return tracking;
}



function findcitylike(input){
    console.log("im in find city like "+input);
    return new Promise(function(resolve,reject){

registerusers.find({BranchName:{'$regex': input}},{BranchName:1,BlockChainValidAddress:1,BlockChainReturnAddress:1,_id:0},function(err,citynameandaddress){
if(err){
    console.log(err)
    reject(err);
}else{
    console.log("citynameandaddress: "+citynameandaddress);
    resolve(citynameandaddress);
}
})
    })
}

function findBarCodeData(data){
    return new Promise(function(resolve,reject){
    var findThisId = { ProductId: data }
    customerDB.findOne(findThisId, function (err, products) {
        if (err) {
            res.json(err);
        } else {
            console.log(products);
            resolve(products);
        }
    })
})
}


// //this function is for all product of particular address
// function ProductsOnAddress(data){
//     return new Promise(function(resolve,reject){

// var address={parentAddress:{'$regex': data}}
//     details.find(address,{TagId:1,_id:0},function (err, products) {
//         if (err) {
//             res.json(err);
//         } else {
//             console.log(products);

//       resolve(products);
//         }

//     });
// })
// }


function testlooper(data){
    return new Promise(function(resolve,reject){
    looper=0;
while(data[looper]){
    var address={ProductId:{'$regex': data[looper].name}}
        details.find(address,function (err, products) {
            if (err) {
                res.json(err);
            } else {
                console.log(products);
                this.productlist.push(products);
            //  resolve(products);
        
            }
    
        });
    looper++;
}
resolve(this.productlist);
    })
}





function FindTheNonTamperAddress(){
    console.log("FindTheNonTamperAddress");
    return new Promise(function(resolve,reject){
    
        registerusers.find({},{BlockChainValidAddress:1,_id:0},function(err,BlockChainValidAddresses){
         if(err){
             console.log(err);
             reject(err);
         }else{
            console.log(BlockChainValidAddresses);
            resolve(BlockChainValidAddresses);
    
         }
        });
    });
    }
    
    
    
    function FindTheTamperAddress(){
        console.log("FindTheTamperAddress");
        return new Promise(function(resolve,reject){
        
            registerusers.find({},{BlockChainReturnAddress:1,_id:0},function(err,BlockChainReturnAddress){
             if(err){
                 console.log(err);
                 reject(err);
             }else{
                console.log(BlockChainReturnAddress);
                resolve(BlockChainReturnAddress);
        
             }
            });
        });
        }

function getAllAddress(){
    console.log("getAllAddress");
    return new Promise(function(resolve,reject){
    
        registerusers.find({},{BlockChainValidAddress:1,BlockChainReturnAddress:1,BranchName:1,_id:0},function(err,citydata){
         if(err){
             console.log(err);
             reject(err);
         }else{
            console.log(citydata);
            multichain.assetoncity(citydata).then(result=>{
                console.log("this is from mul to mongo");
                console.log(result);
                resolve(result);

            })
    
         }
        });
    });
}

// module.exports.ProductsOnAddress = ProductsOnAddress;
/* module.exports.findproduct = findproduct;
module.exports.findcity = findcity;
module.exports.findcitylike = findcitylike;
module.exports.getTracking = getTracking; */

 module.exports={
findproduct,findcity,findcitylike,getTracking,findBarCodeData,testlooper,FindTheNonTamperAddress,FindTheTamperAddress,getAllAddress
 }
