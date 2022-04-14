import { LightningElement } from 'lwc';

export default class LsModal extends LightningElement {
    closeModal(){
        let customEvt = new CustomEvent("closemodal", {});       
        this.dispatchEvent(customEvt);
    }
}