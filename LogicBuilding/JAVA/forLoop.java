package JAVA;
public class forLoop {
    public static void main(String[] args) {
        //printNumber1to10();
        //printNumber10to1();
        printEvenNumber(12);
    }

    public static void printNumber1to10(){
        for(int i = 0 ;i<11;i++){
            System.out.println("The number --> "+i);
        }
    }

    public static void printNumber10to1(){
        for(int i = 10 ;i>=0;i--){
            System.out.println("The number --> "+i);
        }
    }

    public static void printEvenNumber(int number){
        for(int i = 0 ;i<=number; i++){
            if(i%2==0){
                System.out.println("The even number --> "+ i);
            }
        }
    }
}
