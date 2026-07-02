package JAVA;

import java.util.Scanner;

public class BreakAndContinueLogic {

    public static int sumWihtoutZeros(int [] nums){
        int sum = 0;
        for(int n : nums){
            if(n ==0) continue;
            sum+=n;
        }
        return sum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int [] nums = new int[5];
        System.out.println("Enter 5 numbers: ");
        for(int i = 0;i<5;i++){
            nums[i]= sc.nextInt();
        }
        System.out.println("Sum excludeing zeros : "+ sumWihtoutZeros(nums));
        sc.close();
    }
    
}
