({
    addMarkers: function(component) {
        var map = component.get('v.map');
        var markers = component.get('v.markers');
        var accounts = component.get('v.accounts');
         
        // Remove existing markers
        if (markers) {
            markers.clearLayers();
        }
         
        // Add Markers
        if (map && accounts && accounts.length> 0) {
            for (var i=0; i<accounts.length; i++) {
                var account = accounts[i];
                if (account.Location__Latitude__s && account.Location__Longitude__s) {
                    var latLng = [account.Location__Latitude__s, account.Location__Longitude__s];
                    var marker = window.L.marker(latLng, {account: account});
                   markers.addLayer(marker);
                }
            }
            map.addLayer(markers);
        }
    }
})