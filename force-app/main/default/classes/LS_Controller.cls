public with sharing class LS_Controller {
    public LS_Controller() {

    }
    @AuraEnabled
    public static String getItems(){
        StaticResource sr = [SELECT Id, Name, SystemModStamp, Body FROM StaticResource  WHERE Name = 'CFR_Mock' LIMIT 1];      
        return sr.Body.toString();
    }    
    @AuraEnabled
    public static String getItemDetail(String id){
        if(String.isEmpty(id)){
            throw new AuraHandledException('Id is empty');
        }
        String output = '';          
        String jsonStr = CFR_Controller.getItems();   //sr.Body.toString(); 
        List<Object> parsedResponse = (List<Object>) JSON.deserializeUntyped(jsonStr);
        for (Object finalObj : parsedResponse) {
            Map<String,Object> tempObjMap = (Map<String,Object>) finalObj;
            if(String.valueOf(tempObjMap.get('id')) == String.valueOf(id)){
                output = String.valueOf(JSON.serialize(tempObjMap));
            }    
        }
        return output; 
    }    
}
