require('./models/db')
var express     = require('express');
var bodyParser  = require('body-parser');
var path        = require('path');
var $           = require('jquery');

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');
app.engine('ejs', require('ejs').__express);
//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));


//set static folder(public) path
app.use(express.static(path.join(__dirname+'/public')));

//default page load
app.get('/',(req,res)=>{
    res.redirect('/home');
});

//routes
app.use('/',require('./routes/routes'));

const hostname = '127.0.0.1';
const port = 3000;
// server running
app.listen(port,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);

}).setTimeout(5000)