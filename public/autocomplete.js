
/**
 * This file manage autocomplete for departure and arrival input
 */

var places = []
var placesDep = []
var placesArr = []
var departure
var arrival
isStart = false
var inputDep;
var inputArr;
var depPlacesOb =[]
var arrPlacesOb =[]
var depPlacesNames =[]
var arrPlacesNames =[]

$(document).ready(function() {

    // getting the 10 first  started by input value for departure
    $('#inputDep').on('input',function(e){
        depPlacesNames = []

        getAutocompleteData($('#inputDep').val(),true);
        $( "#inputDep" ).autocomplete({
            source:  depPlacesNames
        });
    });

    // getting the 10 first  started by input value for arrival
    $('#inputArr').on('input',function(e){
        arrPlacesNames = []
        getAutocompleteData($('#inputArr').val(),false);
        $( "#inputArr" ).autocomplete({
            source:  arrPlacesNames
        });
    });

    // take date from date input
    $('#date').datepicker( {
        onClose: function(date) {

        },
        selectWeek: true,
        inline: true,
        startDate: '01/01/2000',
        firstDay: 1
    });

    // take time from time input

    $('#time').timepicker({
        'timeFormat': 'HH:mm',
        startTime : '00:00',
    });
})