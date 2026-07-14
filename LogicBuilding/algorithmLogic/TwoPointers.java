package algorithmLogic;

import java.lang.reflect.Array;
import java.util.Arrays;

/**
 * TwoPointers
 */
public class TwoPointers {

    public static void moveZero(int [] nums){
        int left =0;// pointers for placing non zeros elements

        for(int right = 0 ;right <nums.length;right++){
            if(nums[right]!=0){
                int temp = nums[left];
                nums[left] = nums[right];
                nums[right] = temp;
                left++;
            }
        }
    }

    public static int maxArea(int [] height){
        int left =0;
        int right = height.length-1;
        int maxArea = 0;
        while(left<right){
            int minHeight = Math.min(height[left], height[right]);
            int weidth = right - left;
            int area = minHeight * weidth;
            maxArea = Math.max(maxArea, area);
            if(height[left]<height[right]){
                left++;
            }else{
                right--;
            }
        }
        return maxArea;
    }
    public static void main(String[] args) {
        int [] height= {6,5,1,3,5,6,8,5};
        int result = maxArea(height);
        System.out.println("Maxium area --> "+result);

    }
}