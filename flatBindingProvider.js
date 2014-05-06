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

ko.flatBindingProvider.prototype.getBindingsString = function (node, bindingContext) {
    return getFlatBindingsString(node) ||
        ko.flatBindingProvider._super.getBindingsString.apply(this, arguments);
};

ko.flatBindingProvider.prototype.nodeHasBindings = function (node) {
    if (node.nodeType === 1 /* element */) {
        var attrs = node.attributes;
        for (var i = attrs.length - 1; i >= 0; i--) {
            if (attrs[i].name.lastIndexOf('data-bind-', 0) === 0) {
                return true;
            }
        }
    }
    return ko.flatBindingProvider._super.nodeHasBindings.apply(this, arguments);
};
