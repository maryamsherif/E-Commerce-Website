var express = require('express');
var path = require('path');
var session = require('express-session')
var fs =require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var app = express();
let alert=require('alert');

//session setup
app.use(session({secret: 'ssshhhhh',
saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var output;
var sess;

var {MongoClient} = require ('mongodb');
var uri = "mongodb+srv://admin:admin@cluster0.unegl.mongodb.net/firstdb?retryWrites=true&w=majority"
var client= new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});

// mongo atlas connection 
async function  enter(u,res) {
    await client.connect();

  output=await client.db('firstdb').collection('firstcollection').find({username:u.username}).toArray();
  var f=0;
  for(var i =0 ;i< output.length && f==0;i++){
    f=0;
    var z= output[i];
    if (u.username==z.username)
    f=1
    else if (u.username.length===0 || u.password.length===0) 
    f=-1
  }

 if (f==0){
      await client.db('firstdb').collection('firstcollection').insertOne(u);
      alert("Registration was successful! Please Login Now");
      res.redirect('/');
      
   
 }
 else if (f==1) {      
     res.render('registration',{error:"Username is already used , try another one!"});
 }
 else if (f==-1) {
  res.render('registration',{error:" Field cannot be empty"});
 }

  client.close();
}
enter().catch(console.error);



app.get('/',function(req,res){
  
    res.render('login',{error:""});
});


app.post('/',async function(req,res){
  sess=req.session;
  sess.username=req.body.username;
  sess.password=req.body.password;
  //sess.cart=[];
  var x=req.body.username;
  var y=req.body.password;
  output=await client.db('firstdb').collection('firstcollection').find({username:x}).toArray();
  var f = 0; 
  for (var i=0; i<output.length && f==0;i++){
     f=0;
    var z= output[i];
    if ((z.username==x) && (z.password==y)){
      f++;
    }
    if ((z.username==x) && (z.password!=y)){
      f=-1;
    }
  }
  if (f==1){
    res.redirect('/home');
  }
  else  if (f==0) {
    res.render('login', {error: "user not found"});
  }

   else { 
    res.render('login', {error: "incorrect password"});
    
  }


});

app.get('/registeration',function(req,res){

   res.render('registration',{error:""})
  });

  app.post('/registeration', function(req,res){
      
      var x = req.body.username ;
       var y = req.body.password ;
       var user = {username:x,password:y,cart:[]};
        enter(user,res).catch(console.error);
        
    });
  


app.get('/home',function(req,res){
  
  if (req.session.username && req.session.password){
    res.render('home',{error:""})
  }
  else {
    alert("you must login first");
    res.redirect('/?error=you must login first');
  }
});

app.get('/cart',function(req,res){
  if (req.session.username && req.session.password){
  //  res.render('cart',{error:""})
  for (var i=0;i<output.length;i++){
    if (output[i].username==req.session.username){
      req.session.cart=output[i].cart;
      break;
    }
  }
  let cart=req.session.cart;
  res.render('cart',{cart:cart});
 }
  else {
    alert("you must login first");
    res.redirect('/?error=you must login first');
  }
          });


       
app.get('/books',function(req,res){
  if (req.session.username && req.session.password){
    res.render('books',{error:""})
  }
  else {
    alert("you must login first");
    res.redirect('/?error=you must login first');
  }
});

app.get('/phones',function(req,res){          
  if (req.session.username && req.session.password){
    res.render('phones',{error:""})
  }
  else {
    alert("you must login first");
    res.redirect('/?error=you must login first');
  }               
});

app.get('/sports',function(req,res){
  if (req.session.username && req.session.password){
    res.render('sports',{error:""})
  }
  else {
    alert("you must login first");
    res.redirect('/?error=you must login first');
  }
 });

app.get('/boxing',function(req,res){
  if (req.session.username && req.session.password){
    res.render('boxing',{error:""})
  }
  else {
    alert("you must login first");
    res.redirect('/?error=you must login first');
    
  }
});
app.post("/addboxing",function(req,res){
  for (var i=0;i<output.length;i++){
    if (output[i].username==req.session.username){
      req.session.cart=output[i].cart;
      break;
    }
  }
  for (var j=0;j<req.session.cart.length;j++){
    if (req.session.cart[j]=="boxing"){
      alert("item is already added in your cart");
      return;
    }
  }
  req.session.cart.push("boxing");
  update(req.session.cart,req.session.username);
  alert("item added successfully!");
});

app.post("/addtennis",function(req,res){
  for (var i=0;i<output.length;i++){
    if (output[i].username==req.session.username){
      req.session.cart=output[i].cart;
      break;
    }
  }
  for (var j=0;j<req.session.cart.length;j++){
    if (req.session.cart[j]=="tennis"){
      alert("item is already added in your cart");
      return;
    }
  }
  req.session.cart.push("tennis");
  update(req.session.cart,req.session.username);
  alert("item added successfully!");
});

app.post("/addsun",function(req,res){
  for (var i=0;i<output.length;i++){
    if (output[i].username==req.session.username){
      req.session.cart=output[i].cart;
      break;
    }
  }
  for (var j=0;j<req.session.cart.length;j++){
    if (req.session.cart[j]=="sun"){
      alert("item is already added in your cart");
      return;
    }
  }
  req.session.cart.push("sun");
  update(req.session.cart,req.session.username);
  alert("item added successfully!");
});

app.post("/addleaves",function(req,res){
  for (var i=0;i<output.length;i++){
    if (output[i].username==req.session.username){
      req.session.cart=output[i].cart;
      break;
    }
  }
  for (var j=0;j<req.session.cart.length;j++){
    if (req.session.cart[j]=="leaves"){
      alert("item is already added in your cart");
      return;
    }
  }
  req.session.cart.push("leaves");
  update(req.session.cart,req.session.username);
  alert("item added successfully!");
});

app.post("/addiphone",function(req,res){
  for (var i=0;i<output.length;i++){
    if (output[i].username==req.session.username){
      req.session.cart=output[i].cart;
      break;
    }
  }
  for (var j=0;j<req.session.cart.length;j++){
    if (req.session.cart[j]=="iphone"){
      alert("item is already added in your cart");
      return;
    }
  }
  req.session.cart.push("iphone");
  update(req.session.cart,req.session.username);
  alert("item added successfully!");
});

app.post("/addgalaxy",function(req,res){
  for (var i=0;i<output.length;i++){
    if (output[i].username==req.session.username){
      req.session.cart=output[i].cart;
      break;
    }
  }
  for (var j=0;j<req.session.cart.length;j++){
    if (req.session.cart[j]=="galaxy"){
      alert("item is already added in your cart");
      return;
    }
  }
  req.session.cart.push("galaxy");
  update(req.session.cart,req.session.username);
  alert("item added successfully!");
});

async function update (c,u){
  var {MongoClient} = require ('mongodb');
  var uri = "mongodb+srv://admin:admin@cluster0.unegl.mongodb.net/firstdb?retryWrites=true&w=majority"
  var client= new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});

  MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("firstdb");
        var user={username: u};
        var newuser={$set: {cart: c}};
        dbo.collection("firstcollection").updateOne(user, newuser, function(err, res){  
          if (err) throw err;
        console.log("updated");
        db.close();
      });
    }); 

}
  

