var mongoose= require('mongoose');
const userdetailsschema=mongoose.Schema({
  UserName:{
    type:String,
    require:true
  },
  BranchName:{
    type:String,
    require:true
  },

  PhoneNumber:{
    type:Number,
    require:true
  },
  Email:{
    type:String,
    require:true
  },
  Password:{
    type:JSON,
    require:true
  },
  BlockChainValidAddress:{
    type:String,
    require:true
  },
  BlockChainReturnAddress:{
    type:String,
    require:true
  },
  BlockChainDeliveryAddress:{
    type:String,
    require:true
  }
});

const registerusers=module.exports=mongoose.model('userregistration', userdetailsschema);