function showModal(inMarker) {

    let modalParent = $('#myModalBody');

    let boxHeight = $(window).height();
    let boxWidth = $(window).width();

    let fillClass = !(boxHeight > boxWidth)
        ? 'fill-height'
        : 'fill-width';

    let modalImg = $('#myModalImg');
    let modalLabel = $('#myModalLabel');
    let modal = $('#myModal');

    // console.log("H: ",boxHeight,"W: ",boxWidth);
    // console.log(fillClass);

    console.log(inMarker);

    modalImg.removeClass('fill-height');
    modalImg.removeClass('fill-width');
    modalImg.addClass(fillClass);

    modalLabel[0].innerHTML = inMarker.name;
    modalImg.attr("src", "/img/mapImages/" + inMarker.name)
    modal.modal('show');
}

class customMarker {
    constructor(inName, inLat, inLon, inDate) {
        this.name = inName;
        this.lat = inLat;
        this.lon = inLon;
        this.date = inDate;
    }

    getName() {
        return this.name;
    }

    getLatLon() {
        return [this.lat, this.lon]
    }
}

class markerController {
    constructor(inputMap) {
        this.map = inputMap;
        console.log("Created map");
        this.markerList = [];
        this.inputMaxDate = 0;
        this.inputMinDate = 0;
        this.layerGroup = L.layerGroup().addTo(this.map);
    }

    importPhotoData(callback) {
        var afterLoadFunction = function (json) {
            let keyList = Object.keys(json);
            for (let i = 0; i < keyList.length; i++) {
                let markerName = keyList[i];
                let inputDate = new Date(json[markerName]['DateTime']);
                let newMarker = new customMarker(markerName, json[markerName]['LatLon'][0], json[markerName]['LatLon'][1], 
                    inputDate);
                this.markerList.push(newMarker);
            }
            callback();
        }.bind(this);

        $.getJSON("./img/imgGPSData.json", afterLoadFunction);
    }

    clearMapMarkers() {
        this.layerGroup.clearLayers();
    }

    populateMapWithMarkers() {

        let addToMapFunc = function (inMarker) {

            let markerFunction = function () {
                showModal(inMarker);
            };

            L.marker(inMarker.getLatLon())
                .on('click', markerFunction)
                .addTo(this.layerGroup);
        }.bind(this);

        this.markerList.forEach(addToMapFunc);

        this.map.fitBounds(this.getMapBoundsArray());
    }

    getMapBoundsArray() {
        let mapBoundsArray = [];

        for (let i = 0; i < this.markerList.length; i++) {
            mapBoundsArray.push(this.markerList[i].getLatLon());
        }

        return mapBoundsArray;
    }

    getMinMaxDates() {
        return (100, 200);
    }

}

// Set up our global variables 😭

minDateSlider = $("#min-date-slider");
maxDateSlider = $("#max-date-slider");

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

var markerControllerInstance = new markerController(mymap);
markerControllerInstance.importPhotoData(function () {
    markerControllerInstance.populateMapWithMarkers();
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function setUpMinDateSlider(minVal, maxVal, val) {

    minDateSlider[0].max = maxVal;
    minDateSlider[0].min = minVal;
    minDateSlider.val(val);
    var children = minDateSlider[0].parentNode.childNodes[1].childNodes;
    var value = ((val - minVal) / (maxVal - minVal) * 100);
    children[1].style.width = value + '%';
    children[5].style.left = value + '%';
    children[7].style.left = value + '%'; children[11].style.left = value + '%';

    let dateValue = new Date(val);

    children[11].childNodes[1].innerHTML = formatDate(dateValue);

}

function setUpMaxDateSlider(minVal, maxVal, val) {

    maxDateSlider[0].max = maxVal;
    maxDateSlider[0].min = minVal;
    maxDateSlider.val(val);
    var children = maxDateSlider[0].parentNode.childNodes[1].childNodes;
    var value = ((val - minVal) / (maxVal - minVal) * 100);
    children[3].style.width = (100 - value) + '%';
    children[5].style.right = (100 - value) + '%';
    children[9].style.left = value + '%'; children[13].style.left = value + '%';

    let dateValue = new Date(val);

    children[13].childNodes[1].innerHTML = formatDate(dateValue);;

}

function setUpSliders() {

    let minValDate = new Date("2019-01-01");
    let maxValDate = new Date("2019-02-01");

    let minValInt = minValDate.getTime();
    let maxValInt = maxValDate.getTime();

    let minVal = minValInt;
    let maxVal = maxValInt;

    setUpMinDateSlider(minVal, maxVal, minVal);
    setUpMaxDateSlider(minVal, maxVal, maxVal);

}

function onMinSliderChange(dateValue) {
    console.log("Min Changing slider!", dateValue);
    markerControllerInstance.inputMinDate = dateValue;
    markerControllerInstance.clearMapMarkers();
}

function onMaxSliderChange(dateValue) {
    console.log("Max Changing slider!", dateValue);
    markerControllerInstance.inputMaxDate = dateValue;
    markerControllerInstance.clearMapMarkers();
    markerControllerInstance.populateMapWithMarkers();
}

function main() {
    // var markerList = [[51.5, -0.0905], [51.53, -0.09]];

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);




    // markerList.forEach(function (marker, index) {
    //     L.marker(marker).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
    //     console.log("Added", marker);
    // });

    setUpSliders();


}

main();


