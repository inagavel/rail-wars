places = []
key1 = 'af864a51-8558-433b-a2f2-8da73be63d61'
key2 = '08f0fdf0-8f0a-43e5-9850-c83607a4237b'
key3 = 'fb897a73-e3d9-4e84-8243-e34362942d99'
var nbElement = 0
const MAX = 6
var isCreated= false;
page_number = 0
$(document).ready(function(){

    $( "#search" ).click(function() {

        console.log('search')
        $("#result-fail").hide();
        $( "#message" ).hide();
        $('#table').hide()
        $('#map').hide()
        $('#search-fail').hide()
        var depVal =$('#inputDep').val()
        var arrVal = $('#inputArriv').val()
        if( depVal!='' && arrVal !='' && $('#date').val() !=''&& $('#time').val() !=''){
            departure =  findByName( $( "#inputDep" ).val(), depPlacesOb)
            arrival =  findByName( $( "#inputArr" ).val(),arrPlacesOb)
            $('#loader-text').hide()
            var date  = new Date($('#date').val());
            var time = $('#time').val().split(':');
            date.setHours(time[0])
            date.setMinutes(time[1])
            if(departure === undefined || arrival === undefined || departure.name === arrival.name ) {
                $('#search-fail').show()
                return
            }
            $("#loader").show();

            getJourney(departure.lon, departure.lat, arrival.lon, arrival.lat,date.toJSON())
        }
        else
        {
            alert("Please complete all information")
        }
    });


    getdata()




    function getdata(){
        $.ajax({
            url:'place/getPlaces',
            method:'get',
            dataType:'json',
            success:function(response){
                 if(response.msg=='success'){
                     if(response.data==undefined || response.data==null || response.data=='')
                     {
                         document.getElementById("inputArr").disabled = true;
                         document.getElementById("inputDep").disabled = true;
                         document.getElementById("date").disabled = true;
                         document.getElementById("time").disabled = true;
                         $("#loader").show();
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
                if(data.stop_areas) {
                    $.each(data.stop_areas, function (i, item) {
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
                }
                else{
                    $("#loader").hide();
                    $("#db-success").show();
                    setTimeout(function (){


                        // Something you want delayed.
                        $("#db-success").hide();
                        document.getElementById("inputArr").disabled = false;
                        document.getElementById("inputDep").disabled = false;
                        document.getElementById("date").disabled = false;
                        document.getElementById("time").disabled = false;
                    }, 2000);


                }
               if(data.pagination.items_on_page > 0){
                    getStuff(page+1);
                }

              //  $("#loader").hide();
            }, error: function (response) {
                if(response.status === 429)
                    alert('SNC Quota limit reached change the key or tray again tomorrow')
                $("#db-fail").show();
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
                $('#table').empty();
                if(data.error)
                {
                    $( "#message" ).show();
                    $('#table').hide()
                    $('#map').hide()
                }
                else{
                    $.each(data.journeys, function(i, journey)
                    {
                        token1 = formatHour(journey.departure_date_time).split(':')
                        token2 = formatHour(journey.arrival_date_time).split(':')
                        let btnhtml = ' <div class="place-title"> \n' +
                            '           <h4>' +token1[0]+'H'+ token1[1]+' </h4> \n' +
                            '            <img    src="/dir.png" alt="sncf" class="img-dir"> \n' +
                            '            <h4>' +token2[0]+'H'+ token2[1]+' </h4> \n'+
                            '<img    src="/timer.png" alt="timer" class="icon icon-timer"> \n' +
                                            '<h4 class="duration"> '+Math.floor(journey.duration / 60) +' min  </h4>\n' +

                            '        </div>'
                        var button = document.createElement("div");
						button.innerHTML = btnhtml
						button.classList.add("collapsible");
						document.getElementById("table").appendChild(button);
						var cont = document.createElement("div");
						cont.classList.add("content");
						$.each(journey.sections, function(index, section)
						{
							var sect = document.createElement("div");
							sect.classList.add("section");
							var img = document.createElement("img");
							
							if (section.type!="waiting")
							{
								//Departure and Arrival time for the current section
								var dep_hour = document.createElement("div");
								dep_hour.classList.add("hour");
								dep_hour.setAttribute("style", "display: inline");
								var arr_hour = document.createElement("div");
								arr_hour.classList.add("hour");
								arr_hour.setAttribute("style", "display: inline");
								//Description (Departure/Arrival name and mode of transport
								var desc = document.createElement("div");
								desc.classList.add("description");
								desc.setAttribute("style", "display: inline");
								
								dep_hour.innerHTML = "("+formatHour(section.departure_date_time)+")"+"    "
								arr_hour.innerHTML = "    ("+formatHour(section.arrival_date_time)+")"
								sect.appendChild(dep_hour);
								desc.innerHTML = section.from && section.from.name;
								//Changing the image based on the mode of transport
								if (section.mode==="walking")
								{
									img.src = "walk.png"
                                    img.classList.add("icon");
                                    img.setAttribute("alt", "walk");

                                }
								if (section.mode==null && section.type=="transfer" && section.transfer_type=="walking")
								{
									img.src = "walk.png"
									img.classList.add("icon");
                                    img.setAttribute("alt", "walk");

                                }
								if (section.mode==null && section.type=="public_transport")
								{
									img.src = "train.png"
                                    img.classList.add("icon");
                                    img.setAttribute("alt", "train");


                                    //Adding the line information based on the type of train
									if (section.display_informations.physical_mode=="Train grande vitesse")
									{
										desc.innerHTML += "  TGV";
									}
									if (section.display_informations.physical_mode=="RER / Transilien")
									{
										//Line Number / Code
										desc.innerHTML += "  "+section.display_informations.name;
									}
									if (section.display_informations.physical_mode=="TER / Intercités")
									{
										desc.innerHTML += "  TER";
									}
								}
								desc.appendChild(img);
								desc.innerHTML += section.to && section.to.name;
								sect.appendChild(desc);
								sect.appendChild(arr_hour);
							}
							//Sections of type "waiting" don't have any information on arrival and departure so we just add the waiting time in minutes
							if (section.from==null && section.type==="waiting")
							{
								img.src = "wait.png"
								let dur = Math.floor(section.duration / 60);
                                img.classList.add("icon");
                                img.setAttribute("alt", "wait");

                                sect.appendChild(img);
								sect.innerHTML += " "+dur+" minutes";
							}

							
							cont.appendChild(sect);
						});					
						
						document.getElementById("table").appendChild(cont);
                    });
					var coll = document.getElementsByClassName("collapsible");
					var i;

					for (i = 0; i < coll.length; i++) 
					{
					  coll[i].addEventListener("click", function() 
					  {
						this.classList.toggle("active");
						var content = this.nextElementSibling;
						//Toggle for the button to display and hide the content beneath it
						if (content.style.display === "block") 
						{
						  content.style.display = "none";
						} else 
						{
						  content.style.display = "block";
						}
						  const height1 = document.querySelector('#table').offsetHeight
                          const height2 = document.querySelector('#map').offsetHeight
                          let total = height1 + height2 + 50
                          console.log('sum height: ' + height1 + height2)
                          document.getElementById('result').setAttribute('style', 'height:'+total)
                          const height3 = document.querySelector('#result').offsetHeight
                          console.log('result height: ' + height3)
                         // $('#result')

                      });
					}
                    $('#table').show()
                    $('#map').show()
                    $( "#message" ).hide();
                }
                initMap()
                $("#loader").hide();
            }, error:function(response) {
                console.log(response)
                $("#result-fail").show();
                $("#loader").hide();

            }

        })


    }
});
function getAutocompleteData(start,isDep) {
    console.log("start : " +start)
    $.ajax({
        url:'place/autocomplete',
        method:'post',
        data: {'start': start},
        dataType:'json',
        success:function(response){
            if(response.msg=='success'){

                $.each(response.data,function(i, item) {
                    if(isDep)
                    {
                        depPlacesOb[i] = {name : item.name, lat : item.lat, lon: item.lon, label: item.label}
                        depPlacesNames[i] = item.name
                    }
                    else{
                        arrPlacesOb[i] = {name : item.name, lat : item.lat, lon: item.lon, label: item.label}
                        arrPlacesNames[i] = item.name
                    }

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

function findByName(name, places) {
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