import sys


def sum_wihtou_zeros(nums):
    total = 0
    for n in nums:
        if n == 0:
            continue
        total += n
    return total

def search_number(nums,target):
    for i, num in enumerate(nums):
        if(num == target):
            print(f"Found {target} at index {i}")
            return
    print(f"{target} not found. ")

args = list(map(int,sys.argv[1:]))    
if len(args) <2:
    print("Usage: python script.py <target> <num1> <num2> ......")
    print("Example: python script.py 5 1 2 5 3 4 ")
    sys.exit(1)

target = args[0]
numbers = args [1:]
search_number(numbers,target)