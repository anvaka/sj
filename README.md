# sj

This module provides declarative `require` in your DOM markup. 

# Example

This markup will install google analytics script on your page. 

``` html
<!DOCTYPE html>
<html>
  <head>
    <title>Declarative require from html</title>
  </head>
  <body xmlns:s="require:./googleAnalytics">
    <s:analytics domain='my.site.com' ua='UA-XXXXXXXX-1'/>

    <script src="bundle.js"></script>
  </body>
</html>
```

Notice special namespace on our `body` tag? When `sj` parses xml it finds all
custom prefixes and checks if their URN starts with `require:XXX`. This gives
it a hint where to look actual `analytics` export when it comes across
`s:analytics` tag. In this case it's relative file, `googleAnalytics.js`:

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
sj index.html > bundle.js
```

Under the hood `sj` binary finds all xmlns requires, and uses browserify to
create a bundle.

Note: `sj` runtime is super tiny. As of this writing it's less than 100 lines of
unminified code. This entire google analytics example is only 121 lines long,
unminified. That maps to 2KB of gzipped, unminified code. Check network requests
on this demo page: [google analytics tag](http://anvaka.github.io/sj/demo/googleAnalytics/index.html).

With this tiny size it gives you incredible power: Anyone can use custom dom elements
via simple `npm install ...` command.

# install

With [npm](https://npmjs.org) do:

```
npm install sj
```

# license

MIT
