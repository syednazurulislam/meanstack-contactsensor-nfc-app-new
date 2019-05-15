//importing the mongofunction page
const MongoDB = require('./mongofunction');
//importing the ecpochtoist
const ecpochtoist = require('./EPOCHtoIST');
//importing the multichain config details
 var MultichainConfig = require('../config/MultichainConfig.json');

const assert = require('assert');
var state = {};
var tracking = [];
var addressArray = [];
var timearray = [];
transactionarray = [];
productslist=[]
let AssetName="anyname";
//connector to multichain
let multichain = require("multichain-node")(MultichainConfig);
//getting the mutichain getinfo
multichain.getInfo((err, info) => {
  if (err) {
    throw err;
  }
  console.log(info);
})



//this function will create 3 address in multichain
function getThreeAddress() {
  return new Promise((resolve, reject) => {
    multichain.getNewAddress()
      .then(address => {
        assert(address, "Could not get new address")
        state.address1 = address;
        multichain.getNewAddress()
          .then(addresss => {
            assert(address, "Could not get new address")
            state.address2 = addresss;
            multichain.getNewAddress()
              .then(addresss => {
                assert(address, "Could not get new address")
                state.address3 = addresss;
                if (state.address3) {
                  multichain.grant({
                    addresses: state.address1,
                    permissions: "send,receive,create,issue"
                  })
                  multichain.grant({
                    addresses: state.address2,
                    permissions: "send,receive"
                  })
                  multichain.grant({
                    addresses: state.address3,
                    permissions: "send,receive"
                  })


                }



                Promise.all([state.address1, state.address2, state.address3]).then(data => {
                  resolve({ 'BlockChainValidAddress': data[0], 'BlockChainReturnAddress': data[1], 'BlockChainDeliveryAddress': data[2] });

                }, (err) => {
                  reject(0)
                })
              })
          })
      })
  })
}




//this function will create the asset with product details
function CreateAsset(data, address) {
  console.log("im in create asset " + data.productid);
  console.log("im in create asset " + address);

  return new Promise(function (resolve, reject) {
    multichain.issue({
      address: address,
      asset: {
        name: data.productid,
        open: false
      },
      qty: 1,
      units: 1,
      details: data
    }).then(res => {
      console.log(res);
      //miltichain.subscribe function is used to subscribe the asset
      //subscribing the asset, so we can see the asset transaction in future
      multichain.subscribe({ "asset": data.productid }).then(subscribe => {
        console.log(subscribe + " this is from subscribe");
        if (subscribe == null) {
          resolve("subscribe"); 
        }
      }).catch(err => {
        console.log(err);
        resolve(err);
      })
    }).catch(err => {
      console.log(err);
      resolve(err);
    })
  })
}





//this function is for asset  details
function assetdetails(tagid) {
  return new Promise(function (resolve, reject) {
    multichain.listAssets({ asset: tagid }).then(res => {
      //console.log(res);
      // console.log(res[0].details);
      var details = res[0].details;
      resolve(details);
    })

  })
}


//this function will do asset transfer 
function assettransfer(data) {
  console.log(data);
  return new Promise(function (resolve, reject) {
    multichain.sendAssetFrom({ from: data.fromAddress, to: data.toAddress, asset: data.productId, qty: 1 }).then(tx => {
      console.log(tx);
      resolve(tx);
    }).catch(err => {
      console.log(err);
     // reject(err);
     resolve("Asset not available");
    })
  })
}


//for testing
//this function will list the product details
function myAssetsloop(BlockChainValidAddress) {
  console.log("im in myassets " + BlockChainValidAddress);
  return new Promise(function (resolve, reject) {
    multichain.getAddressBalances({ address: BlockChainValidAddress }).then(assetlist => {
      console.log("this from the multichain.js myassets " + assetlist);

      resolve(assetlist);
    })
  })
}



//this function will list the product details
function myAssets(BlockChainValidAddress) {
  console.log("im in myassets " + BlockChainValidAddress);
  return new Promise(function (resolve, reject) {
    multichain.getAddressBalances({ address: BlockChainValidAddress }).then(assetlist => {
      console.log("this from the multichain.js myassets " + assetlist);
      resolve(assetlist);
    })
  })
}


