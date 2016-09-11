(function(){
    function Calculator () {
        var _valButtons = $('.btn_val'),
            _textInput = $('.input-text'),
            _calcButton = $('.btn_result'),
            _resetButton = $('.btn_reset'),
            strExpression;


        /*
            format methods
        */
        function formatReplaceLastMathOperator(str) {
            if (!str) return '';
            return str.replace(/\+{1,}?[+*/]{1,}|-{1,}?[+*/-]{1,}|\*{1,}?[+*/]{1,}|\/{1,}?[+*]{1,}|[*/][*/]/g,function(result){
                return arguments[0][arguments[0].length -1];
            });
        };

        function formatClearStr(str){ 
            var parsedValues = str.match(/[0-9+-/*//]/g)         
            return (parsedValues)? parsedValues.join('') : '';
        };

        function removeFirstWrongOperator(str) {
            return str.replace(/^[+/*][0-9]/, function(){
               return arguments[0][arguments[0].length -1];
            });
        };

        function formatStr(str) {
            var origin = str;

            origin = formatClearStr(origin);
            origin = removeFirstWrongOperator(origin);
            origin = formatReplaceLastMathOperator(origin);

            return origin;
        };

        /*
            format methods end
        */

        /*
            string parsing methods
        */ 

        function splitNegative(expressionArray) {           
            var total = [];

            for(var i =0; i <= expressionArray.length -1; i++) {
               if(expressionArray[i][0] == '-' && /\d|[+*/]/.test(expressionArray[i-1])){
                 var items = expressionArray[i].split(/(\d+)/);
                 total.push(items[0],items[1]);
               } else {
                 total.push(expressionArray[i]);
               }
            }

            return total;
        };

        function getIndexesOf2(array, pattern, callback) {
            var positions = [],
                pos = array.indexOf(pattern); 
                positions.push(pos);   
                callback && callback(pos, pattern, array);            

            while (pos !== -1) {
                pos = array.indexOf(pattern, pos + 1);                
                positions.push(pos);
                callback && callback(pos, pattern, array);

            }

            if (positions.length -1) {
                return positions.slice(0, positions.length -1)
            } 
            console.log(positions)

            return -1;
        };

        function getOperatorsPositions(str, patternsArray) {
            var posObj = {},
                allIndexes = [];

           patternsArray.forEach(function(item){
                posObj[item] = getIndexesOf(str, item)
           });
           
           return posObj
        };

        function getOperatorsIndexes(operatorsPosObj) {
            var allIndexes = [];

            for(item in operatorsPosObj){
                operatorsPosObj[item].forEach(function(item){
                    allIndexes.push(item);
                })
            };

            return allIndexes.sort();
        };

        /*
            string parsing methods end
        */ 

        var mathMethods = {
            '+': function(a, b) {
                return a + b;
            },
            '-': function(a, b) {
                return a - b;
            },
            '*': function(a, b) {
                return a * b;
            },
            '/': function(a, b) {
                return a / b;
            }
        };

        function calc(a, b, operator) {
            if (mathMethods[operator]) {
               return mathMethods[operator](a, b);
            }

            return false;            
        };

        function getContainOperators(argumentsAndOperatorsArray, mathMethods) {
            var operators = [];

            console.log(argumentsAndOperatorsArray)

            Object.keys(mathMethods).forEach(function(operator) {
                argumentsAndOperatorsArray.indexOf(operator) > -1 && operators.push(operator);
            });

            return operators.length ? operators : false;
        };

        function getArgumentsAndOperatorsArray(expression) {
            return expression.match(/-?\d+|[+-/*//]/g);
        };

        function getTotatal(str, mathMethods) {
            var expression = str;
            var argumentsAndOperatorsArray = getArgumentsAndOperatorsArray(expression);
            var splitedArgumentsAndOperatorsArray = splitNegative(argumentsAndOperatorsArray);
            var containOperatorscontainOperators = getContainOperators(splitedArgumentsAndOperatorsArray, mathMethods);
            var total;

            if(splitedArgumentsAndOperatorsArray.length >= 3) {
            
                containOperatorscontainOperators.forEach(function(item){
                    console.log(item)
                    var result = getIndexesOf2(splitedArgumentsAndOperatorsArray, item, function(position, operator, array) {
                        if (position > -1) {
                            operandA = parseInt(array[position - 1]),
                            operandB = parseInt(array[position + 1]);
                            array.splice(position - 1, position +1);                            
                            total = array[position - 1] = calc(operandA, operandB, operator);
                        }

                    });

                })
            }  
            return total;     
        };

        function resetInput() {
            _textInput.val('');
        };

        function type(str) {            
            var inputVal = _textInput.val();
            _textInput.val(inputVal += str);

           strExpression = formatStr(inputVal);
           _textInput.val(strExpression);   
        };

        function calculate(expression) {
            _textInput.val() && _textInput.val(getTotatal(expression, mathMethods)); 
        };

        function processValBtn() {
            type($(this).data('val'));
        };

        function init() {
            _resetButton.on('click', resetInput)
            _valButtons.on('click', processValBtn);  
            _textInput.on('keyup', function(e){
                type();
            });
            _calcButton.on('click', function(e){
                calculate(strExpression);
            });
        };

        init();
    }

    new Calculator

})();
