package JAVA;

public class Patterns {
    /*
     * 5 4 3 2 1
     * 5 4 3 2
     * 5 4 3
     * 5 4
     * 5
     */
    public static void pattern6(int N) {
        for (int i = 0; i < N; i++) {
            for (int j = N; j > i; j--) {
                System.out.print(j + " ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    /*
     * 1 2 3 4 5
     * 1 2 3 4
     * 1 2 3
     * 1 2
     * 1
     */
    public static void pattern7(int N) {
        for (int i = 0; i < N; i++) {
            
            for (int j = N; j > i; j--) {
                System.out.print(N - j + 1 + " ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    public static void pattern7v2(int N) {
        for (int i = 0; i < N; i++) {
            int num = 1;
            for (int j = N; j > i; j--) {
                System.out.print(num+ " ");
                num++;
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }
    

    /*
     *    
    ***   
    *****  
    ******* 
    *********
    */
    public static void pyramidPattern(int n) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                System.out.print("  ");
            }
            for (int j = 0; j < 2 * i + 1; j++) {
                System.out.print("* ");
            }
            // for(int j =0 ; j<n-i-1;j++){
            // System.out.print(" ");
            // }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    public static void reversePyramidPattern(int n) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print("  ");
            }
            for (int j = 0; j < 2 * n - (2 * i + 1); j++) {
                System.out.print("* ");
            }
            // for(int j=0;j<i;j++){
            // System.out.print(" ");
            // }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    /*
            *
          * * *
        * * * * *
      * * * * * * *
    * * * * * * * * *
      * * * * * * *
        * * * * *
          * * *
            *
    */

    public static void dimondPattern(int n ){
        for(int i = 0 ; i<n ; i++){
            for(int j =0;j<n-i-1;j++){
                System.out.print("  ");
            }
            for(int j = 0;j<2*i+1;j++){
                System.out.print("* ");
            }
            System.out.println();
        }
        for(int i = n-2;i>=0;i--){
            for(int j =0;j<n-i-1;j++){
                System.out.print("  ");
            }
            for(int j = 0;j<2*i+1;j++){
                System.out.print("* ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    /*
    
    *
    * *
    * * *
    * * * *
    * * * * *
    * * * *
    * * *
    * *
    *
    * */
    public static void rightHalfDirmondPattern(int n){
        for(int i = 1; i<=2*n-1;i++){
            int star = i;
            if(i>n){
                star = 2*n-i;
            }
            for(int j=1;j<=star;j++){
                System.out.print("* ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    /*
    
    1
    0 1
    1 0 1
    0 1 0 1
    1 0 1 0 1*/
    public static void zeroOnePyramidpattern(int n){
        int start;
        for(int i =0;i<n;i++){
            if(i%2==0) start = 1;
            else start = 0;
            for(int j =0;j<=i;j++){
                System.out.print(start+" ");
                start = 1-start;
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");

    }

    /*
    1                         1
    1 2                     2 1
    1 2 3                 3 2 1
    1 2 3 4             4 3 2 1
    1 2 3 4 5         5 4 3 2 1
    1 2 3 4 5 6     6 5 4 3 2 1
    1 2 3 4 5 6 7 7 6 5 4 3 2 1
    */
    public static void numberCrownPattern(int n){
        int space = 2*(n-1);
        for (int i =1 ; i<=n;i++){
            for(int j = 1;j<=i ;j++){
                System.out.print(j+" ");
            }
            for(int j= 1;j<=space;j++){
                System.out.print("  ");
            }
            for(int j =i;j>=1;j--){
                System.out.print(j+" ");
            }
            System.out.println();
            space-=2;
        }
        System.out.println("---------------------------------------------------------");
    }

    /*
    1
    2 3
    4 5 6
    7 8 9 10
    11 12 13 14 15
    */
    public static void increaseNumberTrianglePattern(int n){
        int num = 1;
        for(int i=1;i<=n ; i++){
            for(int j=1;j<=i;j++){
                System.out.print(num + " ");
                num = num+1;
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }
    /*    
    A
    A B
    A B C
    A B C D
    A B C D E
    A B C D E F*/
    public static void letterTrianglePattern(int n ){
        for(int i =0 ;i<n;i++){
            for(char ch = 'A';ch<='A'+i;ch++){
                System.out.print(ch+" ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    /*
    A B C D E
    A B C D
    A B C
    A B
    A
    */
    public static void reverseTrianglePattern(int n){
        for(int i = 0 ;i<=n;i++){
            for(char ch='A';ch<='A'+(n-i-1);ch++){
                System.out.print(ch+ " ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    /*
    A
    B B
    C C C
    D D D D
    E E E E E
    */
    public static void alphaRampPattern(int n){
        for(int i=0;i<n;i++){
            char ch = (char)('A'+i);
            for(int j = 0;j<=i;j++){
                System.out.print(ch+" ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }

    public static void alphaHillPattern(int n){
        for(int i = 0;i<n;i++){

            for(int j=0;j<n-i-1;j++){
                System.out.print(" ");
            }
            char ch = 'A';
            int breakPoint = (2*i+1)/2;
            for (int j = 1; j <= 2 * i + 1; j++) {
                System.out.print(ch);
                if(j<=breakPoint) ch++;
                else ch--;
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");
    }


    /*
    * * * * * * * * * *
    * * * *     * * * *
    * * *         * * *
    * *             * *
    *                 *
    *                 *
    * *             * *
    * * *         * * *
    * * * *     * * * *
    * * * * * * * * * *
    
    */
    public static void symetricVoidPattern(int n){
        //upper half
        int inis = 0;
        for(int i=0;i<n;i++){
            for(int j=1;j<=n-i;j++){
                System.out.print("* ");
            }
            for(int j =0;j<inis;j++){
                System.out.print("  ");
            }
            for(int j=1;j<=n-i;j++){
                System.out.print("* " );
            }
            inis+=2;
            System.out.println();
        }

        //LowerHalf
        inis=2*n-2;
        for(int i =1;i<=n;i++){
            for(int j=1;j<=i;j++){
                System.out.print("* ");
            }
            for(int j =0;j<inis;j++){
                System.out.print("  ");
            }
            for(int j=1;j<=i;j++){
                System.out.print("* ");
            }
            inis-=2;
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");

    }

    public static void symetricButterfly(int n){
        //for upper half
        for(int i =1;i<=n;i++){
            for(int j=1;j<=i;j++){
                System.out.print("* ");
            }
            for(int j=1;j<=2*(n-i);j++){
                System.out.print("  ");
            }
            for(int j=1;j<=i;j++){
                System.out.print("* ");
            }
            System.out.println();
        }

        //for lower half
        for(int i =n-1;i>=1;i--){
            for(int j=1;j<=i;j++){
                System.out.print("* ");
            }
            for(int j=1;j<=2*(n-i);j++){
                System.out.print("  ");
            }
            for(int j=1;j<=i;j++){
                System.out.print("* ");
            }
            System.out.println();
        }
        System.out.println("---------------------------------------------------------");


    }



    public static void main(String[] args) {
        System.out.println("---------------------------------------------------------");
        // pattern6(5);
        // pattern7(5);
        // pyramidPattern(5);
        // reversePyramidPattern(5);
        // dimondPattern(5);
        // rightHalfDirmondPattern(5);
        // zeroOnePyramidpattern(5);
        // numberCrownPattern(4);
        // increaseNumberTrianglePattern(5);
        // letterTrianglePattern(6);
        // reverseTrianglePattern(5);
        // alphaRampPattern(5);
        // alphaHillPattern(5);
        // symetricVoidPattern(6);
        // symetricButterfly(5);
        pattern7v2(5);
        System.out.println("---------------------------------------------------------");
    }
    

}
