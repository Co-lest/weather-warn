#include <iostream>
#include <string>
#include <cmath>

double convert(const std::string& string1);

double convert(const std::string& string1) {
    double result = 0.0;
    bool isNegative = false;
    bool decimalPointSeen = false;
    double decimalPlaceValue = 0.1;

    size_t i = 0;

    if (string1[0] == '-') {
        isNegative = true;
        i++;
    }

    for (; i < string1.length(); ++i) {
        char currentChar = string1[i];

        if (currentChar == '.') {
            if (decimalPointSeen) {
                std::cerr << "Error: Multiple decimal points encountered." << std::endl;
                return 0.0;
            }
            decimalPointSeen = true;
        } else if (currentChar >= '0' && currentChar <= '9') {
            int digit = currentChar - '0';

            if (decimalPointSeen) {
                result += digit * decimalPlaceValue;
                decimalPlaceValue /= 10;
            } else {
                result = result * 10 + digit;
            }
        } else {
            std::cerr << "Error: Invalid character encountered: " << currentChar << std::endl;
            return 0.0;
        }
    }

    if (isNegative) {
        result = -result;
    }

    return result;
}

int main() {
    std::string string1;
    std::cout << "Enter a number string: ";
    std::cin >> string1;

    double decimalValue = convert(string1);
    std::cout << "The decimal value is: " << decimalValue << std::endl;

    return 0;
}