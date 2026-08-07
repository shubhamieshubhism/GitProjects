package JAVA;

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

    public static int findMin(int[] nums) {
        int minVal = Integer.MAX_VALUE;
        for (int i = 0; i < nums.length; i++) {
            minVal = Math.min(minVal, nums[i]);
        }
        return minVal;
    }

    public static int findMax(int[] nums) {
        int maxVal = -1;
        for (int i = 0; i < nums.length; i++) {
            maxVal = Math.max(maxVal, nums[i]);
        }
        return maxVal;
    }

    public static int findRotations(int[] arr) {
        int n = arr.length;
        int minVal = arr[0];
        int minIndex = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] < minVal) {
                minVal = arr[i];
                minIndex = i;
            }
        }
        return minIndex;
    }

    public static int singleNonDuplicate(int[] arr) {
        int n = arr.length;
        // when the length of the array is 1
        if (n == 1)
            return arr[0];
        // when the non duplicate is first or last
        if (arr[0] != arr[1])
            return arr[0];
        if (arr[n - 1] != arr[n - 2])
            return arr[n - 1];
        // Binary seach for other element excluding the first and last
        int low = 1;
        int high = n - 2;
        while (low <= high) {
            int mid = (low + high) / 2;

            if (arr[mid] != arr[mid + 1] && arr[mid] != arr[mid - 1])
                return arr[mid];

            if ((mid % 2 == 1 && arr[mid] != arr[mid - 1]) ||
                    (mid % 2 == 0 && arr[mid] != arr[mid + 1])) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }

        }
        return -1;
    }

    public static int findPeakElement(int[] nums) {
        int n = nums.length;
        System.out.println(n);
        for (int i = 0; i < n; i++) {
            boolean left = (i == 0) || (nums[i] >= nums[i - 1]);
            boolean right = (i == n - 1) || (nums[i] >= nums[i + 1]);
            if (left && right)
                return i;
        }
        return -1;
    }

    public static int findPeakElementV2(int[] nums) {
        int low = 0;
        int high = nums.length - 1;
        while (low < high) {
            int mid = (low + high) / 2;
            if (nums[mid] > nums[mid + 1]) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }

    public static void main(String[] args) {
        int[] nums = { 1, 3, 20, 4, 1, 0 };
        int index = findPeakElementV2(nums);
        System.out.println("peak at index: " + index + " with value: " + nums[index]);
    }

}
