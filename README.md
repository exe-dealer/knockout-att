#knockout-flatBindingProvider

[demo](http://exe-dealer.github.io/knockout-flatBindingProvider/demo.html)

knockout-flatBindingProvider allows to write following code

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
<script src="http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min.js"></script>
<script src="http://exe-dealer.github.io/knockout-flatBindingProvider/dist/knockout-flatBindingProvider.js"></script>
<script>ko.bindingProvider.instance = new ko.flatBindingProvider()</script>
```

## camelCase bindings

Since HTML allows only lowercase names for attributes,
upper chars must be escaped with underscore.

```html
<input data-bind-checked_value="$data"
       data-bind-checked="isChecked"
       type="checkbox" />
```
