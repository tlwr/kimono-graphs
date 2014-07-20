function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

var params = getQueryParams(document.location.search);
var apiId = params.id;
var apiKey = params.key;
var labelcollection = params.labelcollection;
var labelproperty = params.labelproperty;
var values = params.vals.split(",");
var xaxis = params.xaxis;
var yaxis = params.yaxis;
var type = params.type;
var title = params.title;

function kimonoCallback(data){
    var lab = {};
    lab.collection = labelcollection;
    lab.property = labelproperty;
    var vals = [];
    for(var i = 0; i < values.length; i++){
        var t = values[i].split("|")
        vals.push({collection:t[0],property:t[1],label:t[1]})
    }
    console.log(lab);
    console.log(vals);
    renderChart(data, type, vals, lab, xaxis, yaxis, title );
}

var url = "https://www.kimonolabs.com/api/" + apiId + "?apikey=" + apiKey + "&callback=kimonoCallback";
$.ajax({
    url: url,
    crossDomain: true,
    dataType: "jsonp"
});