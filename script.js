var mydata
var itemsonpage = 0;
var name = null;
var deplon = null;
var deplat = null;
var arrlon = null;
var arrlat = null;
var dep = null;
var arr = null;


function formatHour(navitiaDate) {
  return navitiaDate.substr(9).match(/.{2}/g).join(':');
}

function getJourney(deplon, deplat, arrlon, arrlat)
{
	var api_url = 'https://api.sncf.com/v1/coverage/sncf/journeys?from='+deplon+';'+deplat+'&to='+arrlon+';'+arrlat+"&datetime=20210331T095140&min_nb_journeys=3"
	$.ajax({
    url: api_url,
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "08f0fdf0-8f0a-43e5-9850-c83607a4237b\n")
    }, success: function(data){
        console.log(api_url);
		var $tbody = $('tbody');
		$.each(data.journeys, function(i, journey)
		{
			var $tr = $('<tr>');
			$tr.append($('<td>').html(formatHour(journey.departure_date_time)));
			$tr.append($('<td>').html(formatHour(journey.arrival_date_time)));
			$tr.append($('<td>').html(journey.duration));
			$tbody.append($tr);

			
		});
    }
})
}

function getStuff(page)
{
	var api_url = 'https://api.sncf.com/v1/coverage/sncf/stop_areas?count=500&start_page='+page
	$.ajax({
    url: api_url,
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "08f0fdf0-8f0a-43e5-9850-c83607a4237b\n")
    }, success: function(data){
	
		var $tbody = $('tbody');
		$tbody.empty();
		dep = document.getElementById("departure").value;
		arr = document.getElementById("arrival").value;
		
        $.each(data.stop_areas, function(i, item)
		{
			name = item.name;
			if(name===dep)
			{
				deplon = item.coord.lon;
				deplat = item.coord.lat;
				console.log(name);
			}
			if(name===arr)
			{
				arrlon = item.coord.lon;
				arrlat = item.coord.lat;
				console.log(name);
			}
			
		});
		itemsonpage = data.pagination.items_on_page;
		if(deplon!=null && deplat!=null && arrlon!=null && arrlat!=null && itemsonpage!=500) getJourney(deplon, deplat, arrlon, arrlat);
		if (itemsonpage==500) getStuff(page+1);
    }
})
}





