const inputSlider = document.querySelector("[sliderlength-data]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-CopyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-strengthIndicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+|{":}>,?<-*/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicatorColor("#ccc");


//set password length in the ui
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100) / (max - min) + "% 100%" ;
}

function setIndicatorColor(color){
    indicator.style.backgroundColor = (color);
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


 
function getRndmInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndmInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndmInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndmInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndmInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) &&passwordLength >=8){
        setIndicatorColor("#0f0");
    }
    else if( (hasLower || hasUpper) && (hasNum ||hasSym) && passwordLength>=6){
        setIndicatorColor("#ff0");
    }
    else{
        setIndicatorColor("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBox(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    //condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

}

function shufflePassword(array){
    //fisher yates method
    for(let i= array.length -1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=> {str += el});
    return str;
}



allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBox);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value)   
        copyContent();
})

function generatePassword(){
    //if none of the checkbox are selected
    if(checkCount==0) return;

    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //to generate new password

    //remove old password
    password = "";

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolCheck.checked)
        funcArr.push(generateSymbol);    
    
    //checked checkboxes
    for(let i=0; i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaining characters
    for(let i=0; i<passwordLength - funcArr.length; i++){
        let rndmInteger = getRndmInteger(0, funcArr.length);
        password += funcArr[rndmInteger]();
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));

    //display the password
    passwordDisplay.value = password;
    //display strength
    calcStrength();

};
generateBtn.addEventListener('click', generatePassword);

console.log('hello jee');
