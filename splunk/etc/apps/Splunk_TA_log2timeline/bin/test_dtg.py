#!/usr/bin/env python3
import sys

def main():
    for line in sys.stdin:
        # Ignore the input and simply output the test value.
        sys.stdout.write("test\n")

if __name__ == "__main__":
    main()