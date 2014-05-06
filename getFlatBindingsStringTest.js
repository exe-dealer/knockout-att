var fs = require('fs');
eval(fs.readFileSync('getFlatBindingsString.js').toString());

var node = { nodeType: 1, attributes: [
    { name: "data-bind-a.a.a", value: "0" },
    { name: "data-bind-a.a.b", value: "0" },
    { name: "data-bind-a.b.a", value: "0" },
    { name: "data-bind-b", value: "0" },
    { name: "data-bind-under_score", value: "0" }
]};


var assert = require('assert');

assert.deepEqual(
    eval('({' + getFlatBindingsString(node) + '})'),
    {a: {a: {a: 0, b: 0}, b: {a: 0}}, b: 0, underScore: 0}
);
