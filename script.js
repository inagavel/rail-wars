var mydata
var itemsonpage = 0;
var name = null;
var lon = null;
var lat = null;


function getStuff(page)
{
	var api_url = 'https://api.sncf.com/v1/coverage/sncf/stop_areas?count=500&start_page='+page
	$.ajax({
    url: api_url,
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "08f0fdf0-8f0a-43e5-9850-c83607a4237b\n")
    }, success: function(data){
        $.each(data.stop_areas, function(i, item)
		{
			name = item.name;
			lon = item.coord.lon;
			lat = item.coord.lat;
		});
		itemsonpage = data.pagination.items_on_page;
		if (itemsonpage==500) getStuff(page+1);
    }
})
}
//


getStuff(1);




