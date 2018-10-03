// declare all required arrays
var sites = [];
var countries = [];
var uniqueCountries = [];

// declare all the parts of the website
var homeBody = document.querySelector("#unescoBody");

// StackOverflow https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// function to shuffle the brand array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// function to create all of the cards from the unesco.json index
function sitesToPage(unesco){
    for (var i in sites) {
        var newElement = document.createElement('div');
        newElement.id = sites[i].ident; newElement.className = "cardCase col-sm-12 col-md-6 col-lg-3 "+sites[i].country;
        newElement.innerHTML="<div class='card fluid'><img class='section media' src='"+sites[i].image+
                            "'><div class='section'><a href='"+sites[i].whcSite+
                            "' target='_blank'>"+sites[i].name+"</a><br>"+sites[i].city+", "+sites[i].country+" - "+sites[i].dateVisited+"</div></div>";
        document.getElementById("sitesList").appendChild(newElement);
    }
    document.getElementById("siteCount").innerHTML=sites.length;
}

'use strict';
// search & highlight

;( function( $, window, document, undefined )
{
    var $container = $( '#unescoBody' );
    if( !$container.length ) return true;

    // read unesco.json
    $.ajax({
        async: false,
        beforeSend: function(xhr){
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("application/json");
            }
        },
        url: 'unesco.json',
        data: "",
        accepts:'application/json',
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.sites.length; i++) {
                sites.push( data.sites[i] );
                countries.push( data.sites[i].country );
            }
        }
    })

    // shuffle the cards on the page randomly
    sites = shuffle(sites);

    // add the unesco to the page
    sitesToPage(sites);

    // remove duplicates from category list
    $.each(countries, function(i, el){
        if($.inArray(el, uniqueCountries) === -1) uniqueCountries.push(el);
    });

    // remove undefined from category and sector lists
    uniqueCountries = uniqueCountries.filter(Boolean);

    // fill the categoryPicker list with all available sectors from the index
    $('#countryPicker').empty();
    $('#countryPicker').append($('<option>Pick Country</option>'));
    $.each(uniqueCountries, function(i, p) {
        $('#countryPicker').append($('<option></option>').val(p).html(p));
    });

    var $inputCountry  = $container.find( '#countryPicker' ),
        $items         = $container.find( '.cardCase' ),
        $item          = $(),
        itemsIndexed   = [];
        itemsCountries = [];

    $items.each( function()
    {
        // creates an array of all classes, in lowercase
        itemsIndexed.push( $( this ).text().replace( /\s{2,}/g, ' ' ).toLowerCase() );

        // removes all of the extra classes from the final searchable array
        itemsCountries.push( $( this ).attr('class').replace('cardCase col-sm-12 col-md-6 col-lg-3 ',''));

    });

    // sector picker
    $inputCountry.on( 'change', function( e ){
        console.log(itemsCountries);
        for( var i in itemsCountries ){
            $item = $items.eq( i );
            if ( $inputCountry.val() == "Pick Country")
                $item.removeClass( 'hidden' );
            else if( itemsCountries[i].indexOf( $inputCountry.val() ) != -1)
                $item.removeClass( 'hidden' );
            else
                $item.addClass( 'hidden' );
        }
    });


})( jQuery, window, document );