//this function find the asset in the multichain
function findasset(assetId, mongodata, tagstatus) {
  console.log("in findasset fucction");
  return new Promise(function (resolve, reject) {
    console.log(assetId);
    multichain.listAssets({ asset: assetId }).then(result => {
      console.log("===========*===========");
      console.log(result);
      console.log("===========*===========");
      console.log("exist in multichain");
      resolve({ status: tagstatus, multichain: "DataExist", mongo: mongodata, details: result[0].details });
      //resolve("result");

    }).catch(err => {
      if (err.code == "-708") {
        resolve({ status: tagstatus, multichain: "DataDoNotExist", mongo: mongodata });
      }

    })
  })
}
// this function get all the transactions in th address 

function knowaddresstransactions(Address){
  return new Promise(function(resolve,reject){
    multichain.listAddressTransactions({address:Address }).then(result =>{
      console.log(result);
      var loop=0;
      this.productslist.length=0;
      while(result[loop]){
        var balances= result[loop].balance.assets[0];
this.productslist.push(balances);

        
        loop++;
      }
      console.log(this.productslist);
      resolve(this.productslist);
    })
  })
}


//this function get the all Transactions of the asset from multichain
function getAssetTransactions(productid) {
  console.log("in getAssetTransactions " + productid);


  return new Promise(function (resolve, reject) {
    multichain.listAssetTransactions({ asset: productid }).then(result => {
      console.log(result);

      var looper = 0;
      tracking.length = 0;
      while (result[looper]) {

        var addressfull = result[looper].addresses;
        if (addressfull[Object.keys(addressfull)[0]] == 1||addressfull[Object.keys(addressfull)[0]] == 0) {
          var AddressOfCity = Object.keys(addressfull)[0];
        } else {
          var AddressOfCity = Object.keys(addressfull)[1];
        }
        var transactionId = result[looper].txid;
        var epochtime = result[looper].timereceived;

        var trackingData = { cityAddress: AddressOfCity, time: epochtime, transactionid: transactionId }
        tracking.push(trackingData);

        looper++;
      }
      resolve(tracking);
    })
  })

}


//address Transactions
function productListAddressTransactions(inputaddress) {

  return new Promise(function (resolve, reject) {

    multichain.listAddressTransactions({
      address: inputaddress
    }).then(result => {
      console.log(result+"this is known");
    })
  })
}







//to find the total number of product in multichain
function TotalProduct(){
  return new Promise(function (resolve, reject) {
    multichain.listAssets().then(result=>{
      console.log("im in multichain total products"+result);
      resolve(result);
    })
  })
}




//to featch the details tamper address and non-tamper address;
async function assetoncity(data){
var looper=0;
var assetonaddress=[];
while(data[looper]){
  var ValidAddressproducts = await myAssets(data[looper].BlockChainValidAddress);
  var NotValidAddressproducts = await myAssets(data[looper].BlockChainReturnAddress);
  var cityname = data[looper].BranchName;
  var productonvaildaddress=ValidAddressproducts.length;
  var productonretunaddress=NotValidAddressproducts.length;
  var assetoncity={cityname:cityname,productonvaildaddress:productonvaildaddress,productonretunaddress:productonretunaddress};
  assetonaddress.push(assetoncity);
  looper++;
}
return assetonaddress;

}

//to get all asset details to dashboard
function gettotalassets(){
  return new Promise(function (resolve, reject) {
    multichain.listAssets().then(op=>{
      resolve(op);
    })
  })
  
}


// module.exports.knowaddresstransactions=knowaddresstransactions;
// module.exports.getThreeAddress = getThreeAddress;
// module.exports.myAssets = myAssets;
// module.exports.CreateAsset = CreateAsset;
module.exports.findasset = findasset;
module.exports.assetoncity = assetoncity;

// module.exports.testing = testing;
// module.exports.getAssetTransactions = getAssetTransactions;
// module.exports.assetdetails = assetdetails;
// module.exports.assettransfer = assettransfer;
// module.exports.productListAddressTransactions = productListAddressTransactions;

module.exports={
  knowaddresstransactions,getThreeAddress,myAssets,CreateAsset,getAssetTransactions,assetdetails,
  assettransfer,productListAddressTransactions,myAssetsloop,TotalProduct,gettotalassets
}