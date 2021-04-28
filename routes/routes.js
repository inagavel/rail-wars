/**
 * Here we manage the routes to get and to store data from database and to choose the best view to display data
 */

var express    = require('express');
var placeModel  = require('../models/placeModel');
var router = express.Router();
var i =0


/**
 * home route
 */
router.get('/home',(req,res)=>{
    res.render('index');
});
/**
 * route to  add data to database
 */
router.post('/place/addPlaces',(req,res)=>{

    const obj =  JSON.parse(JSON.stringify(req.body));
    res.json({msg:'success'});

    var place = new placeModel()
    place.name = req.body.name
    place.label = req.body.label
    place.lon = req.body.lon
    place.lat = req.body.lat

    placeModel.addPlaces(place,(err)=>{
        if(err){
            res.json({msg:'error'});
        }else{
            res.json({msg:'success'});
        }
    });
});

/**
 * route to  get data from database
 */
router.get('/place/createDatabase',(req,res)=>{
    placeModel.getPlace((err,placeData)=>{
        if(err){
            res.json({msg:'error'});
        }else{
            res.json({msg:'success',data:placeData});
        }
    });
});
/**
 * route to  get the 10 first places start by place from to database
 */
router.post('/place/autocomplete',(req,res)=>{
    const place = req.body.start
    console.log("place : " + place);
    placeModel.getPlaceForAutocomplete(place,(err,placeData)=>{
        if(err){
            res.json({msg:'error'});
        }else{
            console.log(placeData)
            res.json({msg:'success',data:placeData});
        }
    });
});

module.exports = router;