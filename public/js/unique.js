$(document).ready(function () {

    addCard();

    function makeCard(index, url, title, description, website) {
        var card = $(
            `
            <div id="card${index}" class="col s6 m4">
                <div class="card">
                    <div class="card-image">
                        <a href="${website}"><img src="${url}"></a>
                        <span class="card-title gradient">${title}</span>
                    </div>
                    <div class="card-content">
                        <strong>${description}</strong>
                    </div>
                </div>
            </div>
            `
        );
        $(".addCardTwo").append(card);
    }

    function addCard() {
        $.get("api/unique", function (data) {
            var arr = []


            for (var i = 0; i < data.length; i++){
                arr.push(data[i].name);
                makeCard(i, data[i].image, data[i].name, data[i].description, data[i].website);
    
            }

            console.log(arr)
            var map;
            var service;
            var infowindow;
            var barNames = arr
            var userLocation;
            var x = 0;

            var queryUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCVf591AZ-evHODFReCvcQ56eAJZecmLgc";

            $.ajax({
                url: queryUrl,
                method: "POST",

            }).then(function(response){
                userLocation = response.location;
                initMap();
            });


            var initMap = function() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: userLocation, "accuracy": 50,
                    zoom: 12
                });
                
                infowindow = new google.maps.InfoWindow();
                service = new google.maps.places.PlacesService(map);
                findplaces();
            }

            function findplaces(){
                service.findPlaceFromQuery({ 
                    query: barNames[x],
                    fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
                },callback);
            }

            function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        console.log(barNames[x] + " found");
                        createMarker(results[i], x);
                    }
                }
                x++;
                if(x < barNames.length){
                    findplaces();
                }
            };

            function createMarker(place, index) {
                var image = '../images/logo2thumb.png'
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow = new google.maps.InfoWindow();
                    console.log(infowindow);
                    infowindow.setContent(
                    `<div id="content"> 
                        <div id="siteNotice"> 
                        </div>

                        <h5 id="firstHeading" class="firstHeading">
                        ` + place.name + `
                        </h5> 
                        
                        <div id="bodyContent"> 

                            <h6>
                            <a href="#card${index}"> 
                            More Info!</a> 
                            </h6>

                            <h6>
                            <a href="https://www.google.com/maps/dir/?api=1&origin=` + userLocation +`&destination=` + place.name + `&travelmode=driving"> Get Directions Here!</a>
                            </h6>

                        </div> 
                    </div>`);
                    infowindow.open(map, this);
                });
            }
        });
    }

    $('.modal-trigger').leanModal();

    $("#submit").on("click", function () {

        //$(AJAX call to api- for searching cheap drinks)

        var barName = $("#name").val();
        var city = $("#city").val();
        var description = $("#description").val();

        var newCityName = city.replace(/\s/g, "+");
        var newbarName = barName.replace(/\s/g, "+");

        queryInput = newbarName + "+" + newCityName;



        var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + queryInput + "&key=AIzaSyCVf591AZ-evHODFReCvcQ56eAJZecmLgc";

        //ajax to get the place id
        $.ajax({
            url: proxyUrl + queryURL,
            method: "GET",

        }).then(function (response) {
            // console.log("AM I RUNNING");


            var queryUrl = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + response.results[0].place_id + "&key=AIzaSyCVf591AZ-evHODFReCvcQ56eAJZecmLgc"

            //ajax to get the place details
            $.ajax({
                url: proxyUrl + queryUrl,
                method: "GET",

            }).then(function (response) {
                console.log(response);


                var barImage = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + response.result.photos[0].photo_reference + "&key=AIzaSyCVf591AZ-evHODFReCvcQ56eAJZecmLgc";
                var address = response.result.formatted_address;
                var phoneNumber = response.result.international_phone_number;
                var website = response.result.website;

                console.log(barName);
                console.log(address);
                console.log(phoneNumber);
                console.log(barImage);
                console.log(website);


                var addBarApi = {
                    name: barName,
                    address: address,
                    phone: phoneNumber,
                    image: barImage,
                    website: website,
                    description: description

                }


                $.post("api/unique",addBarApi );

            });

        });

        // window.location.reload()


    });

});