var lessSheets = [];
var promises = [];
var lessIndex = 0;

$('style').each(function(idx, val)
{
	if ($(val).attr('type') == 'text/less')
	{

		var id = $(val).attr('id')? $(val).attr('id') : 'less-stylesheet-' + (++lessIndex);

		lessSheets.push({'id': id, 'less': $(val).text()});

		$(val).attr({'id': id});
	}
});

$('link').each(function(idx, val)
{
	if ($(val).attr('type') == 'text/less')
	{
		var url = $(val).attr('href');
		var id = $(val).attr('id')? $(val).attr('id') : 'less-stylesheet-' + (++lessIndex);

		var p = $.get( url, function( data ) 
		{
			lessSheets.push({'id': id, 'less': data });
		});
		promises.push(p);

		$(val).attr({'id': id});
	}
});

Promise.all(promises)
.then(() =>
{
	if(lessSheets.length > 0)
	{
		chrome.extension.sendRequest(lessSheets, function(response) 
		{
			$(response).each(function(idx, val)
			{
				if (typeof val.css !== "undefined")
				{
					$('#' + val.id).after($('<style />')
						.text(val.css)
						.attr({'type': "text/css", 'data-less-stylesheet-id': val.id})
					);	
				}
				else
				{
					console.error(val.error);
				}
				
			});
		});
	}
});