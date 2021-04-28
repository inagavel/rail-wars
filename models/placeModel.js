const mongoose = require('mongoose')

/**
 * schema to manage data place
 **/
const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'this field is required'
    },
    lat: {
        type: Number,
        required: 'this field is required'
    },
    lon: {
        type: Number,
        required: 'this field is required'
    },
    label: {
        type: String,
        required: 'this field is required'
    },
});


const placeModel = module.exports = mongoose.model('place', placeSchema);

/**
 this method get data from database
 is used to verify if the database has created
 **/
module.exports.getPlace = (cb)=>{
    placeModel.findOne((err,placeData)=>{
        if(err){
            cb(err,null);
        }else{
            cb(null,placeData);
        }
    });
}

/**
 this method get the 10 last places started by place
 from database to help user to complete the search of textfield
 **/
module.exports.getPlaceForAutocomplete = (place,cb)=>{
    placeModel.find({
        //"name": new RegExp(`/${place}$/`, 'i')
        "name": new RegExp(`^${place}`, 'i')
    }, function(err, placeData) {
        if (err) {
            console.log(err)
            cb(err, null);
        } else {

            cb(null, placeData);
        }
    }).limit(10);

}
/**
 this method store to database a place
 is used to create and store database
 **/
module.exports.addPlaces = (place,cb)=>{
    place.save((err,placeData)=>{
        if(err){
            cb(err,null);
        }else{
        }
    });
}