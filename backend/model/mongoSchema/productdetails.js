var mongoose= require('mongoose');
const productdetailsschema=mongoose.Schema({
  
  TagId:{
    type:String,
    require:true
  },
  BarCodeData:{
    type:String,
    require:true
  },
  TagData:{
    type:String,
    require:true
  },
  ProductDetails:{
    type:String,
    require:true
  },
  parentAddress:{
  type:String,
  require:true
},
  ProductId:{
  type:String,
  require:true
},
ProductModel:{
  type:String,
  require:true
},
ProductName:{
  type:String,
  require:true
},
placeOfManufacturer:{
  type:String,
  require:true
}
});

const details=module.exports=mongoose.model('productdetails', productdetailsschema);