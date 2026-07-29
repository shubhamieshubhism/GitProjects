package JAVA;

import java.util.ArrayList;
import java.util.List;

public class BasicMath {
    public static int countDigigtsByBrutForce(int n) {
        int count = 0;
        while (n > 0) {
            count += 1;
            n /= 10;
        }
        return count;
    }

    public static int countDigitByOptimumLogic(int n) {
        int count = (int) (Math.log10(n) + 1);
        return count;
    }

    public static int reverseNumber(int n) {
        int revNum = 0;
        while (n > 0) {
            int lastDigit = n % 10;
            revNum = revNum * 10 + lastDigit;
            n /= 10;
        }
        return revNum;
    }
    public static boolean palindromeNumber(int n){
        int originalNum=n;
        int rev = reverseNumber(n);
        return originalNum==rev;
    }
    public static int findgcd(int n1,int n2){
        int gcd = 1;
        for(int i =1;i<=Math.min(n1, n2);i++){
            if(n1%i==0 && n2%i==0){
                gcd=i;
            }
        }
        return gcd;
    }
    public static boolean isArmstrong(int num){
        int k=String.valueOf(num).length();
        int sum = 0;
        int n=num;
        while(n>0){
            int ld=n%10;
            sum+=Math.pow(ld, k);
            n/=10;
        }
        return sum==num;
    }
    public static List<Integer>getDivisior(int n){
        List<Integer>res = new ArrayList<>();
        for(int i =1;i<=n;i++){
            if(n%i==0){
                res.add(i);
            }
        }
        return res;
    }

    public static boolean checkPrime(int n){
        int count =0;
        for(int i =1;i<=n;i++){
            if(n%i==0){
                count++;
            }
        }
        return count==2;
    }

    public static void primeNumberInLimit(int limit){
        for(int i=2;i<=limit;i++){
            if(checkPrime(i)){
                System.out.print(i+" ");
            }
        }
    }

    public static List<Integer> factorial(int n){
        List<Integer>factoria=new ArrayList<>();
        int fact = 1;
        for(int i =1;i<=n;i++){
            fact = fact*i;
            factoria.add(fact);
        }
        return factoria;
    }

    public static void main(String[] args) {
        
        //System.out.println(checkPrime(14));
       System.out.println(factorial(5));
    }

}
