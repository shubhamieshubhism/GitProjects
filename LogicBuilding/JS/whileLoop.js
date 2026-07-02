//printNumber1to10();
//printNumber10to1();
//printEvenNumber(14);
//sumOfAllNaturalNumber(10);
//console.log(`The Armstrong --> ${isArmstrong(153)}`);

function printNumber1to10() {
  let i = 1;
  while (i <= 10) {
    console.log(`The number ${i}`);
    i++;
  }
}

function printNumber10to1() {
  let i = 10;
  while (i >= 1) {
    console.log(`The number --> ${i}`);
    i--;
  }
}

function printEvenNumber(number) {
  let i = 0;
  while (i <= number) {
    if (i % 2 == 0) {
      console.log(`The even number --> ${i}`);
    }
    i++;
  }
}

function sumOfAllNaturalNumber(number) {
  let total = 0;
  let i = 1;
  while (i <= number) {
    total += i;
    i++;
  }
  console.log(`The toatl --> ${total}`);
}

function sumOfAllEvenNumber(n) {
  let sum = 0;
  let i = 2;
  while (i <= n) {
    sum += i;
    i += 2;
  }
  return sum;
}

function sumOfAllOddNumber(number) {
  let sum = 0;
  let i = 1;
  while (i <= number) {
    sum += i;
    i += 2;
  }
  return sum;
}

function factorial(n) {
  if (n < 0) return -1;
  if (n === 0) return 1;
  let result = 1;
  let i = 1;
  while (i <= n) {
    result *= i;
    i++;
  }
  return result;
}

function productOfDigits(num) {
  num = Math.abs(num);
  if (num === 0) return 0;
  let product = 1;
  while (num > 0) {
    digit = num % 10;
    product *= digit;
    num = Math.floor(num / 10);
  }
  return product;
}

function reverse(num) {
  let isNegative = num < 0;
  let n = Math.abs(num);
  let reverse = 0;
  while (n > 0) {
    digit = n % 10;
    reverse = reverse * 10 + digit;
    n = Math.floor(n / 10);
  }
  return isNegative ? -reverse : reverse;
}

function isPalindrome(num) {
  if (num < 0) return false;
  if (num < 10) return true;

  let original = num;
  let reverse = 0;
  while (num > 0) {
    let digit = num % 10;
    reverse = reverse * 10 + digit;
    num = Math.floor(num / 10);
  }

  return original === reverse;
}

function sumOfNumbers(num) {
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  return sum;
}

function isArmstrong(num) {
  if (num < 0) return false;

  let original = num;
  let sum = 0;
  let temp = num;
  let digitCount = 0;

  while (temp > 0) {
    digitCount++;
    temp = Math.floor(temp / 10);
  }

  if (num === 0) return true;
  temp = num;
  while (temp > 0) {
    let digi = temp % 10;
    sum += Math.pow(digi, digitCount);
    temp = Math.floor(temp / 10);
  }
  return sum === original;
}

function isPerfectNumber(num) {
  if (num <= 0) return false;
  let sum = 0;
  let divisior = 1;
  while (divisior <= num / 2) {
    if (num % divisior == 0) {
      sum += divisior;
    }
    divisior++;
  }
  return sum === num;
}

function isPrime(num) {
  if (num < 2) return false;
  let divisor = 2;
  while (divisor * divisor <= num) {
    if (num % divisor === 0) return false;
    divisor++;
  }
  return true;
}

function printPrimeUpto(limit) {
  let num = 2;
  let primes = [];
  while (num <= limit) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  console.log(" Prime number upto " + limit + " : ");
  console.log(primes.join());
}

function printFibonacci(n) {
  if (n <= 0) {
    console.log("Please enter a positive number. ");
    return;
  }
  let a = 0,
    b = 1;
  let count = 0;
  let series = [];
  while (count < n) {
    if (count === 0) {
      series.push(a);
    } else if (count === 1) {
      series.push(b);
    } else {
      let next = a + b;
      series.push(next);
      a = b;
      b = next;
    }
    count++;
  }
  console.log(`Fibonacci series (${n} terms ):`);
  console.log(series.join(" "));
}

function hcf(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

console.log(`HCF --> ${hcf(36, 60)}`);
