

// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allitems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var ID, newItem;

            // ID [1,2,3,4] next ID is 5
            // ID [1, 2, 4, 7] next ID is 8
            if(data.allitems[type].length > 0) {
                ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
            } else { ID = 0; }
            

            if(type === 'exp') {
                newItem = new Expense(ID,des,val);
            } else if (type === 'inc') {
                newItem = new Income(ID,des,val);
            }

            data.allitems[type].push(newItem);
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    }

})();


// UI CONTROLLER
var uiController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };
    
    return {

        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function() {
            return DOMstrings;
        }

    }

})();



// CONTROLLER
var controller = (function (budgetCtrl,UICtrl) {

    

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress',function(event) {
        
            if( event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
    });

    };

    var ctrlAddItem = function () {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();
        //console.log(input);
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the item to the UI

        // 4. Calcutlate the budget

        // 5. Display the budget on the UI

    };

    return {
        init: function() {
            console.log('Application has Started...');
            setupEventListeners();
        }
    }


})(budgetController,uiController);


controller.init();



























