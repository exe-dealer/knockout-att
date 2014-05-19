.PHONY: all
all: dist/knockout-flatBindingProvider.js dist/knockout-flatBindings-compile.js

dist/knockout-flatBindingProvider.js: getFlatBindingsString.js flatBindingProvider.js makefile
	{ \
		echo '(function () {'; \
		cat getFlatBindingsString.js; \
		cat flatBindingProvider.js; \
		echo '})();'; \
	} > $@

dist/knockout-flatBindings-compile.js: getFlatBindingsString.js compile.js makefile
	{ \
		cat getFlatBindingsString.js; \
		cat compile.js; \
	} > $@

.PHONY: test
test: getFlatBindingsString.js getFlatBindingsStringTest.js makefile
	nodejs getFlatBindingsStringTest.js
