package JAVA;

import java.util.Arrays;

public class SearchAlgorithms {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (target > left) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    public static int findLowerBound(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        int answer = arr.length;
        while (left <= right) {
            // int mid = left + (right - left) / 2;
            int mid = (left + right) / 2;
            if (arr[mid] >= target) {
                answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return answer;

    }

    public static int findMin(int[] nums){
        int minVal = Integer.MAX_VALUE;
        for(int i =0;i<nums.length;i++){
            minVal=Math.min(minVal, nums[i]);
        }
        return minVal;
    }

    public static int findMax(int[] nums){
        int maxVal = -1;
        for(int i =0;i<nums.length;i++){
            maxVal=Math.max(maxVal, nums[i]);
        }
        return maxVal;
    }

    public static int findRotations(int []arr){
        int n = arr.length;
        int minVal=arr[0];
        int minIndex=0;
        for(int i =0;i<n;i++){
            if(arr[i]< minVal){
                minVal = arr[i];
                minIndex = i;
            }
        }
        return minIndex;
    }

    public static void main(String[] args) {
        int[] arr = { 3,4,5,6,7,0,1,2};
        System.out.println(findRotations(arr));
    }

}
