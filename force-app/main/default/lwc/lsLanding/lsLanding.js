import { LightningElement,wire } from "lwc";
import LS_Channel from "@salesforce/messageChannel/LS_Channel__c";
import { publish, MessageContext } from "lightning/messageService";
import getItems from '@salesforce/apex/LS_Controller.getItems';

export default class LsLanding extends LightningElement {
    @wire(MessageContext) messageContext;

    items = [];
    connectedCallback(){
         
        this.loading(true);
        getItems().then((c)=>{
            this.items = JSON.parse(c);             
        }).catch((e)=>{
          this.showError(e.message)
        }).finally(()=>{
            this.loading(false);
        })
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