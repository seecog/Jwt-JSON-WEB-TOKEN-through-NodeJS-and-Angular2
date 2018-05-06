var express = require("express");
var app = express();
var route = express.Router();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
var jwt = require("jsonwebtoken");
var cors = require('cors');

var originsWhitelist = [
'http://localhost:4200' //this is front end url
];
var corsOptions = {
origin: function(origin, callback){
var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
callback(null, isWhitelisted);
},
credentials:true
}
app.use(cors(corsOptions));

var check = function(req,res,next){
	
	jwt.verify(req.headers.mytoken,'123456',function(err,data) {
		
		if(err){
			res.status(400).json({message : 'Not authorzed'})
		}
		else{
		req.user=data;
		
		}
		next();
	});
		
		
	
}
//app.use(check);
route.get('/test',check,function(req,res,next){
res.json(req.user)

});

route.post('/login',function(req,res){
console.log('Body is ',req.body)
if(req.body.email=="mohan@gmail.com" && req.body.password=="12345"){
    console.log("Correct login")
    var token=jwt.sign(req.body,'123456');
    res.json({token : token})
}
else{
    console.log("Incorrect login")
}
})
app.use('/api',route);
app.listen(3000,function(){
    console.log('Server starts')
})