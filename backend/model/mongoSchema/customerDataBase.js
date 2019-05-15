var mongoose= require('mongoose');
const CustomerDBSchema=mongoose.Schema({
  
  BarCodeNumber:{
    type:String,
    require:true
  },
  ProductId:{
    type:String,
    require:true
  },

  ProductName:{
    type:String,
    require:true
  },
  ProductModel:{
    type:String,
    require:true
  },
  placeOfManufacturer:{
  type:String,
  require:true
},

});

const customerDB=module.exports=mongoose.model('customerDB', CustomerDBSchema);