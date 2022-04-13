import { LightningElement, wire } from "lwc";
import LS_Channel from "@salesforce/messageChannel/LS_Channel__c";
import { subscribe, MessageContext } from "lightning/messageService";
import { getUrlParams } from "c/cfrHelpers";

export default class LsMain extends LightningElement {
  @wire(MessageContext)
  messageContext;

  isLoading = false;
  hasError = false;
  modal = false;
  errorMessage = "An error occurred processing your request.";
  view = {
    landing : false, 
    itemDetail : false
  };

  connectedCallback() {   
    subscribe(this.messageContext, LS_Channel, (message) => {
      if (message.isLoading === true) {
        this.isLoading = true;
      }else if(message.isLoading === false){
        this.isLoading = false;
      }
      if (message.hasError === true) {
        this.hasError = true;
        if (message.errorMessage) {
          this.errorMessage = message.errorMessage;
        }
      }else{
        if(message.view){
          this.viewHandler(message.view);
        }
      }
    });

    this.checkUrlParams();
    window.addEventListener("popstate", this.backHandler.bind(this))    
  }

  backHandler(evt){
    this.isLoading = true;
    console.log(JSON.stringify(evt.state));
    this.checkUrlParams();  
    this.isLoading = false;
  }

  checkUrlParams(){
    if(getUrlParams('c__item')){
      this.viewHandler('itemDetail');
    }else{
      this.viewHandler('landing');
    }   
  }
  showModal(){    
    this.modal = true;
  }
  closeModal(){     
    this.modal = false;
  }

  viewHandler(view) {
    switch(view){
        case 'landing': 
            // removeUrlParams();
            this.view.landing = true;
            this.view.itemDetail = false; 
        break;
        case 'itemDetail': 
          this.view.landing = false;
          this.view.itemDetail = true; 
        break;         
      default:
        this.view.landing = true;
        this.view.itemDetail = false;
        break;
    }
  }
 

}