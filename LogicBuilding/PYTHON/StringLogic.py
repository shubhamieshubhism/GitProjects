def is_palindrome(s):
    cleaned = "".join(s.split()).lower()
    left = 0
    right = len(cleaned) - 1

    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True


def is_palindrome_using_method(str):
    cleaned = "".join(str.split()).lower()
    return cleaned == cleaned[::-1]


def count_vowels_and_consoanants(s):
    vowels = "aeiou"
    vowels_count = 0
    consonants_count = 0
    for ch in s:
        ch_lower = ch.lower()
        if ch_lower in vowels:
            vowels_count += 1
        else:
            consonants_count += 1

    return {"vowels": vowels_count, "consonants": consonants_count}


def count_word_spits(s):
    return len(s.split())


import re


def count_word_regex(s):
    matches = re.findall(r"\S+", s)
    return len(matches)


def count_words_loop(s):
    count = 0
    in_word = False
    for ch in s:
        if ch not in " \t\n":
            if not in_word:
                count += 1
                in_word = True
        else:
            in_word = False
    return count


def to_upper_case_manual(s):
    result = []
    for ch in s:
        code = ord(ch)
        if 97 <= code <= 122:
            result.append(chr(code - 32))
        else:
            result.append(ch)
    return "".join(result)


def to_lower_case_manual(s):
    result = []
    for ch in s:
        code = ord(ch)
        if 65 <= code <= 90:
            result.append(chr(code + 32))
        else:
            result.append(ch)
    return "".join(result)


# text = "Hello World! 123"
# print(to_upper_case_manual(text))
# print(to_lower_case_manual(text))


def are_equal_manual(str1, str2):
    if str1 is None or str2 is None:
        return False
    if len(str1) != len(str2):
        return False
    for i in range(len(str1)):
        if str1[i] != str2[i]:
            return False
    return True


def are_equal_manual_while(str1, str2):
    if str1 is None or str2 is None:
        return False
    if len(str1) != len(str2):
        return False
    i = 0
    while i < len(str1):
        if str1[i] != str2[i]:
            return False
        i += 1
    return True


# print(are_equal_manual("Hello","Hello"))
# print(are_equal_manual_while("hello","Hello"))


def first_non_repetetive_char(str):
    freq = {}
    for ch in str:
        freq[ch] = freq.get(ch, 0) + 1
    for ch in str:
        if freq[ch] == 1:
            return ch
    return None


# print(first_non_repetetive_char("leetcode"))


def most_freaquent_char(s):
    if not s:
        return None
    freq={}
    max_char = s[0]
    max_count = 0
    for ch in s:
        freq[ch] = freq.get(ch,0)+1
        if freq[ch] > max_count:
            max_count = freq[ch]
            max_char = ch
    return max_char
#print(most_freaquent_char("leetcode"))

def remove_duplicates(s):
    seen = set()
    result =[]
    for ch in s:
        if ch not in seen:
            seen.add(ch)
            result.append(ch)
    return ''.join(result)
print(remove_duplicates("leetcode"))

# Check if a string is a rotation of another string (e.g."abcd" and "cdab").
#     In python we use .in keyword in the return statement 
#     ie return s2 in (s1+s1)

#Find all substrings of a given string
def find_all_substring(s):
    substrings = []
    n = len(s)
    for i in range(n):
        for j in range(i,n):
            substrings.append(s[i:j+1])
    return substrings
result = find_all_substring("abcdec")
print(result)
    

