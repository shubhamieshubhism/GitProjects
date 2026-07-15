package JAVA;

public class Patterns {
    /*
    5 4 3 2 1 
    5 4 3 2 
    5 4 3 
    5 4 
    5 
    */
    public static void pattern6(int N){
        for( int i = 0;i<N;i++){
            for(int j = N;j>i;j--){
                System.out.print(j+" ");
            }
            System.out.println();
        }
    }

    /*
    1 2 3 4 5 
    1 2 3 4 
    1 2 3 
    1 2 
    1 
    */
    public static void pattern7(int N){
        for( int i = 0;i<N;i++){
            for(int j = N;j>i;j--){
                System.out.print(N-j+1+" ");
            }
            System.out.println();
        }
    }
    public static void main(String[] args) {
        pattern6(5);
        pattern7(5);
    }
    
}
