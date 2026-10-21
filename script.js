
const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[dataLengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector(".data-copy");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll('input[type="checkbox"]');

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

// Initialize
handleSlider();
handleCheckBoxChange();
setIndicator("#f00");
setIndicator("#ccc")

// Set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

// Set strength indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px ${color}`;
}

// Generate a random integer: min inclusive, max exclusive
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}
//cleared 

// Calculate approximate strength
function calcStrength() {
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNum = numbersCheck.checked;
    const hasSym = symbolsCheck.checked;

    if (
        hasUpper && hasLower &&
        (hasNum || hasSym) &&
        passwordLength >= 8
    ) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// Copy password
async function copyContent() {
    if (!passwordDisplay.value) return;

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (error) {
        copyMsg.innerText = "Copy failed!";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Shuffle password using Fisher-Yates
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRndInteger(0, i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array.join("");
}

// Count selected checkboxes
function handleCheckBoxChange() {
    checkCount = 0;

    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // Ensure length can fit all selected categories
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    calcStrength();
}

// Checkbox listeners
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

// Slider listener
inputSlider.addEventListener("input", (e) => {
    passwordLength = Number(e.target.value);

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
    }

    handleSlider();
    calcStrength();
});

// Copy button listener
copyBtn.addEventListener("click", copyContent);

// Generate password
generateBtn.addEventListener("click", () => {
    if (checkCount === 0) {
        passwordDisplay.value = "";
        alert("Please select at least one character type.");
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    const funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }

    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }

    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // Guarantee one character from every selected category
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill the remaining password positions
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        const randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle and display
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    calcStrength();
});

