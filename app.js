const { count } = require('console');
const e = require('express');

var express = require('express');
var path = require('path');
var app = express();
let alert = require('alert'); 
const { get } = require('jquery');

var loggedIn;
var loggedInUser;
var loggedInUserData;

///////////////////////////////////////////////////////
///////////////////USED FUNCTIONS//////////////////////
///////////////////////////////////////////////////////
async function insertData(inputUserName,inputPassword,res){
            const { MongoClient } = require("mongodb");                                                                                                                                       
            const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            const client = new MongoClient(url);
            const dbName = "ShopDB";               
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection("Users");                                                                                                                                                        
            let userEntries = {
                "username": inputUserName,
                "password": inputPassword,
                "cart":[]
            }
            const query = { username: inputUserName};
            const count = await col.countDocuments(query);
            if (count>0){
                registrationFailed();
                return;
            }
            else{
                const p = await col.insertOne(userEntries);
                registrationSuccess(res);
            }
            await client.close();
}
async function searchInDataLoginQuery(inputUserName,inputPassword,res){
    const { MongoClient } = require("mongodb");                                                                                                                                       
            const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            const client = new MongoClient(url);
            const dbName = "ShopDB";               
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection("Users");
            const query = {username: inputUserName,password :inputPassword};
            const count = await col.countDocuments(query);
            if (count==1){
                   loginSuccess(res,query);
            }
            else{
                   loginFailed(res);
            }
            await client.close();
}         
async function loginSuccess(res,query){
        loggedIn = true;
        loggedInUser = query;
        getUserAllData(loggedInUser);
        res.redirect('home')
}
async function loginFailed(res){
        alert("You must register first \n Now you will be redirected.");
        res.redirect('registration');
}
async function registrationSuccess(res){
    res.redirect("/")
}
async function registrationFailed(){
    alert("Username exists, Try different Username.");
}
async function addToCart(item,res){
            const { MongoClient } = require("mongodb");                                                                                                                                       
            const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            const client = new MongoClient(url);
            const dbName = "ShopDB";               
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection("Users");
            var myquery = loggedInUser;
            var newvalues = { $push: {cart: item}};
            col.updateOne(myquery, newvalues, async function(err, res) {
                await client.close();
            });
            await getUserAllData(loggedInUser);
            res.redirect('home');
            
}
async function getUserAllData(user){
    const { MongoClient } = require("mongodb");                                                                                                                                       
    const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(url);
    await client.connect();
    const dbName = "ShopDB";  
    const db = client.db(dbName);
    const col = db.collection("Users");
    var data = await col.find().toArray();
    for(i = 0; i < data.length; i++){
        if(data[i].username.localeCompare(user.username) == 0 ){
            if(data[i].password.localeCompare(user.password) == 0){
                loggedInUserData = data[i];
            }
        }
    }
    client.close();
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//////////    GET    //////////
app.get('/',function(req,res){
    res.render('login',{title: "HomePage"})
});
app.get('/books',function(req,res){
    if (loggedIn != undefined){
        res.render('books')
    }
    else{
        res.redirect('/')
    }
    
});
app.get('/boxing',function(req,res){
    
    if (loggedIn != undefined){
        res.render('boxing')
    }
    else{
        res.redirect('/')
    }
});
app.get('/cart',function(req,res){
    if (loggedIn != undefined){
        res.render('cart',{loggedInUserData})
    }
    else{
        res.redirect('/')
    }
});
app.get('/galaxy',function(req,res){
    if (loggedIn != undefined){
        res.render('galaxy')
    }
    else{
        res.redirect('/')
    }
});
app.get('/iphone',function(req,res){
    if (loggedIn != undefined){
        res.render('iphone')
    }
    else{
        res.redirect('/')
    }
});
app.get('/leaves',function(req,res){
    if (loggedIn != undefined){
        res.render('leaves')
    }
    else{
        res.redirect('/')
    }
});
app.get('/home',function(req,res){
    if (loggedIn != undefined){
        res.render('home')
    }
    else{
        res.redirect('/')
    }
});
app.get('/phones',function(req,res){
    if (loggedIn != undefined){
        res.render('phones')
    }
    else{
        res.redirect('/')
    }
});
app.get('/registration',function(req,res){
    res.render('registration')
});
app.get('/searchresults',function(req,res){
    res.render('searchresults')
});
app.get('/sports',function(req,res){
    if (loggedIn != undefined){
        res.render('sports')
    }
    else{
        res.redirect('/')
    }
});
app.get('/sun',function(req,res){
    if (loggedIn != undefined){
        res.render('sun')
    }
    else{
        res.redirect('/')
    }
});
app.get('/tennis',function(req,res){
    if (loggedIn != undefined){
        res.render('tennis')
    }
    else{
        res.redirect('/')
    }
});
//////////   POST    //////////

app.post('/',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    searchInDataLoginQuery(username, password,res);
});

app.post('/register',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if (username.length == 0){
        alert("Choose a username.");
    }
    else{
        if(password.length < 8){
            alert("Password must be atleast 8 Chars.");
        }else{
            insertData(username,password,res);
        }
    }
});
app.post('/iphone',function(req,res){
    addToCart('iphone',res);
});

app.post('/galaxy',function(req,res){
    addToCart('galaxy',res);
});

app.post('/leaves', function(req, res){
    addToCart('leaves',res);
});

  app.post('/sun', function(req, res){
    addToCart('sun',res);
});

  app.post('/boxing', function(req, res){
    addToCart('boxing',res);
});

  app.post('/tennis', function(req, res){
    addToCart('tennis',res);
});
app.post('/search',function(req, res){
    var inventory = ['iphone','galaxy','leaves','sun','boxing','tennis']
    let searchWord = (req.body.Search).toLowerCase();
    var hasItem = inventory.includes(searchWord);
    if (hasItem == true){
        console.log(searchWord);
        res.render("searchresults", {searchWord})
    }else{
        alert("Not Found!")
    }
  })

if(process.env.PORT){
    app.listen(process.env.PORT,function(){console.log('Server Started')});
}else{
    app.listen(3000,function(){console.log('Server started on Port 3000')});
}
