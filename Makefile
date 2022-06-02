all: compile

compile:
	tsc

clean:
	rm -rf dist

.PHONY: all compile clean
