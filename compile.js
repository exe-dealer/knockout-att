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
