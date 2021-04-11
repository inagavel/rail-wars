places = []
key1 = 'af864a51-8558-433b-a2f2-8da73be63d61'
key2 = '08f0fdf0-8f0a-43e5-9850-c83607a4237b'
key3 = 'fb897a73-e3d9-4e84-8243-e34362942d99'
var nbElement = 0
const MAX = 10
$(document).ready(function(){

    $( "#search" ).click(function() {
        console.log('search')
        $( "#message" ).hide();
        $('#table').hide()
        var depVal =$('#inputDep').val()
        var arrVal = $('#inputArriv').val()
        if( depVal!='' && arrVal !='' && $('#date').val() !=''&& $('#time').val() !=''){
            console.log('departure' + departure)
            console.log('arrival' +arrival)
            var date  = new Date($('#date').val());
            var time = $('#time').val().split(':');
            date.setHours(time[0])
            date.setMinutes(time[1])
            getJourney(departure.lon, departure.lat, arrival.lon, arrival.lat,date.toJSON())
        }
        else
        {
            alert("Please complete all information")
        }
    });

    getdata();

    function getdata(){
        $.ajax({
            url:'place/getPlaces',
            method:'get',
            dataType:'json',
            success:function(response){
                 if(response.msg=='success'){
                     if(response.data==undefined || response.data==null || response.data=='')
                     {
                         getStuff(1)
                     }
                 }
            },
            error:function(response){
                console.log(response)
                alert('server error');
            }
        });
    }

    function getStuff(page)
    {
        var api_url = 'https://api.sncf.com/v1/coverage/sncf/stop_areas?count=500&start_page='+page
        $.ajax({
            url: api_url,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", key3)
            }, success: function(data){

                $.each(data.stop_areas, function(i, item) {
                    nbElement++;
                    $.ajax({
                        url: 'place/addPlaces',
                        method: 'post',
                        dataType: 'json',
                        data: {name: item.name, label: item.label, lon: item.coord.lon, lat: item.coord.lat},
                        success: function (response) {
                            if (response.msg == 'success') {
                            } else {
                                alert('some error occurred try again');
                            }
                        },
                        error: function (response) {
                            console.log('server error occured' + response)
                        }
                    });
                })
               if(data.pagination.items_on_page > 0){
                    getStuff(page+1);
                }

            }, error: function (response) {
                if(response.status === 429)
                    alert('SNC Quota limit reached change the key or tray again tomorrow')
            }
        })
    }

    function formatHour(navitiaDate) {
        return navitiaDate.substr(9).match(/.{2}/g).join(':');
    }

    function getJourney(deplon, deplat, arrlon, arrlat,datatime)
    {
        console.log("Journey")
        var api_url = 'https://api.sncf.com/v1/coverage/sncf/journeys?from='+deplon+';'+deplat+'&to='+arrlon+';'+arrlat+"&datetime="+datatime+"&min_nb_journeys="+MAX
        $.ajax({
            url: api_url,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", key3)
            }, success: function(data){
                console.log(data)
                console.log(api_url);
                var $tbody = $('tbody').empty();
                if(data.error)
                {
                    $( "#message" ).show();
                    $('#table').hide()
                }
                else{
                    $.each(data.journeys, function(i, journey)
                    {
                        var $tr = $('<tr>');
                        $tr.append($('<td>').html(formatHour(journey.departure_date_time)));
                        $tr.append($('<td>').html(formatHour(journey.arrival_date_time)));
                        $tr.append($('<td>').html(journey.duration));
                        $tbody.append($tr);


                    });
                    $('#table').show()
                    $( "#message" ).hide();
                }

            }
        })
    }
});
function getAutocompleteData(start) {
    console.log("start : " +start)
    $.ajax({
        url:'place/autocomplete',
        method:'post',
        data: {'start': start},
        dataType:'json',
        success:function(response){
            if(response.msg=='success'){
                $.each(response.data,function(i, item) {
                    places[i] = {name : item.name, lat : item.lat, lon: item.lon, label: item.label}

                })

            }else{
                // alert('some error occurred try again');
            }
        },
        error:function(response){
            console.log(response)
            alert('server error');
        }
    });
}

function findByName(name) {
    for (i = 0; i < places.length; i++) {

        if(i<6){
            console.log(name + " : " + places[i].name)
        }
        if(name  === places[i].name)
        {
            console.log("FIND")
            return Object.assign({}, places[i]);
        }
    }
}