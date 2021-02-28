var mydata
$.ajax({
    url: 'https://api.sncf.com/v1/coverage/sncf/commercial_modes ',
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "08f0fdf0-8f0a-43e5-9850-c83607a4237b\n")
    }, success: function(data){
        mydata = data;
        //process the JSON data etc
    }
})