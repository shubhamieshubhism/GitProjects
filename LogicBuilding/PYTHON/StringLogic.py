import re

def is_palindrome(s):
    cleaned = ''.join(s.split()).lower()
    left = 0
    right = len(cleaned) - 1
    
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left +=1
        right -= 1
    return True

def is_palindrome_using_method(str):
    cleaned = ''.join(str.split()).lower()
    return cleaned == cleaned[::-1]

def count_vowels_and_consoanants(s):
    vowels = "aeiou"
    vowels_count=0
    consonants_count=0
    for ch in s:
        ch_lower = ch.lower()
        if(ch_lower in vowels):
            vowels_count +=1
        else:
            consonants_count+=1
    
    return {'vowels':vowels_count,'consonants':consonants_count}
    
def count_word_spits(s):
    return len(s.split())
def count_word_regex(s):
    matches = re.findall(r'\S+',s)
    return len(matches)
def count_words_loop(s):
    count = 0
    in_word = False
    for ch in s:
        if ch not in ' \t\n':
            if not in_word:
                count+=1
                in_word = True
        else:
            in_word=False
    return count

def to_upper_case_manual(s):
    result = []
    for ch in s:
        code = ord(ch)
        if 97 <= code <= 122:
            result.append(chr(code -32))
        else:
            result.append(ch)
    return ''.join(result)
def to_lower_case_manual(s):
    result=[]
    for ch in s:
        code = ord(ch)
        if(65<= code <= 90):
            result.append(chr(code +32))
        else:
            result.append(ch)
    return ''.join(result)
text = "Hello World! 123"
print(to_upper_case_manual(text))
print(to_lower_case_manual(text))