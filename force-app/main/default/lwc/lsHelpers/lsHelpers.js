/*eslint no-restricted-globals: ["error", "event"]*/

export const setUrlParams = function(keyVal){    
    let queryString = '?'; 
    if(Array.isArray(keyVal)){
        keyVal.forEach((item,index)=>{
            let sep = keyVal.length-1 === index ? '' : '&'; 
            queryString += item + sep;
        })
    }else if(typeof keyVal === 'string'){
        queryString += keyVal;
    }
    history.pushState({}, "",  window.location.pathname + queryString);  
}

export const removeUrlParams = function(){    
    history.pushState({}, "",  window.location.pathname);  
} 

export const getUrlParams = function(key){    
    let searchStr = '';
    searchStr = window.location.search;      
    let sPageURL = decodeURIComponent(searchStr.substring(1));
    let sURLVariables = sPageURL.split('&');
    let sParameterName;
     for (let i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === key) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
     }
     return false;
}