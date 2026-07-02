//printNumber1to10();
//printNumber10to1();
printEvenNumber(14);
function printNumber1to10(){
    for(let i = 0 ;i<11;i++){
        console.log("The nubmer -->"+i)
    }
}

function printNumber10to1(){
    for(let i = 10 ;i>=0;i--){
        console.log("The nubmer -->"+i)
    }
}

function printEvenNumber(number){
    for(let i =0;i<=number;i++){
        if(i%2==0){
            console.log(`The even Number --> ${i}`)
        }

    }
}