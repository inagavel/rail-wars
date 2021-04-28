require('../models/db')
var placeModel  = require('../models/placeModel');

const assert = require('assert');
describe('Adding data to database', () => {
    it('should return True', () => {
    var isInserted = false;

    var place = new placeModel()
    place.name = 'Paris Saint-Lazare'
    place.label = 'Paris Saint-Lazare (Paris)'
    place.lon =  2.325331
    place.lat =  48.876242
    placeModel.addPlaces(place,(err)=>{
        if(err){
            console.log("error here")
        }else{
            isInserted = true
            console.log('YES BUT I dont know')
        }
        assert.equal(isInserted, true);
    });


    });

    describe('Get the first 10 places started by Par', () => {
        it('should return 10', () => {

            var place = 'Par'
            placeModel.getPlaceForAutocomplete(place,(err,placeData)=>{
                if(err){
                    res.json({msg:'error'});
                }else{

                }
                assert.equal(placeData.length, 10);

                });
            });


        });

    describe('Get All data', () => {
        it('should return True', () => {
            var isOk = false;

            var place = 'Par'
            placeModel.getPlace((err,placeData)=>{
                if(err){
                }else{
                    if (placeData.length > 0 )
                        isOk = true
                }
                assert.strictEqual(isOk, true);
            });
        });
    });
});