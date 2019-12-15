function formatThisDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return  monthNames[monthIndex] + ' ' + day + ' ' + year;
  }

function showModal(inMarker) {

    let modalImg = $('#myModalImg');
    let modalLabel = $('#myModalLabel');
    let modal = $('#myModal');

    // console.log("H: ",boxHeight,"W: ",boxWidth);
    // console.log(fillClass);

    console.log(inMarker);

    modalLabel[0].innerHTML = formatThisDate(inMarker.date);
    // modalImg.attr("src", "/img/mapImages/" + inMarker.name)
    modalImg.css('background-image', "url('/img/mapImages/" + inMarker.name + "')");
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
        this.masterMarkerList = [];
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
                this.masterMarkerList.push(newMarker);
                this.markerList.push(newMarker);
            }
            this.setInputDatesToShowAllMarkers();
            this.applyDateFilter();
            callback();
        }.bind(this);

        $.getJSON("./img/imgGPSData.json", afterLoadFunction);
    }

    setInputDatesToShowAllMarkers() {
        let minMaxDates = this.getMinMaxDatesWithPadding();
        this.inputMinDate = minMaxDates[0]
        this.inputMaxDate = minMaxDates[1]
    }

    clearMapMarkers() {
        this.layerGroup.clearLayers();
    }

    applyDateFilter() {
        let minDate = this.inputMinDate;
        let maxDate = this.inputMaxDate;
        this.markerList = this.masterMarkerList.filter(marker => marker.date > minDate
            && marker.date < maxDate);
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

        if (this.markerList.length > 0) {
            this.map.fitBounds(this.getMapBoundsArray());
        }
    }

    getMapBoundsArray() {
        let mapBoundsArray = [];

        for (let i = 0; i < this.markerList.length; i++) {
            mapBoundsArray.push(this.markerList[i].getLatLon());
        }

        return mapBoundsArray;
    }

    getMinMaxDates() {
        var maxDate = new Date(Math.max.apply(null, this.markerList.map(function (marker) { return marker.date; })));
        var minDate = new Date(Math.min.apply(null, this.markerList.map(function (marker) { return marker.date; })));
        console.log(minDate, maxDate);
        return [minDate, maxDate];
    }

    getMinMaxDatesWithPadding() {
        let minMaxDates = this.getMinMaxDates();
        let minDate = new Date(minMaxDates[0].setDate(minMaxDates[0].getDate() - 1));
        let maxDate = new Date(minMaxDates[1].setDate(minMaxDates[1].getDate() + 1));
        return [minDate, maxDate];
    }

}

// Set up our global variables 😭

minDateSlider = $("#min-date-slider");
maxDateSlider = $("#max-date-slider");

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

var markerControllerInstance = new markerController(mymap);
markerControllerInstance.importPhotoData(function () {
    markerControllerInstance.populateMapWithMarkers();
    markerControllerInstance.getMinMaxDates();
    setUpSliders();
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

    let minMaxDates = markerControllerInstance.getMinMaxDatesWithPadding();

    let minValDate = minMaxDates[0];
    let maxValDate = minMaxDates[1];

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
    markerControllerInstance.applyDateFilter();
    markerControllerInstance.populateMapWithMarkers();
}

function onMaxSliderChange(dateValue) {
    console.log("Max Changing slider!", dateValue);
    markerControllerInstance.inputMaxDate = dateValue;
    markerControllerInstance.clearMapMarkers();
    markerControllerInstance.applyDateFilter();
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



}

main();


