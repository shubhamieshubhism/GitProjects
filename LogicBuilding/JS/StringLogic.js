function isPalindromeUsingCharAt(str) {
  const cleaned = str.replace(/\s/g, "").toLowerCase();
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned.charAt(left) !== cleaned.charAt(right)) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

function isPalindromeUsingMethod(str) {
  const cleaned = str.replace(/\s/g, "").toLowerCase();
  return cleaned === cleaned.split("").reverse().join("");
}

function countvowelsAndConsonants(str) {
  const vowels = "aeiou";
  let vowelsCount = 0;
  let consonantCOunt = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i).toLowerCase();
    if (ch >= "a" && ch <= "z") {
      if (vowels.includes(ch)) {
        vowelsCount++;
      } else {
        consonantCOunt++;
      }
    }
  }
  return { vowels: vowelsCount, consonants: consonantCOunt };
}

function countWOrdSSplit(str) {
  return str
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}
function countWordRegex(str) {
  const match = str.match(/\S+/g);
  return match ? match.length : 0;
}
function countWordsLoop(str) {
  let count = 0;
  let inWord = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== " " && str[i] !== "\t" && str[i] !== "\n") {
      if (!inWord) {
        count++;
        inWord = true;
      }
    } else {
      inWord = false;
    }
  }
  return count;
}

function toUpperCaseManual(str){
    let result ='';
    for (let i =0;i<str.length;i++){
        const code =str.charCodeAt(i)
        if(code >= 97 && code <= 122){
            result += String.fromCharCode(code -32)
        }else{
            result += str.charAt(i)
        }
    }
    return result
}
function toLoweCaseManual(str){
    let result =''
    for(let i=0;i<str.length;i++){
        const code = str.charCodeAt(i)
        if(code >=65 && code <= 90){
            result+=String.fromCharCode(code + 32)
        }else{
            result+= str.charAt(i)
        }
    }
    return result
}

const text = 'Hello world ! 123'
console.log(toLoweCaseManual(text))
console.log(toUpperCaseManual(text))
