const resultElement = document.getElementById('result');
const allClear = document.getElementById('all-clear');
const deleteBtn = document.getElementById('delete');
const divideBtn = document.getElementById('divide-btn');
const multiplyBtn = document.getElementById('multiply-btn');
const subBtn = document.getElementById('sub-btn');
const addBtn = document.getElementById('add-btn');
const ansBtn = document.getElementById('answer');
const decimalBtn = document.getElementById('decimal-btn');
const digitBtn = document.querySelectorAll('.digit');

//initialise the variables
let result = '';
let operation = '';
let previousOperand = 0;

//function to append number
const appendNumber= (number)=> {
    if(number === '.' && result.includes('.')) return;
    result+=number;
    updateDisplay();

}

//function to update display
const updateDisplay = () =>{
    if(operation) {
        resultElement.innerText= `${previousOperand} ${operation} ${result}`;
    }
    else{
        resultElement.innerText= result;
    }
    
}

//function to select operator
const selectOperator = (operatorValue) =>{
    if(result === '') return; 
    if(operation !=='' && previousOperand !==''){
        calculateResult();
    }
    operation = operatorValue ;
    previousOperand = result;
    result = '';
    updateDisplay();
}
//function to calc result
const calculateResult= ()=>{
    let evaluatedResult;
    const prev= parseFloat(previousOperand);
    const curr= parseFloat(result);
    
    if(isNaN(prev) || isNaN(curr)) return;
    switch (operation) {
        case '-':
            evaluatedResult= prev - curr;
            break;
        case '+':
            evaluatedResult= prev + curr;
            break;
        case '*':
            evaluatedResult= prev * curr;
            break;
        case '/':
            evaluatedResult= prev /  curr;
            break;
    
        default:
            return;
    }
    result = evaluatedResult.toString();
    operation= '';
    previousOperand ='';
}

//add event listener to digit btn
digitBtn.forEach(button => {
    button.addEventListener('click', ()=> {
        appendNumber(button.innerText);
    });    
});
//function to clear display
const clearDisplay = ()=>{
    result='';
    previousOperand='';
    operation='';
    updateDisplay();
}
//function to delete last input
const deleteLastInput= ()=>{
    if(result === '') return;
    if(operation!==''){
        operation= operation.slice(0,-1);
    }
    result = result.slice(0,-1);
    updateDisplay();
}
decimalBtn.addEventListener('click', ()=> appendNumber('.'));
addBtn.addEventListener('click', ()=> selectOperator('+'));
subBtn.addEventListener('click', ()=> selectOperator('-'));
multiplyBtn.addEventListener('click', ()=> selectOperator('*'));
divideBtn.addEventListener('click', ()=> selectOperator('/'));
ansBtn.addEventListener('click', ()=> {
    if(result === '') return;
    calculateResult();
    updateDisplay();
});
allClear.addEventListener('click', clearDisplay);
deleteBtn.addEventListener('click', deleteLastInput);