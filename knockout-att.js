(function () {
    'use strict';

    var ATTR_PREFIX = 'data-bind-';

    function getBindingsStringFromFlatAttrs(node) {
        if (node.nodeType !== 1 /* element */) { return; }

        function replaceToUpperCase(_, c) {
            return c.toUpperCase();
        }

        var attrs = node.attributes;
        var bindingObj = {};
        for (var i = attrs.length - 1; i >= 0; i--) {
            var attr = attrs[i];
            if (attr.name.lastIndexOf(ATTR_PREFIX, 0) === 0) {
                var proppath = attr.name
                    .slice(ATTR_PREFIX.length) // substring after ATTR_PREFIX
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
                if (notFirst) { result += ','; }
                result += '\'' + propname + '\':';
                var child = obj[propname];
                result += (typeof child === 'string') ? child : '{' + rec(child) + '}';
                notFirst = true;
            }
            return result;
        })(bindingObj);
    }

    if (typeof ko === 'object') {

        ko.flatBindingProvider = function () {
            ko.bindingProvider.apply(this, arguments);
        };

        ko.flatBindingProvider.prototype = (function () {
            var F = function () {};
            F.prototype = ko.bindingProvider.prototype;
            return new F();
        })();

        ko.flatBindingProvider.prototype.constructor = ko.flatBindingProvider;

        ko.flatBindingProvider.prototype.getBindingsStringFromFlatAttrs = getBindingsStringFromFlatAttrs;

        ko.flatBindingProvider.prototype.getBindingsString = function (node, bindingContext) {
            return this.getBindingsStringFromFlatAttrs(node) ||
                ko.bindingProvider.prototype.getBindingsString.apply(this, arguments);
        };

        ko.flatBindingProvider.prototype.nodeHasBindings = function (node) {
            if (node.nodeType === 1 /* element */) {
                var attrs = node.attributes;
                for (var i = attrs.length - 1; i >= 0; i--) {
                    if (ko.utils.stringStartsWith(attrs[i].name, ATTR_PREFIX)) {
                        return true;
                    }
                }
            }
            return ko.bindingProvider.prototype.nodeHasBindings.apply(this, arguments);
        };
    }

    if (typeof process === 'object') {

        var openTagRegex = function () { return /<(\w+)((?:\s+[\w-\.]+=(?:"[^"]*"|'[^']*'))+)/g; };
        console.assert(openTagRegex().test('<tagname dblquote_attr="value" singlequote_attr=\'value\''));

        var attrRegex = function () { return /([\w-\.]+)=("[^"]*"|'[^']*')/g; };
        console.assert(attrRegex().test('dblquote_attr="value"'));
        console.assert(attrRegex().test('singlequote_attr=\'value\''));

        var inputHtml = '';

        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', function () {
            var chunk = process.stdin.read();
            if (chunk !== null) {
                inputHtml += chunk;
            }
        });

        process.stdin.on('end', function () {
            process.stdout.write(inputHtml.replace(openTagRegex(), function (original, tagname, attrs_str) {
                var attrs = [];
                attrs_str.replace(attrRegex(), function (_, attname, quotedVal) {
                    attrs.push({
                        name: attname,
                        quotedValue: quotedVal,
                        value: quotedVal.slice(1, -1)
                    });
                });

                var bindstr = getBindingsStringFromFlatAttrs({
                    nodeType: 1,
                    attributes: attrs
                });

                if (bindstr) {
                    attrs.push({
                        name: 'data-bind',
                        quotedValue: '"' + bindstr.replace(/"/g, '&quot;') + '"'
                    });

                    // remove data-bind-* attributes from node
                    attrs = attrs.filter(function (att) {
                        return att.name.lastIndexOf(ATTR_PREFIX, 0) !== 0;
                    });

                    return '<' + tagname + ' ' + attrs.map(writeAttr).join(' ');
                } else {
                    return original;
                }

                function writeAttr(att) {
                    return att.name + '=' + att.quotedValue;
                }
            }));
        });
    }

})();
