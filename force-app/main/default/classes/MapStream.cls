public with sharing class MapStream {

    @AuraEnabled(cacheable=true)
    @RemoteAction
    public static Object getCandidates(String pageUrl){

        try {
            
            Map<String,List<Object>> responseMap = new Map<String,List<Object>>();
            responseMap.put('VACANCY',new List<Object>());
            responseMap.put('SHORTLIST',new List<Object>());
            responseMap.put('CANDIDATES',new List<Object>());
            
        	String recordId = pageUrl.substringAfter('Vacancy__c/').substringBefore('/');
            Decimal latitude;
            Decimal longitude;
            
            List<Vacancy__c> vacancies = [SELECT Id, Name, lat__c, long__c
                                            FROM Vacancy__c WHERE Id = :recordId];
                  
            if (!vacancies.isEmpty()){
                responseMap.get('VACANCY').add(vacancies[0]);  
                latitude 	= vacancies[0].lat__c;
                longitude 	= vacancies[0].long__c;
            }
            
            if (latitude != null && longitude != null){

                List<Account> candidates = Database.query('SELECT Id, Name, PersonMobilePhone , PersonEmail ,' +
                                                                'BillingLatitude, BillingLongitude' +
                	                           					'FROM PersonAccount ' +
                                               					'WHERE DISTANCE(lat__c, long__c, \'mi\') < 15 '
                    						   					);
                
                for (Account candidate : candidates){                                                              
            		responseMap.get('CANDIDATES').add(candidate);                                   
            	}                              
            }
                                                                                                                 
        	return responseMap;            
            
        } catch (Exception e){
            return e.getMessage();
        }     
    }    
    
    @RemoteAction
    public static Object shortlist(String candidateId, String vacancyId, String action){
        try {            
            if (action == 'add'){
                //add later
                return 'SUCCESS';              
            } else if (action == 'remove'){
                ///add in code later               
            }                 
            return 'success';
        } catch (Exception e){            
            return e.getMessage();
        }
    }    
    
}

