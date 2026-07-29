package JAVA;

public class RecurssionPractice {

    public static void printName(int count,String name,int N){
      
        if(count==N){
            return;
        }
        System.out.print(name+" ");
        printName(count+1, name, N);
        
    }

    public static void printNumber(int current,int n){
        if(current>n){
            return;
        }
        System.out.print(current+" ");
        printNumber(current+1, n);
        
    }
    public static void main(String[] args) {
        printName(0, "Shubham", 7);
        printNumber(1,10);
    }
    
}
