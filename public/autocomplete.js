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

    $('#inputDep').on('input',function(e){
        depPlacesNames = []
        getAutocompleteData($('#inputDep').val(),true);
        $( "#inputDep" ).autocomplete({
            source:  depPlacesNames
        });
    });

    $('#inputArr').on('input',function(e){
        arrPlacesNames = []
        getAutocompleteData($('#inputArr').val(),false);
        $( "#inputArr" ).autocomplete({
            source:  arrPlacesNames
        });
    });

    $('#date').datepicker( {
        onClose: function(date) {

        },
        selectWeek: true,
        inline: true,
        startDate: '01/01/2000',
        firstDay: 1
    });

    $('#time').timepicker({
        'timeFormat': 'HH:mm',
        startTime : '00:00',
    });
})