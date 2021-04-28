const mongoose = require('mongoose')
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

module.exports.getPlace = (cb)=>{
    placeModel.find((err,placeData)=>{
        if(err){
            cb(err,null);
        }else{
            cb(null,placeData);
        }
    });
}

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

module.exports.addPlaces = (place,cb)=>{
    place.save((err,placeData)=>{
        if(err){
            cb(err,null);
        }else{
        }
    });
}