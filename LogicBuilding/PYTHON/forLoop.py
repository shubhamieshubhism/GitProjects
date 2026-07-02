
def print_number_1_to_10():
    for i in range(11):
        print(f"The number --> {i}")
  
def print_number_10_to_1():
    for i in range(10,0,-1):
        print(f"The number --> {i}")

def print_even_number(number):
    for i in range(number):
        if(i%2==0):
            print(f"The even number --> {i}")        
              
#print_number_10_to_1()
#print_number_1_to_10()
print_even_number(20)