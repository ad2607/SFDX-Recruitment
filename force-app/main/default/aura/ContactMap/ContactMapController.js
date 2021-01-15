({
    onContactsLoaded: function( component, event, helper ) {
        var mapMarkers = [];
        var contacts = event.getParam( 'contacts' );
        for ( var i = 0; i < contacts.length; i++ ) {
            var contact = contacts[i];
            var marker = {
                'location': {
                    'Street': contact.MailingStreet,
                    'City': contact.MailingCity,
                    'PostalCode': contact.MailingPostalCode
                },
                'title': contact.Name,
                'description': (
                    'Phone: ' + contact.Phone
                ),
                'icon': 'standard:location'
            };
            mapMarkers.push( marker );
        }
        component.set( 'v.mapMarkers', mapMarkers );
    }
})