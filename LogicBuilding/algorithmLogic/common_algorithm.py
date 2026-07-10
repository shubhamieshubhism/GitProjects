arr = [1,2,3,5,6,8,9]
k =3
def sum_max_fixed(arr,k):
    if len(arr) <k:
        return -1
    #sum of first k element
    window_sum = sum(arr[:k])
    max_sum = window_sum
    #sliding window 
    #constatn window
    for i in range (k,len(arr)):
        window_sum += arr[i]-arr[i-k]
        max_sum=max(max_sum,window_sum)
    return max_sum
print(f"The sum of the k elements --> {sum_max_fixed(arr,k)}")
