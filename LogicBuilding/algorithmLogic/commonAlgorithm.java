package algorithmLogic;

import java.util.ArrayList;
import java.util.List;

/**
 * commonAlgorithm
 */
public class commonAlgorithm {

    /*
     * Sliding window
     * Constandt window
     * 
     */
    public static int maxSumFixed(int[] arr, int k) {

        if (arr.length < k)
            return -1;
        int windowSum = 0;
        // sum of first k element
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        int maxSum = windowSum;
        // sliding window
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }

    public static boolean findLeapYear(int n) {
        if (n % 4 == 0) {
            if (n % 100 == 0) {
                return n % 400 == 0;
            }
            return true;
        }
        return false;
    }

    public static void smallestElement(int[] arr) {
        int smallest = Integer.MAX_VALUE;
        int secondSmallest = Integer.MAX_VALUE;

        for (int num : arr) {
            if (num < smallest) {
                secondSmallest = smallest;
                smallest = num;
            } else if (num > smallest && num < secondSmallest) {
                secondSmallest = num;
            }
        }
        System.out.println("Smallest element --> " + smallest);
        System.out.println("SecondSmallest --> " + secondSmallest);
    }

    public static void swapNumberWithoutUsingTemporaryVariable(int a, int b) {
        a = a + b;
        b = a - b;
        a = a - b;
        System.out.println("After swapping");
        System.out.println("a --> " + a);
        System.out.println("b --> " + b);
    }

    public static void isPerfectsquare(int n) {
        boolean isSquare = false;
        for (int i = 1; i * i <= n; i++) {
            if (i * i == n) {
                isSquare = true;
                break;
            }
        }
        if (isSquare) {
            System.out.println(n + " is a perfect square");
        } else {
            System.out.println(n + " is not a perfect square");
        }
    }

    public static String gcdString(String str1, String str2) {
        if (!(str1 + str2).equals(str2 + str1)) {
            return "String is not consistent";
        }
        int lenGCD = gcd(str1.length(), str2.length());
        return str1.substring(0, lenGCD);

    }

    private static int gcd(int len1, int len2) {
        int minVal = Math.min(len1, len2);
        for (int i = minVal; i > 0; i--) {
            if (len1 % i == 0 && len2 % i == 0) {
                return i;
            }
        }
        return 1;
    }

    public static List<List<Integer>> generate(int numRow) {
        List<List<Integer>> res = new ArrayList<>();
        res.addLast(List.of(1));
        for (int i = 0; i < numRow; i++) {
            List<Integer> dummyRow = new ArrayList<>();
            dummyRow.add(0);
            dummyRow.addAll(res.get(res.size() - 1));
            dummyRow.add(0);
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j < dummyRow.size()-1; j++) {
                row.add(dummyRow.get(j) + dummyRow.get(j + 1));
            }
            res.add(row);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(generate(5));
    }
}