package JAVA;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringLogics {

    public static boolean isPalindrome(String str) {
        String cleaned = str.replace("\\str", "").toLowerCase();
        int left = 0;
        int right = cleaned.length() - 1;
        while (left < right) {
            if (cleaned.charAt(left) != cleaned.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static Map<String, Integer> countVowelsAndConsonants(String str) {
        String vowels = "aeiou";
        int vowelCount = 0;
        int consonantsCount = 0;
        for (int i = 0; i < str.length(); i++) {
            char ch = Character.toLowerCase(str.charAt(i));
            if (ch >= 'a' && ch <= 'z') {
                if (vowels.indexOf(ch) != -1) {
                    vowelCount++;
                } else {
                    consonantsCount++;
                }
            }

        }
        Map<String, Integer> result = new HashMap<>();
        result.put("vowels", vowelCount);
        result.put("consonants", consonantsCount);
        return result;

    }

    public static int countWordsSplit(String str) {
        if (str == null || str.trim().isEmpty())
            return 0;
        String[] word = str.trim().split("\\S+");
        return word.length;
    }

    public static int countWordRegex(String str) {
        Pattern pattern = Pattern.compile("\\S+");
        Matcher matcher = pattern.matcher(str);
        int count = 0;
        while (matcher.find()) {
            count++;
        }
        return count;
    }

    public static String toUpperCaseManual(String str) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            int code = (int) ch;
            if (code >= 97 && code <= 122) {
                result.append((char) (code - 32));
            } else {
                result.append(ch);
            }
        }
        return result.toString();
    }

    public static String toLowerCaseManual(String str) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            int code = (int) ch;
            if (code >= 65 && code <= 90) {
                result.append((char) (code + 32));
            } else {
                result.append(ch);
            }
        }
        return result.toString();
    }

    public static boolean areEqualManual(String str1, String str2) {
        if (str1 == null || str2 == null) {
            return str1 == str2;
        }
        if (str1.length() != str2.length()) {
            return false;
        }
        for (int i = 0; i < str1.length(); i++) {
            if (str1.charAt(i) != str2.charAt(i)) {
                return false;
            }
        }
        return true;
    }

    public static boolean areEqualManualWhile(String str1, String str2) {
        if (str1 == null || str2 == null) {
            return str1 == str2;
        }
        if (str1.length() != str2.length()) {
            return false;
        }
        int i = 0;
        while (i < str1.length()) {
            if (str1.charAt(i) != str2.charAt(i)) {
                return false;
            }
            i++;
        }
        return true;

    }

    public static Character firstNonRepitativeChar(String str) {
        if (str == null || str.isEmpty())
            return null;
        Map<Character, Integer> freq = new HashMap<>();
        for (char ch : str.toCharArray()) {
            freq.put(ch, freq.getOrDefault(ch, 0) + 1);
        }
        for (char ch : str.toCharArray()) {
            if (freq.get(ch) == 1) {
                return ch;
            }
        }
        return null;
    }

    public static Character mostFreqCharacter(String str) {
        if (str.length() == 0)
            return null;
        Map<Character, Integer> freq = new HashMap<>();
        for (char ch : str.toCharArray()) {
            freq.put(ch, freq.getOrDefault(ch, 0) + 1);
        }
        char maxChar = str.charAt(0);
        int maxCount = 0;
        for (Map.Entry<Character, Integer> entry : freq.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                maxChar = entry.getKey();
            }
        }
        return maxChar;
    }

    public static String removeDuplicate(String str){
        Set<Character> seen = new HashSet<>();
        StringBuilder result = new StringBuilder();
        for (char ch : str.toCharArray()){
            if(!seen.contains(ch)){
                seen.add(ch);
                result.append(ch);
            }
        }
        return result.toString();
        
    }
    /*
    Check if a string is a rotation of another string (e.g."abcd" and "cdab").
    In java we use .contains mehtod in the return statement 
    ie return (str1+str1).contains(str2)
     */


    //Find all substrings of a given string
    public static List<String> findAllSubstrings(String str){
        List<String> substrings = new ArrayList<>();
        int n = str.length();
        for ( int i = 0 ; i< n ; i++){
            for (int j = i ; j<n ; j++){
                substrings.add(str.substring(i,j+1));
            }
        }
        return substrings;
    }
    public static void main(String[] args) {
       
        List <String> result = findAllSubstrings("abcdefg");
        System.out.println(result);
    }

}
