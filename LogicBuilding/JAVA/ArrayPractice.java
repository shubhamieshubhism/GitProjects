package JAVA;

import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;


public class ArrayPractice {
    

    public static int findLargestElement(int[] arr) {
        int n = arr.length;
        int max = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }

    public static int secondSmallest(int[] arr) {
        int n = arr.length;
        int small = Integer.MAX_VALUE;
        int secondSmall = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            if (arr[i] < small) {
                secondSmall = small;
                small = arr[i];
            } else if (arr[i] < secondSmall && arr[i] != small) {
                secondSmall = arr[i];
            }
        }
        return secondSmall;
    }

    public static int secondLargest(int[] nums) {
        int n = nums.length;
        int large = Integer.MIN_VALUE;
        int secondLarge = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            if (nums[i] > large) {
                secondLarge = large;
                large = nums[i];
            } else if (nums[i] > secondLarge && nums[i] != large) {
                secondLarge = nums[i];
            }
        }
        return secondLarge;
    }

    public static boolean isSorted(int [] nums) {
        int n = nums.length;
        for (int i = 1; i < n; i++) {

            if (nums[i] < nums[i - 1])
                return false;
        }
        return true;
    }

    public static int linnearSearch(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static List<Integer> findUnion(int[] arr1, int[] arr2) {
        TreeMap<Integer, Integer> freq = new TreeMap<>();
        for (int i = 0; i < arr1.length; i++) {
            freq.put(arr1[i], freq.getOrDefault(arr1[i], 0) + 1);
        }
        for (int i = 0; i < arr2.length; i++) {
            freq.put(arr2[i], freq.getOrDefault(arr2[i], 0) + 1);
        }
        List<Integer> union = new ArrayList<>();
        for (int key : freq.keySet()) {
            union.add(key);
        }
        return union;
    }

    public static int[] moveZeros(int[] nums) {
        int j = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 0) {
                j = i;
                break;
            }
        }

        if (j == -1)
            return new int[0];

        for (int i = j + 1; i < nums.length; i++) {
            if (nums[i] != 0) {
                int temp = nums[i];
                nums[i] = nums[j];
                nums[j] = temp;
                j++;
            }
        }

        return nums;

    }

    public static int missingNumber(int[] nums) {
        int maxNumber = nums[0];
        for(int num : nums){
            if(num > maxNumber){
                maxNumber=num;
            }
        }
        int expectedSum = maxNumber * (maxNumber+1)/2;
        int actualSum = 0;
        for(int num : nums){
            actualSum+=num;
        }
        return expectedSum - actualSum;
    }

    public static int findMaximumConsOne(int [] nums){
        int count = 0;
        int max = 0;
        for(int i =0;i<nums.length;i++){
            if(nums[i]==1){
                count++;
            }else{
                count=0;
            }
            max=Math.max(max, count);
        }
        return max;
    }

    public static void main(String[] args) {
        int[] nums1 = { 1,1,0,0,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1};
        System.out.println("The consicutive ones in a row  --> " + findMaximumConsOne(nums1));
        
    

    }

}
