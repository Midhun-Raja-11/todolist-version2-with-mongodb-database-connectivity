const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.set('strictQuery',true);
mongoose.connect("mongodb://127.0.0.1/todolistDB",{usenewUrlParser:true});

const itemSchema = new mongoose.Schema({
       name:String
});

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
      name:"Welcome to our todolist!!!"
});

const item2 = new Item({
     name:"Hit the + button to add to the todolist!!!"
});

const item3 = new Item({
     name:"<-- Hit this button to delete an item!!!"
});

const defaultItems = [item1, item2, item3];


const listSchema = {
    name:String,
    items:[itemSchema]
};

const List = mongoose.model("List",listSchema);

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));



app.get("/",function(req,res){ 

    Item.find({},function(err, foundItems){

        if(foundItems.length === 0){

            Item.insertMany(defaultItems,function(err){
                if(err){
                   console.log(err);
                }else{
                   console.log("Successfully saved default items to Database...");
                }
          })
          res.redirect("/");          
        }else{
            res.render('list',{listTitle : "Today", newListItem : foundItems});         
        }
        
       
    })

})


app.get("/:customListName",function(req,res){
     const customListName = req.params.customListName;



    List.findOne({name:customListName},function(err,foundList){
           if(!err){

            if(!foundList){

                //CREATE A NEW LIST
                const list = new List({
                        name : customListName,
                        items : defaultItems
                     });
                           
                list.save();
                res.redirect("/"+customListName);
            }else{
                 //SHOW AN EXISTING LIST
                 res.render('list',{listTitle : foundList.name, newListItem : foundList.items});
 
            }

           }
    })

})




app.post("/",function(req,res){
    
    const itemName = req.body.newItem;

    const item = new Item({
         name:itemName
    });

    item.save();
    res.redirect("/");
})


app.post("/delete",function(req,res){
    const checkedItemid = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemid,function(err){
          if(!err){
            console.log("Deleted Successfully!!!");
            res.redirect("/");
          }else{
            console.log(err);
          }
    })
})



app.listen(3000,function(){
     console.log("Server is Running at PORT 3000...");
})
