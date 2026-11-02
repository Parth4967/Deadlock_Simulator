# Makefile for Deadlock Detection & Recovery Simulator
CC = gcc
CFLAGS = -Wall -O2 -std=c99
SRC = src/deadlock.c
TARGET = deadlock_sim

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $(TARGET)
	@echo "Compilation successful! Run with: ./$(TARGET)"

clean:
	rm -f $(TARGET)

run: $(TARGET)
	./$(TARGET)

test-recovery: $(TARGET)
	./$(TARGET) --terminate 2
