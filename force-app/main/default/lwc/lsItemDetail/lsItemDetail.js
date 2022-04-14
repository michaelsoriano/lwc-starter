import { LightningElement,wire } from 'lwc';
import getItemDetail from '@salesforce/apex/LS_Controller.getItemDetail';
import LS_Channel from "@salesforce/messageChannel/LS_Channel__c";
import { publish, MessageContext } from "lightning/messageService";
import { removeUrlParams, getUrlParams } from "c/lsHelpers";


export default class LsItemDetail extends LightningElement {

    @wire(MessageContext)
    messageContext;

    item = {};

    connectedCallback(){
        this.loading(true);        
        getItemDetail( {id : getUrlParams('c__item')}).then((r)=>{
            this.item = JSON.parse(r);
        }).catch((e)=>{
            this.showError(e.body.message)
        }).finally(()=>{
            this.loading(false);
        })

    }
    showModal(){
        console.log('yyyyy')
        let customEvt = new CustomEvent("showmodal", {});       
        this.dispatchEvent(customEvt);
    }
    backToLanding(){
        removeUrlParams();
        publish(this.messageContext, LS_Channel, { isLoading : true, view:'landing'});
    }
    showError(msg){
        publish(this.messageContext, LS_Channel,{
            hasError: true,
            errorMessage: msg
        });
    }
    loading(l){       
        publish(this.messageContext, LS_Channel, { isLoading : l});
    }
}