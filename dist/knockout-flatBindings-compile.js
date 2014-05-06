function getFlatBindingsString(node) {
    if (node.nodeType !== 1 /* element */) return;

    var attrs = node.attributes;
    var bindingObj = {};
    for (var i = attrs.length - 1; i >= 0; i--) {
        var attr = attrs[i];
        if (attr.name.lastIndexOf('data-bind-', 0) === 0) {
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

    return (function rec(obj) {
        var result = '';
        var notFirst = false;
        for (propname in obj) {
            if (notFirst) result += ',';
            result += "'" + propname + "':";
            var child = obj[propname];
            result += (typeof child === 'string') ? child : '{' + rec(child) + '}';
            notFirst = true;
        }
        return result;
    })(bindingObj);
}
var fs = require('fs');
var html = fs.readFileSync('/dev/stdin').toString();

var jsdom = require('jsdom').jsdom;
var document = jsdom(html);

(function compileFlatBindingsRecursive(node) {
    if (node.nodeName === 'SCRIPT' && node.type === 'text/html') {
        var templateDocument = jsdom(node.textContent);
        compileFlatBindingsRecursive(templateDocument);
        node.textContent = templateDocument.outerHTML;
    } else {
        var bindstr = getFlatBindingsString(node);
        if (bindstr) {
            // remove all data-bind-* attributes from node
            Array.prototype.map.call(node.attributes, function (a) { return a.name; })
                .filter(function (an) { return an.lastIndexOf('data-bind-', 0) === 0; })
                .forEach(function (an) { node.removeAttribute(an);  });

            node.setAttribute('data-bind', bindstr);
        }

        if (node.childNodes) {
            Array.prototype.forEach.call(
                node.childNodes,
                compileFlatBindingsRecursive
            );
        }
    }
})(document);

console.log(document.outerHTML);
