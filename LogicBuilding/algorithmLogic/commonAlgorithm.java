package algorithmLogic;

/**
 * commonAlgorithm
 */
public class commonAlgorithm {

    /*
    Sliding window 
    Constandt window
    
    */
    public static int maxSumFixed(int [] arr , int k){

        if(arr.length <k) return -1;
        int windowSum= 0;
        //sum of first k element
        for (int i =0;i<k;i++){
            windowSum+=arr[i];
        }
        int maxSum = windowSum;
        //sliding window
        for(int i = k;i<arr.length;i++){
            windowSum+=arr[i]-arr[i-k];
            maxSum=Math.max(maxSum, windowSum);
        }
        return maxSum;
    }
    public static void main(String[] args) {
        int arr [] = {1,2,4,5,6,7,9};
        System.out.println("The sum of maxSubarray --> "+ maxSumFixed(arr, 3));
    }
}