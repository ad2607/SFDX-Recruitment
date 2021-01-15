public with sharing class ContactSearchController {
    @AuraEnabled
    public static List<Contact> searchContacts( String searchTerm ) {
        List<Contact> contacts = new List<Contact>();
        if ( String.isNotBlank( searchTerm ) ) {
            List<List<SObject>> searchResults = [
                FIND :searchTerm
                RETURNING Contact(
                    Id, Name, Phone,
                    MailingStreet, MailingCity,
                    MailingState, MailingPostalCode
                    ORDER BY Name
                    LIMIT 10
                )
            ];
            contacts = searchResults[0];
        }
        return contacts;
    }
}