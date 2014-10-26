#knockout-flatBindingProvider

[demo](http://exe-dealer.github.io/knockout-att/demo.html)

knockout-att allows to write following code

```html
<a data-bind-click="showOnMap"
   data-bind-text="headline"
   data-bind-attr.href="featureUrl"
   data-bind-attr.title="headline"
   data-bind-css.highlighted="isHighlighted"
   data-bind-css.has-geometry="hasGeometry"
   data-bind-event.mouseover="highlight"
   data-bind-event.mouseout="unhighlight"
   class="geo-search-hit"></a>
```

instead of

```html
<a class="geo-search-hit"
   data-bind="click: showOnMap,
              text: headline,
              attr: { href: featureUrl,
                      title: headline },
              css: { 'highlighted': isHighlighted,
                     'has-geometry': hasGeometry },
              event: { mouseover: highlight,
                       mouseout: unhighlight }"></a>
```

## Usage

```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js"></script>
<script src="http://exe-dealer.github.io/knockout-att/knockout-att.min.js"></script>
<script>ko.bindingProvider.instance = new ko.flatBindingProvider()</script>
```

## camelCase bindings

Since HTML is case insensitive, upper chars must be escaped with underscore.

```html
<input data-bind-checked_value="$data"
       data-bind-checked="isChecked"
       type="checkbox" />
```
