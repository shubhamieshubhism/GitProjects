package JAVA;

public class whileLoop {

    public static void printNumber1to10() {
        int i = 1;
        while (i <= 10) {
            System.out.println("The number --> " + i);
            i++;
        }

    }

    public static void printNumber10to1() {
        int i = 10;
        while (i >= 1) {
            System.out.println("The number --> " + i);
            i--;
        }
    }

    public static void printEvenNumber(int number) {
        int i = 1;
        while (i <= number) {
            if (i % 2 == 0) {
                System.out.println("The even Number --> " + i);
            }
            i++;

        }
    }

    public static void sumOfAllNatualNumber(int number) {
        int total = 0;
        int i = 1;
        while (i < number) {
            total += i;
            i++;
        }

        System.out.println("The total --> " + total);
    }

    public static void sumOfAllEvenNumber(int n) {
        int sum = 0;
        int i = 2;
        while (i <= n) {
            sum += i;
            i += 2;
        }
        System.out.println("The sum of all the even numbers --> " + sum);
    }

    public static void sumOfAllOddNumbers(int n) {
        int sum = 0;
        int i = 1;
        while (i <= n) {
            sum += i;
            i += 2;
        }
        System.out.println("The sum of all the odd numbers --> " + sum);
    }

    public static void factorial(int n) {
        int resutl = 1;
        int i = 1;
        while (i <= n) {
            resutl *= i;
            i++;
        }
        System.out.println("The factorial of a number --> " + resutl);
    }

    public static int productOfDigits(int num) {
        num = Math.abs(num);
        if (num == 0) {
            return 0;
        }
        int product = 1;
        while (num > 0) {
            int digit = num % 10;
            product *= digit;
            num /= 10;

        }
        return product;
    }

    public static int revrese(int num) {
        boolean isNegative = num < 0;
        int n = Math.abs(num);
        int reverse = 0;
        while (n > 0) {
            int digit = n % 10;
            reverse = reverse * 10 + digit;
            n /= 10;
        }
        return isNegative ? -reverse : reverse;
    }

    public static boolean isPalindrome(int num) {
        if (num < 0) {
            return false;
        }
        if (num < 10) {
            return true;
        }

        int original = num;
        int reverse = 0;
        while (num > 0) {
            int digit = num % 10;
            reverse = reverse * 10 + digit;
            num /= 10;
        }

        return original == reverse;
    }

    public static int sumOfNumber(int num) {
        int sum = 0;
        while (num > 0) {
            sum += num % 10;
            num /= 10;
        }
        return sum;
    }

    public static boolean isArmstrong(int num) {
        if (num < 0)
            return false;
        int original = num;
        int digiCounter = 0;
        int temp = num;
        while (temp > 0) {
            digiCounter++;
            temp /= 10;
        }
        if (num == 0)
            return true;
        int sum = 0;
        temp = num;
        while (temp > 0) {
            int digit = temp % 10;
            sum += Math.pow(digit, digiCounter);
            temp /= 10;
        }
        return sum == original;
    }

    public static boolean isPerfectNumber(int num) {
        if (num <= 0)
            return false;
        int sum = 0;
        int divisor = 1;
        while (divisor <= num / 2) {
            if (num % divisor == 0) {
                sum += divisor;
            }
            divisor++;
        }
        return sum == num;
    }

    public static boolean isPrime(int n) {
        if (n < 2)
            return false;
        int divisor = 2;
        while (divisor * divisor <= n) {
            if (n % divisor == 0)
                return false;
            divisor++;
        }
        return true;
    }

    public static void printPrimesUpto(int limit) {
        System.out.print("Prime numbers upto " + limit + " : " );
        int num = 2;
        boolean first = true;
        while(num<=limit){
            if(isPrime(num)){
                if(!first) 
                    //System.out.println(" ");
                System.out.print(" "+num);
                first = false;
            }
            num++;
        }
        //System.out.println();

    }

    public static int hcf(int a, int b){
        a=Math.abs(a);
        b=Math.abs(b);
        while (b!=0){
            int temp = b;
            b= a%b;
            a = temp;
        }
        return a;
    }

    public static void main(String[] args) {
       printPrimesUpto(100);
    }

}
