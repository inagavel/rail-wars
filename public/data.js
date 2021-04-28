places = []
//Multiple keys for the API in case one of them doesn't work
key1 = 'af864a51-8558-433b-a2f2-8da73be63d61'
key2 = '08f0fdf0-8f0a-43e5-9850-c83607a4237b'
key3 = 'fb897a73-e3d9-4e84-8243-e34362942d99'
//Number of parsed stop areas in the getStuff function
var nbElement = 0
//Number of journeys to request in the getJourney function
const MAX = 6
$(document).ready(function(){
	//When the search is initiated
    $( "#search" ).click(function() {

        console.log('search')
		//Hiding all previous search results
        $("#result-fail").hide();
        $( "#message" ).hide();
        $('#table').hide()
        $('#map').hide()
        $('#search-fail').hide()
		//Getting the departure and arrival names from the input field
        var depVal =$('#inputDep').val()
        var arrVal = $('#inputArriv').val()
		//Checking if the departure and arrival names are correct
        if( depVal!='' && arrVal !='' && $('#date').val() !=''&& $('#time').val() !=''){
            departure =  findByName( $( "#inputDep" ).val(), depPlacesOb)
            arrival =  findByName( $( "#inputArr" ).val(),arrPlacesOb)
            $('#loader-text').hide()
            var date  = new Date($('#date').val());
            var time = $('#time').val().split(':');
            date.setHours(time[0])
            date.setMinutes(time[1])
			//Return an error message on the page if the departure and arrival on the input field are not in the database
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


	//
	//Function to get data into the database if it isn't set up yet thanks to getStuff
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

	//
	//Function to get data from all the stop areas (name of stop area, longitude and latitude)
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
				//Getting the stop areas of the next page if it exists
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
	//
	//Function to transform the obtained date into a readable format
    function formatHour(navitiaDate) {
        return navitiaDate.substr(9).match(/.{2}/g).join(':');
    }
	
	//
	//Function to get and display information on a journey using the longitude and latitude
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
						//Splitting the time to remove the seconds and only have hours and minuts
                        token1 = formatHour(journey.departure_date_time).split(':')
                        token2 = formatHour(journey.arrival_date_time).split(':')
						//Creating a button div with the departure, arrival time and duration of the journey
                        let btnhtml = ' <div class="place-title"> \n' +
                            '           <h4>' +token1[0]+'H'+ token1[1]+' </h4> \n' +
                            '            <img    src="/dir.png" alt="sncf" class="img-dir"> \n' +
                            '            <h4>' +token2[0]+'H'+ token2[1]+' </h4> \n'+
                            '			<img    src="/timer.png" alt="timer" class="icon icon-timer"> \n' +
                            '			<h4 class="duration"> '+Math.floor(journey.duration / 60) +' min  </h4>\n' +
                            '        </div>'
                        var button = document.createElement("div");
						button.innerHTML = btnhtml
						button.classList.add("collapsible");
						//Adding the button to the results table
						document.getElementById("table").appendChild(button);
						//Creating a content div that will be appended to the button
						//The content will be able to be displayed by clicking on the button
						var cont = document.createElement("div");
						cont.classList.add("content");
						//Going through all sections of a journey
						$.each(journey.sections, function(index, section)
						{
							//Creating a section div
							//The content div will be comprised of multiple sections
							//Each section will be comprised of a departure and arrival time and a description
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
								//Description (Departure/Arrival name and mode of transport as an image) for the current section
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
								//Addding everything else to the section
								desc.appendChild(img);
								desc.innerHTML += section.to && section.to.name;
								sect.appendChild(desc);
								sect.appendChild(arr_hour);
							}
							//Sections of type "waiting" don't have any information on arrival and departure so we just add the waiting time in minutes
							if (section.from==null && section.type==="waiting")
							{
								img.src = "wait.png"
								//format the seconds into minutes
								let dur = Math.floor(section.duration / 60);
                                img.classList.add("icon");
                                img.setAttribute("alt", "wait");
                                sect.appendChild(img);
								sect.innerHTML += " "+dur+" minutes";
							}

							//Adding one section to the content div
							cont.appendChild(sect);
						});					
						//Adding the content to the table, this way the table will be comprised of a button followed by a content div followed by a button followed by a content div etc....
						document.getElementById("table").appendChild(cont);
                    });
					//Getting all buttons
					var coll = document.getElementsByClassName("collapsible");
					var i;

					for (i = 0; i < coll.length; i++) 
					{
					//Adding a toggle function for each button
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
						//Recalculating the height of the buttons + cotents + the google map to dynamicaly change the size of the results div
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
				//Google Map
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
//
//Get the first 10 elements starting with the search query for the autocomplete
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
//
//Get an object from a name
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