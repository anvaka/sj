# sj

This module provides declarative `require` in your DOM markup. 

# Example

This markup will install [google analytics](http://www.google.com/analytics/) script on your page. 

``` html
<!DOCTYPE html>
<html>
  <head>
    <script src="bundle.js"></script>
  </head>

  <body xmlns:s="require:./googleAnalytics"
        onload="require('./index')">
    <s:analytics domain='my.site.com' ua='UA-XXXXXXXX-1'/>
  </body>
</html>
```

Notice special namespace on our `body` tag? When `sj` parses xml it finds all custom prefixes and checks if its URN starts with `require:XXX`. This gives it a hint where to look actual `analytics` export when it comes accross `s:analytics` tag. In this case it's relative file, `googleAnalytics.js`:

``` js
// googleAnalytics.js:
module.exports.analytics = function (root) {
  var domain = root.attributes.getNamedItem('domain').nodeValue;
  var ua = root.attributes.getNamedItem('ua').nodeValue;
  
  // this is standard google analytics include script:
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', ua, domain); // except that we pass our own arguments here
  ga('send', 'pageview');
}
```

To make this all work we browserify our input files into a bundle:

```
browserify -r ./index -r ./googleAnalytics > bundle.js
```

`index.js` is a one-liner to launch sj:

``` js
require('sj').bind(document.body);
```

Note: `sj` itself is super tiny. As of this writing it's less than 100 lines of unminified code. This entire google analytics example is only 121 lines long, unminified. That maps to 2.3KB of ungzipped code or 1,145 bytes of gziped code. With this tiny size it gives you incredible power: Anyone can use it via simple `npm install ...` command now.

# install

With [npm](https://npmjs.org) do:

```
npm install sj
```

# license

MIT
