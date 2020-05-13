

// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allitems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allitems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allitems[type].map(function (current) {
                return current.id;
            });
            
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allitems[type].splice(index,1);

            }


        },

        calculateBudget: function() {
            // calculate the total
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentage: function () {
            // calc the percentage
            data.allitems.exp.forEach( function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        readPercentage: function () {
            var percents;
            percents = data.allitems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return percents;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        testing: function() {
            console.log(data);
        }
    }

})();


// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function (num, type) {
        /*
        1. seperate with coma
        2. add two decimal point
        3. add + or - sign
        */ 

        num = Math.abs(num);
        num = num.toFixed(2);
        var newNum = num.split('.');

        int = newNum[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = newNum[1];

        return (type === 'exp' ? '-' : '+') + int + '.' + dec;


    };
    var nodeListForEach = function (list, callback) {
        for( var i = 0; i < list.length; i++) {
            callback(list[i],i);
        }
    };


    return {

        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat (document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // create a html placeholder for the items
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }

            // Replace the items to real data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type) );
            
            //Update to the UI
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorId) {
            
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },

        clearFields: function() {
            var fields, fieldArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +DOMstrings.inputValue);

            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function(current, index, array) {
                current.value = ""; 
            });

            fieldArr[0].focus();
        },

        displayBudget: function (obj) {
            var type;
            obj.budget >=  0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }



        },

        displayPercentage: function (percentage) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            

            nodeListForEach(fields, function (current,index) {
                if (percentage[index] > 0) {
                    current.textContent = percentage[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth: function() {
            var now, year, month, months; 
            now = new Date();
            months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY' ,'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changeType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields , function(cur) { 
                cur.classList.toggle('red-focus')
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

    };
    var updateBudget = function() {
        // 1. Calcutlate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function() {
        var percentages;

        // calculate the percentages
        budgetCtrl.calculatePercentage();

        // Read the percentage from the Budget Controller
        percentages = budgetCtrl.readPercentage();

        // Update it to the UI with new percentages
        UICtrl.displayPercentage(percentages);

    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Update the Budget
            updateBudget();

            // 6. Update the percentages
            updatePercentages();

           
        }
        
        
    };

    var ctrlDeleteItem = function (event) {
        var idItem, splitID, type, ID;

        idItem = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (idItem) {
            splitID = idItem.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete item in the datastructure
            budgetCtrl.deleteItem(type, ID);

            // Delete in the UI
            UICtrl.deleteListItem(idItem);

            // Update the Budget
            updateBudget();

            // 6. Update the percentages
            updatePercentages();

        }
    };


    return {
        init: function() {
            console.log('Application has Started...');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                percentage: -1,
                totalInc: 0,
                totalExp: 0
            });
            setupEventListeners();
        }
    }


})(budgetController,UIController);


controller.init();



























