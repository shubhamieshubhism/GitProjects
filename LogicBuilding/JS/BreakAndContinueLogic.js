function sumWithoutZeros(nums){
    let sum =0
    for (let i = 0; i < nums.length; i++) {
        if(nums[i]===0){
            continue
        }
        sum+=nums[i]
        
    }
    return sum
}

function searchNumber(nums, target){
    for(let i =0;i<nums.length;i++){
        if(nums[i]==target){
            console.log(`Found ${target} at index ${i}`)
            return
        }
    }
    console.log(`${target} not found`)
}

const args = process.argv.slice(2).map(Number)
if(args.length<2){
    console.log(`Usage: node script.js <target><num1><num2>...`)
    console.log(`Example: node script.js 5 1 2 5 3 4`)
    process.exit(1)
}

const target = args[0]
const number = args.slice(1)
searchNumber(number,target)