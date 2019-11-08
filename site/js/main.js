class customMarker {
    constructor(inName, inLat, inLon) {
        this.name = inName;
        this.lat = inLat;
        this.lon = inLon;
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
    }

    importPhotoData(callback) {
        var afterLoadFunction = function (json) {
            let keyList = Object.keys(json);
            for (let i = 0; i < keyList.length; i++) {
                let markerName = keyList[i];
                let newMarker = new customMarker(markerName, json[markerName]['LatLon'][0], json[markerName]['LatLon'][1]);
                this.markerList.push(newMarker);
            }
            callback();
        }.bind(this);

        $.getJSON("./img/imgGPSData.json", afterLoadFunction);
    }

    populateMapWithMarkers() {
        let addToMapFunc = function (inMarker) {
            L.marker(inMarker.getLatLon()).addTo(this.map);
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

}

function main() {
    // var markerList = [[51.5, -0.0905], [51.53, -0.09]];

    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

    var markerControllerInstance = new markerController(mymap);
    markerControllerInstance.importPhotoData(function () {
        markerControllerInstance.populateMapWithMarkers();
    });

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

    $('#multi').mdbRange({
        single: {
            active: true,
            multi: {
                active: true,
                rangeLength: 1
            },
        }
    });
}

main();


