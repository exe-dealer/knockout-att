(function () {

function getBindingsStringFromFlatAttrs (attrPrefix, node) {
    if (node.nodeType !== 1 /* element */) return;

    function replaceToUpperCase(_, c) {
        return c.toUpperCase();
    }

    var attrs = node.attributes;
    var bindingObj = {};
    for (var i = attrs.length - 1; i >= 0; i--) {
        var attr = attrs[i];
        if (attr.name.lastIndexOf(attrPrefix, 0) === 0) {
            var proppath = attr.name
                .slice(attrPrefix.length) // substring after attrPrefix
                // underscore_case to camelCase
                .replace(/_(.)/g, replaceToUpperCase)
                .split('.');
            var targetObj = bindingObj;
            while (proppath.length > 1) {
                var propname = proppath.shift();
                targetObj = propname in targetObj ? targetObj[propname] : (targetObj[propname] = {});
            }
            targetObj[proppath[0]] = attr.value;
        }
    }

    return (function rec(obj) {
        var result = '';
        var notFirst = false;
        for (var propname in obj) {
            if (notFirst) result += ',';
            result += "'" + propname + "':";
            var child = obj[propname];
            result += (typeof child === 'string') ? child : '{' + rec(child) + '}';
            notFirst = true;
        }
        return result;
    })(bindingObj);
}

if (typeof module === 'object') {
    module.exports.getBindingsStringFromFlatAttrs = getBindingsStringFromFlatAttrs;
}

if (typeof ko == 'object') {
    /** @constructor */
    ko.flatBindingProvider = function () {
        ko.bindingProvider.apply(this, arguments);
    };

    ko.flatBindingProvider.prototype = (function () {
        var f = function () {};
        f.prototype = ko.bindingProvider.prototype;
        return new f();
    })();


    ko.flatBindingProvider.prototype.constructor = ko.flatBindingProvider;

    ko.flatBindingProvider.prototype.attrPrefix = 'data-bind-';

    ko.flatBindingProvider.prototype.getBindingsStringFromFlatAttrs =
        getBindingsStringFromFlatAttrs.bind(
            window,
            ko.flatBindingProvider.prototype.attrPrefix
        );

    ko.flatBindingProvider.prototype.getBindingsString = function (node, bindingContext) {
        return this.getBindingsStringFromFlatAttrs(node) ||
            ko.bindingProvider.prototype.getBindingsString.apply(this, arguments);
    };

    ko.flatBindingProvider.prototype.nodeHasBindings = function (node) {
        if (node.nodeType === 1 /* element */) {
            var attrs = node.attributes;
            for (var i = attrs.length - 1; i >= 0; i--) {
                if (ko.utils.stringStartsWith(attrs[i].name, attrPrefix)) {
                    return true;
                }
            }
        }
        return ko.bindingProvider.prototype.nodeHasBindings.apply(this, arguments);
    };
}

})();