app.get('/tennis',function(req,res){                         
  if (req.session.username && req.session.password){
    res.render('tennis',{error:""})
  }
  else {
    res.redirect('/?error=you must login first');
  }                     
}); 

app.get('/galaxy',function(req,res){
  if (req.session.username && req.session.password){
    res.render('galaxy',{error:""})
  }
  else {
    res.redirect('/?error=you must login first');
  }
});
               
app.get('/iphone',function(req,res){             
  if (req.session.username && req.session.password){
    res.render('iphone',{error:""})
  }
  else {
    res.redirect('/?error=you must login first');
  }       
});
    
app.get('/leaves',function(req,res){
  if (req.session.username && req.session.password){
    res.render('leaves',{error:""})
  }
  else {
    res.redirect('/?error=you must login first');
  }             
});
                      
 app.get('/sun',function(req,res){                       
  if (req.session.username && req.session.password){
    res.render('sun',{error:""})
   }
  else {
    res.redirect('/?error=you must login first');
  }                   
});
                            

                   

  
app.get('/searchresults',function(req,res){             
  if (req.session.username && req.session.password){
    res.render('searchresults',{searchres:""})
  }
  else {
    res.redirect('/?error=you must login first');
  }                
});

app.post('/searchresults',function(req,res){
  
  var s=req.body.Search;
  let items=[
     {name:'iphone', url:'/iphone', image:'/iphone.jpg'},
    {name: 'galaxy', url:'/galaxy',image:'/galaxy.jpg'},
    {name:'boxing', url:'/boxing', image:'/boxing.jpg'},
    {name:'tennis', url:'/tennis', image:'/tennis.jpg'},
    {name:'leaves', url:'/leaves', image:'/leaves.jpg'},
    {name:'sun', url:'/sun', image:'/sun.jpg'}
  ]
  
  let names=['iphone','galaxy','boxing','tennis','leaves','sun'];
    let searchres= searchItem(names,s);

    console.log(searchres);
    let final=[];

    for (i=0;i<searchres.length;i++){
      for (j=0;j<items.length;j++){
        if (searchres[i]==items[j].name){
          final.push(items[j]);
        }
      }
    }
    // console.log(final);
   res.render('searchresults',{final:final});

});

function searchItem(arr,key,res) {
  
  input=key.toLowerCase();
  let searchres=[];

    console.log(arr);
    console.log(key);
  var f;
   if (key.length==0){
           f=0;
  }
  
  else 
      {
  for (i = 0; i < arr.length; i++) { 
    
      if ((arr[i].toLowerCase().includes(input)))
    {
    //  console.log("item found");
      searchres.push(arr[i]);
    }
      else 
      {
        f=1              
      }
  }
}
    if (f==0){
         alert("Field cannot be empty!");
            }
        else 
            if(searchres.length!=0){
                  //  alert("Item Found!");
                  console.log("item found ");
                        }
    else if (f==1) {
       alert("Item not found");
        }
           return searchres;
}


         

if (process.env.PORT){
    app.listen(process.env.PORT, function() {console.log('Server started')});
}
else {
  app.listen(3000,function() {console.log('Server started on port 3000')});
}
