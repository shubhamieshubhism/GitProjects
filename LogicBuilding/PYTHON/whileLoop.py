def print_number_1_to_10():
    i = 1
    while i <= 10:
        print(f"The number --> {i}")
        i += 1


def print_number_10_to_1():
    i = 10
    while i >= 1:
        print(f"The number --> {i}")
        i -= 1


def print_even_number(number):
    limit = int(input("Enter limit : "))
    i = 1
    while i <= limit:
        if i % 2 == 0:
            print(f"The even number --> {i}")
        i += 1


def sum_of_all_natural_number():
    limit = int(input("Enter the limit"))
    total = 0
    i = 1
    while i <= limit:
        total += i
        i += 1
    print(f"The toatl --> {total}")


def sum_of_all_even_numbers():
    limit = int(input("Enter the limiit : "))
    sum = 0
    i = 2
    while i <= limit:
        sum += i
        i += 2
    print(f"The sum all the even number --> {sum}")


def sum_of_all_odd_numbers():
    limit = int(input("Enter the limit : "))
    sum = 0
    i = 1
    while i <= limit:
        sum += i
        i += 2
    print(f"The sum of all the odd numbers --> {sum}")


def factorial():
    number = int(
        input("Enter the number for which you want to find the factorial --> ")
    )
    result = 1
    i = 1
    while i <= number:
        result *= i
        i += 1
    print(f"The factorial of the number  --> {result}")


def product_of_digit(num):
    num = abs(num)
    if num == 0:
        return 0
    product = 1
    while num > 0:
        digit = num % 10
        product *= digit
        num //= 10
    print(f"The product of the digits --> {product}")


def reverse():
    num = int(input("Enter the number --> "))
    is_negative = num < 0
    n = abs(num)
    reverse = 0
    while n > 0:
        digit = n % 10
        reverse = reverse * 10 + digit
        n //= 10
    return -reverse if is_negative else reverse


def is_palindrome(num):
    if num < 0:
        return False
    if num < 10:
        return True

    original = num
    reverse = 0
    while num > 0:
        digit = num % 10
        reverse = reverse * 10 + digit
        num //= 10
    return original == reverse


def sum_of_number(num):
    sum = 0
    while num > 0:
        sum += num % 10
        num //= 10
    return sum


def is_armstrong(num):
    if num < 0:
        return False
    original = num
    digit_count = 0
    temp = num

    while temp > 0:
        digit_count += 1
        temp //= 10

    if num == 0:
        return True

    total = 0
    temp = num
    while temp > 0:
        digit = temp % 10
        total += digit**digit_count
        temp //= 10
    return total == original


def is_perfect_number(num):
    if num <= 0:
        return False
    sum = 0
    divisor = 1
    while divisor <= num // 2:
        if num % divisor == 0:
            sum += divisor
        divisor += 1
    return sum == num


def is_prime(n):
    if n < 2:
        return False

    divisor = 2
    while divisor * divisor <= n:
        if n % divisor == 0:
            return False
        divisor += 1
    return True


def print_primes_upto(limit):
    num = 2
    primes = []
    while num <= limit:
        if is_prime(num):
            primes.append(str(num))
        num += 1
    print(f"Prime number upto {limit}")
    print(" ".join(primes))


def print_fibonacci(n):
    if n < 0:
        print("Please enter positive number")
        return
    a, b = 0, 1
    count = 0
    series = []
    while count < n:
        if count == 0:
            series.append(a)
        elif count == 1:
            series.append(b)
        else:
            next_term = a + b
            series.append(next_term)
            a, b = b, next_term
        count += 1
    print(f"Fibonacci series ({n} terms): ")
    print(" ".join(map(str, series)))


def hcf(a, b):
    a = abs(a)
    b = abs(b)
    while b != 0:
        a, b = b, a % b
    return a


print_fibonacci(10)
