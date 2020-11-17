import {LightningElement} from 'lwc';
import leafletjs from '@salesforce/resourceUrl/leaflet';
import {loadStyle, loadScript} from 'lightning/platformResourceLoader';
import getCandidates from '@salesforce/apex/MapStream.getCandidates';



export default class Map extends LightningElement {

        
        
    renderedCallback(){
        console.log('render callback');

        Promise.all([
            loadScript(this, leafletjs + '/leaflet.js'),
            loadStyle(this, leafletjs + '/leaflet.css')
        ])
        .then(()=>{
            console.log('inside');
            this.initLeaflet();
            
        })
        .catch(error => {
            console.log('failed' + error);
        });

        
    }

    initLeaflet(){
        console.log("initloaded")
        const heatmap = this.template.querySelector(".map-root");

        var map = L.map(heatmap).setView([50.505, 6.09], 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYWRhbTI2MDciLCJhIjoiY2toa3JzbjltMW5ydzJ6bWM1dHF3dWU0aCJ9.GVrDcf93vsrVB0c47CYt1Q'
        }).addTo(map);
  
        var recordId; 
        
        console.log('config', window.location.href);
        // Visualforce.remoting.timeout = 120000
        // Visualforce.remoting.Manager.invokeAction('{!$RemoteAction.MapStream.getCandidates}', window.location.href, function(result, event) {
    
        getCandidates('{!$Site.BaseUrl}').then(result => {   

            if(result.VACANCY) {
                var vacancy = result.VACANCY[0];
                
                recordId = vacancy.Id;
                
                var myIcon = L.icon({
                    iconUrl: 'my-icon.png',
                    iconSize: [38, 95],
                    iconAnchor: [22, 94],
                    popupAnchor: [-3, -76],
                    shadowUrl: 'my-icon-shadow.png',
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }).addTo(map);
                map = L.map('map').setView([vacancy.lat__c, vacancy.long__c], 9);
                
                var circle = L.circle([vacancy.lat__c, vacancy.long__c], {
                    color: "#af61c7",
                    fillColor: "#af61c7",
                    fillOpacity: 0.1,
                    radius: 24140
                }).addTo(map);
                
                var circle = L.circle([vacancy.lat__c, vacancy.long__c], {
                    color: "#6ca3eb",
                    fillColor: "#6ca3eb",
                    fillOpacity: 0.1,
                    radius: 50000
                }).addTo(map);

                var circleSmall = L.circle([vacancy.lat__c, vacancy.long__c], {
                    color: "#61c78f",
                    fillColor: "#61c78f",
                    fillOpacity: 1,
                    radius: 600
                }).addTo(map);
                
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                
                //L.marker([vacancy.Geolocation__Latitude__s, vacancy.Geolocation__Longitude__s], {color: 'green'}).addTo(map);
                
                bounds.push([vacancy.lat__c, vacancy.long__c]);
                console.log("at end");
            }
            if(result.CANDIDATES) {
                result.CANDIDATES.forEach(function(candidate) {
                    console.log('candidate', candidate);
                    var popupContent = '<b>' + candidate.Name + '</b><br/>';
                    if (candidate.PersonMobilePhone)                 popupContent += 'Mobile: ' + candidate.PersonMobilePhone + ' <br/><br/>';
                    if (candidate.PersonEmail)                 popupContent += 'Email: ' + candidate.PersonEmail + ' <br/><br/>';
                    popupContent += '<input type="button" value="Add to shortlist" onclick="shortlist(\'' + candidate.Id + '\',\'add\')">';

                    L.marker([candidate.BillingLatitude, candidate.BillingLongitude], { opacity : 0.6}).addTo(map).bindPopup(popupContent);
                    bounds.push([candidate.BillingLatitude, candidate.BillingLongitude]);
                });
            }
            
 
        }).catch(err => {console.log='failed'});
        
        function shortlist(candidateId, action){
    
            Visualforce.remoting.Manager.invokeAction(
                '{!$RemoteAction.VacancyMapController.shortlist}', 
                candidateId, 
                recordId,
                action,
                function(result, event) {
                    if (result === 'success'){
                        window.location.reload();
                    };
                }
            );
        } 

}
}  