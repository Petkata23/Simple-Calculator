function clearDisplay() {
    document.getElementById('display').value = '';
}

function appendCharacter(character) {
    let display = document.getElementById('display');
    let currentValue = display.value;
    let lastChar = currentValue.slice(-1);

    if (character === '.') {
        if (currentValue === '' || '÷×+-'.includes(lastChar)) {
            return;
        }
        let parts = currentValue.split(/[\+\-\×÷]/);
        let currentNumber = parts[parts.length - 1];
        if (currentNumber.includes('.')) {
            return;
        }
    }

    if (character === '%') {
        if (lastChar === '%') {
            return;
        }
        if (currentValue === '' || '÷×+-'.includes(lastChar)) {
            return;
        }
    }

    if (character === '+/-') {
        let parts = currentValue.split(/([\+\-\×÷])/);
        let lastNumberIndex = parts.length - 1;

        // Намиране на последното число, ако съществува
        while (lastNumberIndex >= 0 && '÷×+-'.includes(parts[lastNumberIndex])) {
            lastNumberIndex--;
        }

        let currentNumber = parts[lastNumberIndex] || '';
        
        if (currentNumber.startsWith('(-') && currentNumber.endsWith(')')) {
            // Премахване на отрицателния знак
            parts[lastNumberIndex] = currentNumber.slice(2, -1);
        } else if (currentNumber !== '') {
            // Добавяне на отрицателния знак
            parts[lastNumberIndex] = `(-${currentNumber})`;
        }

        display.value = parts.join('');
        return;
    }

    if (character.match(/\d/) && currentValue.match(/[\+\-\×÷]0$/)) {
        display.value = currentValue.slice(0, -1) + character;
        return;
    }

    if (currentValue === '0' && !'÷×+-'.includes(character) && character !== '.') {
        display.value = character;
        return;
    }

    if ('÷×+-'.includes(lastChar) && '÷×+-'.includes(character)) {
        display.value = currentValue.slice(0, -1) + character;
    } else {
        display.value += character;
    }
}

function calculateResult() {
    let display = document.getElementById('display');
    try {
        let expression = display.value.replace(/÷/g, '/').replace(/×/g, '*');

        if (/^\d+(\.\d+)?%$/.test(expression)) {
            let number = parseFloat(expression.replace('%', ''));
            display.value = number / 100;
            return;
        }

        let percentageRegex = /(\d+(\.\d+)?)\s*([\+\-\*\/])\s*(\d+(\.\d+)?)%/g;

        expression = expression.replace(percentageRegex, (match, num1, _, operator, num2) => {
            let base = parseFloat(num1);
            let percentage = parseFloat(num2) / 100;
            let result;
            switch (operator) {
                case '+':
                    result = base + (base * percentage);
                    break;
                case '-':
                    result = base - (base * percentage);
                    break;
                case '*':
                    result = base * percentage;
                    break;
                case '/':
                    result = base / percentage;
                    break;
                default:
                    return match;
            }
            return result;
        });

        let result = eval(expression);
        display.value = Math.round(result * 10000000000) / 10000000000;
    } catch (e) {
        display.value = 'Error';
    }
}
