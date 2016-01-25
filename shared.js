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
    document.getElementById("title").innerText = title;
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

var url = "https://www.kimonolabs.com/api/" + apiId + "?apikey=" + apiKey;
$.ajax({
    url: url,
    crossDomain: true,
    dataType: "jsonp",
}).then(function(data) {kimonoCallback(data)});


// url shortner
/*!
* jQuery URL Shortener 1.0
* https://github.com/hayageek/jQuery-URL-shortener
*
* Date: 24-Oct-2013
*/
(function ($) {
    var scriptsLoaded = false;
    var clientLoaded = false;

    $.getScript("https://apis.google.com/js/client.js", function () {
        (function checkIfLoaded() {
            if (gapi.client) {
                scriptsLoaded = true;
                gapi.client.setApiKey($.urlShortener.settings.apiKey);
                gapi.client.load('urlshortener', $.urlShortener.settings.version, function () {
                    clientLoaded = true;
                });
            } else window.setTimeout(checkIfLoaded, 10);
        })();
    });


    $.urlShortener = function (options) {

        var settings = {};
        var data = {};
        $.extend(settings, $.urlShortener.settings, options);

        (function checkScriptsAndClientLoaded() {
            if (scriptsLoaded && clientLoaded) {
                if (settings.longUrl != undefined) {
                    longToShort(settings);
                } else if (settings.shortUrl != undefined) //URL info
                {
                    shortUrlInfo(settings);
                }
            } else {
                window.setTimeout(checkScriptsAndClientLoaded, 10);
            }

        })();

        function longToShort(s) {
            var data = {
                'longUrl': s.longUrl
            };
            var request = gapi.client.urlshortener.url.insert({
                'resource': data
            });
            request.execute(function (response) {
                if (response.id != null) {
                    if (s.success) {
                        s.success.call(this, response.id);
                    }
                } else {
                    if (s.error) {
                        s.error.call(this, response.error);
                    }
                }
            });
        }

        function shortUrlInfo(s) {
            var data = {
                'shortUrl': s.shortUrl,
                'projection': s.projection
            };
            var request = gapi.client.urlshortener.url.get(data);
            request.execute(function (response) {
                if (response.longUrl != null) {
                    if (s.success) {
                        if (s.projection == undefined) s.success.call(this, response.longUrl);
                        else s.success.call(this, response);
                    }
                } else {
                    if (s.error) {
                        s.error.call(this, response.error);
                    }
                }

            });

        }

    }
    $.urlShortener.settings = {
        apiKey: '',
        version: 'v1',
    };

}(jQuery));

$( document ).ready( function( )
{   
    jQuery.urlShortener.settings.apiKey = "AIzaSyDtbIgKbs__Zr3o_iv9Oy1MrOB0XCtryQw";
    jQuery.urlShortener({
        longUrl: document.URL,
        success: function (shortUrl) {
            $("#url").val(shortUrl);
        },
        error: function(err)
        {
            console.log(JSON.stringify(err));
        }
    });
} );