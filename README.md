### Demo
http://viewthespace.github.io/angular-zoom-directive

###Install:

```Javascript
bower install angular-zoom-directive
```

###Setup:

```HTML
  <div ovts-zoom-controls='{target: "#target", minWidth: 80, minHeight: 100, maxWidth: 700, maxHeight: 2000}'>
    <button ng-click='zoom.in()' ng-class='{ disabled: zoom.isMaxedIn() }'>Zoom In</button>
    <button ng-click='zoom.out()' ng-class='{ disabled: zoom.isMaxedOut() }'> Zoom out</button>
  </div>

  <div id='target'/>
```
