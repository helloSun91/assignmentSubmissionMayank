import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from'@salesforce/apex/accountCreationController.getAccountCount';
export default class AccountRecordCreation extends NavigationMixin(LightningElement) {

    keyIndex = 0;
    accountCount;
    @track itemList = [
        {
            id: 0
        }
    ];

    addRow() {
        ++this.keyIndex;
        var newItem = [{ id: this.keyIndex }];
        this.itemList = this.itemList.concat(newItem);
    }

    removeRow(event) {
        if(this.itemList.length == 1 ){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Last record error',
                    message: 'You cannot remove last record',
                    variant: 'error',
                }),
            );
        }
        else if (this.itemList.length >= 2) {
            this.itemList = this.itemList.filter(function (element) {
                return parseInt(element.id) !== parseInt(event.target.accessKey);
            });
        }
    }
    connectedCallback(){
        this.handleCalculation();
    }
    handleSubmit() {
        var isVal = true;
        this.template.querySelectorAll('lightning-input-field').forEach(element => {
            isVal = isVal && element.reportValidity();
        });
        if (isVal) {
            this.handleCalculation();
            this.template.querySelectorAll('lightning-record-edit-form').forEach(element => {
                element.submit();
            });

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account(s) successfully created',
                    variant: 'success',
                }),
            );
            // Navigate to the Account home page
            this[NavigationMixin.GenerateUrl]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Account',
                    actionName: 'home',
                },
            }).then(url => {
                window.open(url, "_blank");
            });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: 'Please enter all the required fields',
                    variant: 'error',
                }),
            );
        }
    }

    handleCalculation() {
        getAccounts()
            .then(result => {
                console.log('result'+result);
                this.accountCount = result;
            })
            .catch(error => {
                this.error = error;
            });
    }
}