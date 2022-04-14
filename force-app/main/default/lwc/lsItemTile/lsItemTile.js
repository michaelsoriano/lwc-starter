import { LightningElement, wire,api } from "lwc";
import LS_Channel from "@salesforce/messageChannel/LS_Channel__c";
import { publish, MessageContext } from "lightning/messageService";
import { setUrlParams } from "c/lsHelpers";

export default class LsItemTile extends LightningElement {
    @wire(MessageContext)
    messageContext;

    @api item = {};
    connectedCallback(){}
    showDetail(evt) {
        let id = evt.target.dataset.itemid;    
        setUrlParams('c__item='+id);
        publish(this.messageContext, LS_Channel, { isLoading : true, view : 'itemDetail'});
    }
}