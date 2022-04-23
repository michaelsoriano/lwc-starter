public with sharing class LS_Utils {
    public LS_Utils() {}
    public static List<String> getEnvVars(String key){
        
        // TO GET ALL VARS:             
        // LS_Utils.getEnvVars(null);
        // TO GET A SINGLE VALUE: 
        // LS_Utils.getEnvVars('key1');

        
        // USE COMBINATION - TO RUN MAIN METHOD 1X ONLY, AND GET SINGLE VARS AFTER:
        // List<String> envVars = LS_Utils.getEnvVars(null); 
        // LS_Utils.getEnvVar('key1', envVars); 
        // LS_Utils.getEnvVar('key2', envVars); 

        List<String> result = new List<String>();
        Map<String,List<String>> rawMap = new Map<String,List<String>>();

        List<Integer> envIndexes = new List<Integer>();
        List<Integer> nodeIndexes = new List<Integer>();

        String metaData = LS_Utils.getSettingByKey('Environment_Variables');
        if(metaData != null){
            
            List<String> rawList = new List<String>();
            for(String str : metaData.split('\n')){ //REMOVES NULL / EMPTY LINES...
                if(String.isNotBlank(str)){
                    rawList.add(str);
                }
            }
            Integer index = 0; 
            for(String str : rawList){
                if(str.startsWith('[')){ //AN ENVIRONMENT
                    envIndexes.add(index);
                }else if(str.contains('=')){ //A NODE KEY/VAL has to have an '='
                    nodeIndexes.add(index);
                }
                index++;
            }
            // rawList [node1,kv1,kv2,kv3,node2,kv4,kv5,kv6]
            // envIndexes [0,4]
            //             0 1
            // nodeIndexes [1,2,3,5,6,7]
            //              0 1 2 3 4 5 
            for(Integer y=0; y<rawList.size();y++){
                for(Integer i=0; i<envIndexes.size();i++){
                    if(y == envIndexes[i]){
                        List<String> nodes = new List<String>();
                        for(Integer x=0; x<nodeIndexes.size();x++){
                            if(i == envIndexes.size()-1){ //at the last envindex
                                if(nodeIndexes[x] > envIndexes[i]){
                                    nodes.add(rawList[nodeIndexes[x]]);
                                }
                            }else{ //not last index
                                if(nodeIndexes[x] > envIndexes[i] && nodeIndexes[x] < envIndexes[i+1] ){
                                    nodes.add(rawList[nodeIndexes[x]]);
                                }
                            }                            
                        }       
                        String env = rawList[envIndexes[i]];     
                        env = env.replace('[','').replace(']','').toLowerCase().trim();
                        rawMap.put(env,nodes);
                    }
                }
            }            
        }

        List<String> envVars  = rawMap.get(URL.getSalesforceBaseUrl().getHost());
        if(key == null){
            result = envVars;
        }else{
            result.add(LS_Utils.getEnvVar(key,envVars));
        }        
        return result;
    }

    public static String getEnvVar(String key, List<String> envVars){
        String result = ''; 
        for(String ev : envVars){                 
            if(ev.startsWithIgnoreCase(key)){
                List<String> temp = ev.split('=');
                if(temp[1] != null){
                    result = temp[1];
                }
            }                
        }
        return result;
    }

    public static String getSettingByKey(String key) {
		
		String val;

		List<LS_Setting__mdt> settings = [SELECT
			Value__c
			FROM
			LS_Setting__mdt WHERE DeveloperName = :key];

    
		if(settings.size() == 0){
			System.debug( key + ' not found in LS Settings');
		}else{
			val = settings[0].Value__c;
		} 
		
		return val; 

    }
}