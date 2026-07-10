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

function toUpperCaseManual(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 97 && code <= 122) {
      result += String.fromCharCode(code - 32);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
function toLoweCaseManual(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(code + 32);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

function areEqualManual(str1, str2) {
  if (str1 == null || str2 == null) {
    return str1 === str2;
  }
  if (str1.length != str2.length) return false;

  for (let i = 0; i < str1.length; i++) {
    if (str1.charAt(i) != str2.charAt(i)) {
      return false;
    }
  }
  return true;
}
function areEqualManualWhile(str1, str2) {
  if (str1 == null || str2 == null) {
    return str1 === str2;
  }
  if (str1.length != str2.length) return false;

  let i = 0;
  while (i < str1.length) {
    if (str1.charAt(i) != str2.charAt(i)) {
      return false;
    }
    i++;
  }
  return true;
}
// console.log(areEqualManual("hello","Hello"))
// console.log(areEqualManualWhile("hello","Hello"))

function firstNonRepetitiveChar(str) {
  const freq = {};
  for (let ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  for (let ch of str) {
    if (freq[ch] === 1) {
      return ch;
    }
  }
  return null;
}
//console.log(firstNonRepetitiveChar("leeltcode"))

function mostFrequentChar(str) {
  if (str.length === 0) return null;
  const freq = {};
  for (let ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  let maxCount = 0;
  let maxChar = str[0];
  for (let ch in freq) {
    if (freq[ch] > maxCount) {
      maxCount = freq[ch];
      maxChar = ch;
    }
  }
  return maxChar;
}
//console.log(mostFrequentChar("successfull"))

function removeDuplicates(str) {
  const seen = new Set();
  let result = "";
  for (const ch of str) {
    if (!seen.has(ch)) {
      seen.add(ch);
      result += ch;
    }
  }
  return result;
}
console.log(removeDuplicates("sucessfull"));

/*
Check if a string is a rotation of another string (e.g."abcd" and "cdab").
In javascript we use .includes mehtod in the return statement 
ie return (str1+str1).include(str2)
*/

//Find all substrings of a given string
function findAllSubString(str) {
  const substrings = [];
  const n = str.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      substrings.push(str.substring(i, j + 1));
    }
  }
  return substrings;
}
const result = findAllSubString("abcdefg");
console.log(result);
