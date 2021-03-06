var apiData = null;
var onDragStop = function(event, ui) {
    if($(this).parent().attr('id') == 'label-list') {
        $('#label-list').droppable('disable');
        $("#labellabel").fadeOut();
    } else if($(this).parent().attr("id") == "values-list") {
        $("#collectionslabel").fadeOut();
    }
    angular.element("#gown").scope().drawChart();
};
var makeDraggable = function() {
    if($('.property').length) {
        $('.property').draggable({
            revert: 'invalid',
            stop: onDragStop,
        });
    } else {
        setTimeout(makeDraggable, 50);
    }
};
var getLabel = function() {
    if($('#label-list li:first').length) {
        var label = $('#label-list li:first');
        return {
            collection: label.data('collection'),
            property: label.data('property')
        };
    }
    return null;
};
var getValues = function() {
    var values = [];
    $('#values-list').children().each(function(index, child) {
        var collection = $(this).data('collection');
        var property = $(this).data('property');
        values.push({
            collection: collection,
            property: property,
            label: property
        });
    });
    return values;
};
var apiCallback = function(data) {
    apiData = data;
    $scope.title = data.name;
    var collections = data.results;
    var collectionHtml = ['<ul>'];
    for(var collectionName in collections) {
        var objects = collections[collectionName];
        var firstObject = objects[0];
        var propertyHtml = ['<li>' + collectionName + '<ul>'];
        for(var propertyName in firstObject) {
            propertyHtml.push('<li>' + propertyName + '</li>');
        }
        propertyHtml.push('</ul></li>');
        collectionHtml.push(propertyHtml.join(''));
    }
    collectionHtml.push('</ul>');
    $('#collection').html(collectionHtml.join(''));
    $('#start-modal').modal('hide');
};
var testFunction = function(thing) {
    if($(thing).hasClass('property')) {
        console.log("yep");
        return true;
    } else {
        console.log("nope");
        return false
    }
};
$(window).click(function(event){
    var par = $(event.target).parent().attr("id");
    if(par == "values-list" || par == "label-list"){
        var element = $(event.target).detach();
		var parnode = element.attr("data-parent");
        $("#"+parnode).append(element);
        if(par == "label-list"){
            $("#label-list").droppable("enable");
            $("#labellabel").fadeIn();
        } else if($("#values-list").children().length == 0) {
                $("#collectionslabel").fadeIn();
        }
        angular.element("#gown").scope().drawChart();
    }
});
$(document).ready(function() {
    $('#values-list').droppable({
        accept: function (item) {
            var value = $(item).data('value');
            return !isNaN(value);
        },
        tolerance: 'touch',
        activeClass: 'active',
        drop: function(event, ui) {
            $(ui.draggable).detach().css({
                top: 0,
                left: 0,
            }).appendTo(this);
        },
    });
    $('#label-list').droppable({
        tolerance: 'touch',
        activeClass: 'active',
        drop: function(event, ui) {
            $(ui.draggable).detach().css({
                top: 0,
                left: 0,
            }).appendTo(this);
        },
    });
});
angular.module("gown", ["gown.controllers", "gown.services"]).
config([
    function() {}
]);
angular.module("gown.controllers", []).controller("intro", ["$scope", "$http",
    function($scope, $http) {
        $scope.apiId = "3vb13dbw";
        $scope.apiKey = "989877be85a3ca05477428c8b41d4fbe";
        $scope.dirty = false;
        $scope.xaxis = "X Axis";
        $scope.yaxis = "Y Axis";
        $scope.getDirty = function(){return $scope.dirty};
        $scope.connect = function() {
            var url = "https://www.kimonolabs.com/api/" + $scope.apiId + "?apikey=" + $scope.apiKey + "&callback=JSON_CALLBACK";
            $http.jsonp(url).then(function(response) {
                apiData = response.data;
                console.log(JSON.stringify(apiData));
                $scope.title = apiData.name;
                $scope.collections = apiData.results;
                setTimeout(makeDraggable, 500);
                setTimeout($scope.drawChart,1000);
            });
        };
        $scope.drawChart = function(){
            var vals = getValues();
            var lab = getLabel();

            if (lab === null || !vals.length) {
                return;
            }

            if ($scope.dirty) {
                setTimeout(function(){
                    renderChart(apiData, $scope.type, vals, lab, $scope.xaxis, $scope.yaxis, $scope.title);
                },150);
            } else {
                $("#dirtybutton").click();
                setTimeout(function(){
                    renderChart(apiData, $scope.type, vals, lab, $scope.xaxis, $scope.yaxis, $scope.title );
                },150);
            }
        };
        $scope.urlDone = false;
        $scope.type = "line";
        $scope.graphDone = false;
        $scope.share = function(){
            var vals = getValues();
            var lab = getLabel();
            var values = [];
            for(var i = 0; i < vals.length; i++){
                values.push(vals[i].collection + "|" + vals[i].property);
            }
            if(vals.length == 0) return;
            if(lab == {}) return;
            var url = "shared.html?id=" + $scope.apiId +"&key=" + $scope.apiKey + "&labelcollection=" + lab.collection + "&labelproperty=" + lab.property + "&vals=" + values.join(",") + "&xaxis=" + $scope.xaxis +"&yaxis=" + $scope.yaxis + "&title=" + $scope.title + "&type=" + $scope.type;
            window.open(url, '_blank');
        };
    }
]);
angular.module("gown.services", []);
