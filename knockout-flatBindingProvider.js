ko.flatBindingProvider = function () {
    ko.flatBindingProvider._super.constructor.apply(this, arguments);
}

ko.flatBindingProvider._super = ko.bindingProvider.prototype;
ko.flatBindingProvider.prototype = (function () {
    var f = function () {};
    f.prototype = ko.flatBindingProvider._super;
    return new f();
})();
ko.flatBindingProvider.prototype.constructor = ko.flatBindingProvider;

ko.flatBindingProvider.prototype._getNodeBindingsString = function (node) {
    if (node.nodeType !== 1 /* element */) return;

    var attrs = node.attributes;
    var bindingObj = {};
    for (var i = attrs.length - 1; i >= 0; i--) {
        var attr = attrs[i];
        if (attr.name.startsWith('data-bind-')) {
            var proppath = attr.name
                .slice(10) // substring after 'data-bind-'
                // underscore_case to camelCase
                .replace(/_(.)/g, function (_, c) { return c.toUpperCase(); })
                .split('.');
            var targetObj = bindingObj;
            while (proppath.length > 1) {
                var propname = proppath.shift();
                targetObj = propname in targetObj ? targetObj[propname] : (targetObj[propname] = {});
            }
            targetObj[proppath.shift()] = attr.value;
        }
    }

    var tokens = [];
    var stack = [bindingObj];
    while (stack.length) {
        var obj = stack.pop();
        if (typeof obj === 'string') {
            tokens.push(obj);
        } else {
            stack.push('}');
            var notFirst = false;
            for (propname in obj) {
                if (notFirst) stack.push(',');
                stack.push(obj[propname], ':', '"', propname, '"');
                notFirst = true;
            }
            stack.push('{');
        }
    }

    // trim root brackets
    tokens.pop();
    tokens.shift();

    return tokens.join('');
}

ko.flatBindingProvider.prototype.getBindingsString = function (node, bindingContext) {
    return this._getNodeBindingsString(node) ||
        ko.flatBindingProvider._super.getBindingsString.apply(this, arguments);
};


ko.flatBindingProvider.prototype.nodeHasBindings = function (node) {
    if (node.nodeType === 1 /* element */) {
        var attrs = node.attributes;
        for (var i = attrs.length - 1; i >= 0; i--) {
            if (attrs[i].name.startsWith('data-bind-')) {
                return true;
            }
        }
    }
    return ko.flatBindingProvider._super.nodeHasBindings.apply(this, arguments);
};
