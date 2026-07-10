const arr = [1,2,3,5,6,7,9]
const k = 3

function maxSumFixed(arr, k) {
  if (arr.length < k) {
    return -1;
  }
  //sum of first k element
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  //sliding window
  //constant window
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
console.log(maxSumFixed(arr,k))
