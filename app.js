

// BUDGET CONTROLLER
var budgetController = (function () {

    // some code

})();


// UI CONTROLLER
var uiController = (function () {

    // some code

})();



// CONTROLLER
var controller = (function (budgetCtrl,uiCtrl) {

    var ctrlAddItem = function () {

        // 1. Get the field input data

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calcutlate the budget

        // 5. Display the budget on the UI

    };

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    });

    document.addEventListener('keypress',function(event) {
        
        if( event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });


})(budgetController,uiController);






























