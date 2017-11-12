var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var darwin=new Schema(
{
search_keyword:
{
  type:String
},
search_results:[]
}
);


const darwinModel=mongoose.model('darwin_lab',darwin);


module.exports=darwinModel;
