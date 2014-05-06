all: dist/knockout-flatBindingProvider.js dist/knockout-flatBindings-compile.js

dist/knockout-flatBindingProvider.js: getFlatBindingsString.js flatBindingProvider.js
	{ \
		echo '(function () {'; \
		cat getFlatBindingsString.js; \
		cat flatBindingProvider.js; \
		echo '})();'; \
	} > dist/knockout-flatBindingProvider.js

dist/knockout-flatBindings-compile.js: getFlatBindingsString.js compile.js
	{ \
		cat getFlatBindingsString.js; \
		cat compile.js; \
	} > dist/knockout-flatBindings-compile.js

test: getFlatBindingsString.js getFlatBindingsStringTest.js
	nodejs getFlatBindingsStringTest.js
