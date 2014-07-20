/* 
    takes values w/ properties collection, label, property, value, and label with property collection, property, value
    generates columns
*/

function generateColumns( response, values, label )
{	
	var labelVals = getFormattedValues( response, 'x', label.collection, label.property, label.value );
	var columns = [ labelVals ];

	for ( var i = 0; i < values.length; i++ )
	{
		var currentValue = values[ i ];
		var label = currentValue.label;
		var collection = currentValue.collection;
		var property = currentValue.property;
		var value = currentValue.value;

		var toPush = getFormattedValues( response, label, collection, property, value );
		columns.push( toPush );
	}

	return columns;
}

function generateAxisObject ( response, label, xLabel, yLabel )
{
	var axis = { };
	var categories = getFormattedValues( response, false, label.collection, label.property, label.value );
	axis.x = { label: xLabel, type: "categorized", categories: categories };
	axis.y = { label: yLabel };

	return axis;
}

/* generates data object */

function generateDataObject( response, chartType, values, label )
{
	var data = { };
	var columns = generateColumns( response, values, label );

	data.columns = columns;
	data.x = 'x';
	data.type = chartType;

	return data;
}

// creates an array given a kimono response, label, and specific value to find

function getFormattedValues( response, label, collection, property, value )
{
	var values = [ ];
	if ( label != false )
	{
		values = [ label ];
	}
	
	var collectionSet = response.results[ collection ];

	for ( var i = 0; i < collectionSet.length; i++ )
	{
		var collectionObj = collectionSet[ i ];
		var propertyObj = collectionObj[ property ];
		var toPush = propertyObj;
		if ( value != undefined )
		{
			toPush = propertyObj.value;
		}

		toPush = formatValue( toPush );
		values.push( toPush );
	}

	return values;
}

// formats to number, if number

function formatValue( value )
{
	if ( !isNaN( value ) )
	{
		return parseFloat( value );
	}

	return value;
}

/* 
   values is an array of objects with label/collection/property/value properties
   label is an object with collection/property/value properties
   chartType is "line", "bar", "scatter", or "donut"
   response is the kimono response 
*/

function renderChart( response, chartType, values, label, xLabel, yLabel, title )
{
	var data = generateDataObject( response, chartType, values, label );
	var axis = generateAxisObject( response, label, xLabel, yLabel );
	console.log( data );
	console.log( axis );

	chart = c3.generate( 
	{ 
		bindto: "#chart",
		data: data, 
		axis: axis 
	} );
}

function reloadChart( response, chartType, values, label, xLabel, yLabel, title )
{
	var data = generateDataObject( response, chartType, values, label );

	chart.load( data );
}

