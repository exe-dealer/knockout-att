.PHONY: all
all: knockout-att.min.js

knockout-att.min.js: knockout-att.js makefile
	closure-compiler --compilation_level SIMPLE_OPTIMIZATIONS  knockout-att.js > $@
