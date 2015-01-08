(function (module) {
    mifosX.models = _.extend(module, {
        CashierTxnAmount: function (data) {
            this.txnType = data.txnType.value;
            this.amount = data.txnAmount;

            this.cashInAmount = function () {
	        	if (this.txnType == 'Cash In') {
	      			return this.amount;
	      		} else {
	      			return '';
	      		}
    		};

    		this.cashOutAmount = function () {
	        	if (this.txnType == 'Cash Out') {
	      			return this.amount;
	      		} else {
	      			return '';
	      		}
    		};

    		this.allocAmount = function  () {
	        	if (this.txnType == 'Allocate Cash') {
	      			return this.amount;
	      		} else {
	      			return '';
	      		}
    		};

    		this.settleAmount = function  () {
	        	if (this.txnType == 'Settle Cash') {
	      			return this.amount;
	      		} else {
	      			return '';
	      		}
    		};
        }
    });
}(mifosX.models || {}));
