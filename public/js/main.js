jQuery(document).ready(function($) {

	'use strict';

		$(".our-listing").owlCarousel({
			items: 4,
			navigation: true,
			navigationText: ["&larr;","&rarr;"],
		});


		$('.flexslider').flexslider({
		    animation: "fade",
		    controlNav: false,
		    prevText: "&larr;",
		    nextText: "&rarr;"
		});


		$('.toggle-menu').click(function(){
	        $('.menu-responsive').slideToggle();
	        return false;
	    });

			$.getJSON( "http://skyx-api.mariusiordache.me/api/v1/trips/get?clientKey=tkiy538lbkqnzcyjflxcikgxz", function( data ) {
			  var items = [];

				items.push( "<option id='null'>---</option>" );

			  $.each( data, function( key, val ) {
			    items.push( "<option id='" + val + "'>" + val + "</option>" );
			  });

				$("#trips_dropdown").html(items.join( "" ));
			});

			$("#trips_dropdown").change(function(){
				var tripname = $("#trips_dropdown").val();

				loadFlights(tripname);

				$("#displayflights").show();
				$("#addflight").show();
			});

			function loadFlights(tripname)
			{
				$.getJSON( "http://skyx-api.mariusiordache.me/api/v1/trips/get/"+tripname+"?clientKey=tkiy538lbkqnzcyjflxcikgxz", function( data ) {
				  var items = [];

					items.push( "<ul>" );

				  $.each( data, function( key, val ) {
				    items.push( "<li id='" + val.flight_id + "'>Airlines: <strong>" + val.airlines_name + "</strong> <br/> From: <strong>"+val.cityFrom+" ("+val.codeFrom+")</strong> <br/> Destination: <strong>"+val.cityTo+" ("+val.codeTo+")</strong> <a href='#' class='slider-btn'><strong>Book</strong></a> | <a onclick='removeLinkFlightToTrip("+val.flight_id+"); return false;' href='#' class='slider-btn'><strong>Remove</strong></a></li><li>---</li>" );
				  });

					items.push( "</ul>" );

					$("#flights").html(items.join( "" ));
				});
			}

			$.getJSON( "http://skyx-api.mariusiordache.me/api/v1/airports/get?clientKey=tkiy538lbkqnzcyjflxcikgxz", function( data ) {
			  var items = [];

				items.push( "<option id='null'>---</option>" );

				data = shuffle(data);

			  $.each( data.slice(0, 500), function( key, val ) {
			    items.push( "<option id='" + val.id + "'>" +val.cityName+" ("+val.code+")</option>" );
			  });

				$("#add_flight_from").html(items.join( "" ));
				$("#add_flight_to").html(items.join( "" ));
			});

			$.getJSON( "http://skyx-api.mariusiordache.me/api/v1/airlines/get?clientKey=tkiy538lbkqnzcyjflxcikgxz", function( data ) {
			  var items = [];

				items.push( "<option id='null'>---</option>" );

			  $.each( data, function( key, val ) {
			    items.push( "<option id='" + val.id + "'>" + val.airlines_name + "</option>" );
			  });

				$("#add_flight_airlines").html(items.join( "" ));
			});

			function addFlight()
			{
				var airportIdFrom = $("#add_flight_from option:selected").attr("id");
				var airportIdTo = $("#add_flight_to option:selected").attr("id");
				var airlinesId = $("#add_flight_airlines option:selected").attr("id");

				$.getJSON( "http://skyx-api.mariusiordache.me/api/v1/flights/add/"+airportIdFrom+"/"+airportIdTo+"/"+airlinesId+"?clientKey=tkiy538lbkqnzcyjflxcikgxz", function( data ) {
				  var flightId = data;
					var tripName = $("#trips_dropdown").val();

					// supposed to check if flightId is valid. Skipping.
					linkFlightToTrip(flightId, tripName);
				});
			}

			function linkFlightToTrip(flightId, tripName)
			{
				$.getJSON( "http://skyx-api.mariusiordache.me/api/v1/trips/addFlight/"+flightId+"/"+tripName+"?clientKey=tkiy538lbkqnzcyjflxcikgxz", function( data ) {
					var tripName = $("#trips_dropdown").val();
					loadFlights(tripName);
				});
			}

			$("#add_flight_book").click(function(){
				addFlight();
			});

			function shuffle(sourceArray)
			{
		    for (var i = 0; i < sourceArray.length - 1; i++) {
		        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

		        var temp = sourceArray[j];
		        sourceArray[j] = sourceArray[i];
		        sourceArray[i] = temp;
		    }
		    return sourceArray;
			}


});
