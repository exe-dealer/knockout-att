#knockout-flatBindingProvider

[demo](http://exe-dealer.github.io/knockout-flatBindingProvider/demo.html)

```html
<label data-bind-css.checked="isChecked">
    <input data-bind-checked="isChecked"
           data-bind-checked_value="$data"
           type="checkbox" />
    <span data-bind-text="name"></span>
</label>
```
