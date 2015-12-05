(function(){var a,b=this,c=b.Backbone,d=Array.prototype.slice,e=Array.prototype.splice;a="undefined"!=typeof exports?exports:b.Backbone={},a.VERSION="0.9.2";var f=b._;f||"undefined"==typeof require||(f=require("underscore"));var g=b.jQuery||b.Zepto||b.ender;a.setDomLibrary=function(a){g=a},a.noConflict=function(){return b.Backbone=c,this},a.emulateHTTP=!1,a.emulateJSON=!1;var h=/\s+/,i=a.Events={on:function(a,b,c){var d,e,f,g,i;if(!b)return this;for(a=a.split(h),d=this._callbacks||(this._callbacks={});e=a.shift();)i=d[e],f=i?i.tail:{},f.next=g={},f.context=c,f.callback=b,d[e]={tail:g,next:i?i.next:f};return this},off:function(a,b,c){var d,e,g,i,j,k;if(e=this._callbacks){if(!(a||b||c))return delete this._callbacks,this;for(a=a?a.split(h):f.keys(e);d=a.shift();)if(g=e[d],delete e[d],g&&(b||c))for(i=g.tail;(g=g.next)!==i;)j=g.callback,k=g.context,(b&&j!==b||c&&k!==c)&&this.on(d,j,k);return this}},trigger:function(a){var b,c,e,f,g,i,j;if(!(e=this._callbacks))return this;for(i=e.all,a=a.split(h),j=d.call(arguments,1);b=a.shift();){if(c=e[b])for(f=c.tail;(c=c.next)!==f;)c.callback.apply(c.context||this,j);if(c=i)for(f=c.tail,g=[b].concat(j);(c=c.next)!==f;)c.callback.apply(c.context||this,g)}return this}};i.bind=i.on,i.unbind=i.off;var j=a.Model=function(a,b){var c;a||(a={}),b&&b.parse&&(a=this.parse(a)),(c=A(this,"defaults"))&&(a=f.extend({},c,a)),b&&b.collection&&(this.collection=b.collection),this.attributes={},this._escapedAttributes={},this.cid=f.uniqueId("c"),this.changed={},this._silent={},this._pending={},this.set(a,{silent:!0}),this.changed={},this._silent={},this._pending={},this._previousAttributes=f.clone(this.attributes),this.initialize.apply(this,arguments)};f.extend(j.prototype,i,{changed:null,_silent:null,_pending:null,idAttribute:"id",initialize:function(){},toJSON:function(a){return f.clone(this.attributes)},get:function(a){return this.attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;var c=this.get(a);return this._escapedAttributes[a]=f.escape(null==c?"":""+c)},has:function(a){return null!=this.get(a)},set:function(a,b,c){var d,e,g;if(f.isObject(a)||null==a?(d=a,c=b):(d={},d[a]=b),c||(c={}),!d)return this;if(d instanceof j&&(d=d.attributes),c.unset)for(e in d)d[e]=void 0;if(!this._validate(d,c))return!1;this.idAttribute in d&&(this.id=d[this.idAttribute]);var h=c.changes={},i=this.attributes,k=this._escapedAttributes,l=this._previousAttributes||{};for(e in d)g=d[e],(!f.isEqual(i[e],g)||c.unset&&f.has(i,e))&&(delete k[e],(c.silent?this._silent:h)[e]=!0),c.unset?delete i[e]:i[e]=g,f.isEqual(l[e],g)&&f.has(i,e)==f.has(l,e)?(delete this.changed[e],delete this._pending[e]):(this.changed[e]=g,c.silent||(this._pending[e]=!0));return c.silent||this.change(c),this},unset:function(a,b){return(b||(b={})).unset=!0,this.set(a,null,b)},clear:function(a){return(a||(a={})).unset=!0,this.set(f.clone(this.attributes),a)},fetch:function(b){b=b?f.clone(b):{};var c=this,d=b.success;return b.success=function(a,e,f){return c.set(c.parse(a,f),b)?void(d&&d(c,a)):!1},b.error=a.wrapError(b.error,c,b),(this.sync||a.sync).call(this,"read",this,b)},save:function(b,c,d){var e,g;if(f.isObject(b)||null==b?(e=b,d=c):(e={},e[b]=c),d=d?f.clone(d):{},d.wait){if(!this._validate(e,d))return!1;g=f.clone(this.attributes)}var h=f.extend({},d,{silent:!0});if(e&&!this.set(e,d.wait?h:d))return!1;var i=this,j=d.success;d.success=function(a,b,c){var g=i.parse(a,c);return d.wait&&(delete d.wait,g=f.extend(e||{},g)),i.set(g,d)?void(j?j(i,a):i.trigger("sync",i,a,d)):!1},d.error=a.wrapError(d.error,i,d);var k=this.isNew()?"create":"update",l=(this.sync||a.sync).call(this,k,this,d);return d.wait&&this.set(g,h),l},destroy:function(b){b=b?f.clone(b):{};var c=this,d=b.success,e=function(){c.trigger("destroy",c,c.collection,b)};if(this.isNew())return e(),!1;b.success=function(a){b.wait&&e(),d?d(c,a):c.trigger("sync",c,a,b)},b.error=a.wrapError(b.error,c,b);var g=(this.sync||a.sync).call(this,"delete",this,b);return b.wait||e(),g},url:function(){var a=A(this,"urlRoot")||A(this.collection,"url")||B();return this.isNew()?a:a+("/"==a.charAt(a.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(a,b){return a},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},change:function(a){a||(a={});var b=this._changing;this._changing=!0;for(var c in this._silent)this._pending[c]=!0;var d=f.extend({},a.changes,this._silent);this._silent={};for(var c in d)this.trigger("change:"+c,this,this.get(c),a);if(b)return this;for(;!f.isEmpty(this._pending);){this._pending={},this.trigger("change",this,a);for(var c in this.changed)this._pending[c]||this._silent[c]||delete this.changed[c];this._previousAttributes=f.clone(this.attributes)}return this._changing=!1,this},hasChanged:function(a){return arguments.length?f.has(this.changed,a):!f.isEmpty(this.changed)},changedAttributes:function(a){if(!a)return this.hasChanged()?f.clone(this.changed):!1;var b,c=!1,d=this._previousAttributes;for(var e in a)f.isEqual(d[e],b=a[e])||((c||(c={}))[e]=b);return c},previous:function(a){return arguments.length&&this._previousAttributes?this._previousAttributes[a]:null},previousAttributes:function(){return f.clone(this._previousAttributes)},isValid:function(){return!this.validate(this.attributes)},_validate:function(a,b){if(b.silent||!this.validate)return!0;a=f.extend({},this.attributes,a);var c=this.validate(a,b);return c?(b&&b.error?b.error(this,c,b):this.trigger("error",this,c,b),!1):!0}});var k=a.Collection=function(a,b){b||(b={}),b.model&&(this.model=b.model),b.comparator&&(this.comparator=b.comparator),this._reset(),this.initialize.apply(this,arguments),a&&this.reset(a,{silent:!0,parse:b.parse})};f.extend(k.prototype,i,{model:j,initialize:function(){},toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},add:function(a,b){var c,d,g,h,i,j,k={},l={},m=[];for(b||(b={}),a=f.isArray(a)?a.slice():[a],c=0,g=a.length;g>c;c++){if(!(h=a[c]=this._prepareModel(a[c],b)))throw new Error("Can't add an invalid model to a collection");i=h.cid,j=h.id,k[i]||this._byCid[i]||null!=j&&(l[j]||this._byId[j])?m.push(c):k[i]=l[j]=h}for(c=m.length;c--;)a.splice(m[c],1);for(c=0,g=a.length;g>c;c++)(h=a[c]).on("all",this._onModelEvent,this),this._byCid[h.cid]=h,null!=h.id&&(this._byId[h.id]=h);if(this.length+=g,d=null!=b.at?b.at:this.models.length,e.apply(this.models,[d,0].concat(a)),this.comparator&&this.sort({silent:!0}),b.silent)return this;for(c=0,g=this.models.length;g>c;c++)k[(h=this.models[c]).cid]&&(b.index=c,h.trigger("add",h,this,b));return this},remove:function(a,b){var c,d,e,g;for(b||(b={}),a=f.isArray(a)?a.slice():[a],c=0,d=a.length;d>c;c++)g=this.getByCid(a[c])||this.get(a[c]),g&&(delete this._byId[g.id],delete this._byCid[g.cid],e=this.indexOf(g),this.models.splice(e,1),this.length--,b.silent||(b.index=e,g.trigger("remove",g,this,b)),this._removeReference(g));return this},push:function(a,b){return a=this._prepareModel(a,b),this.add(a,b),a},pop:function(a){var b=this.at(this.length-1);return this.remove(b,a),b},unshift:function(a,b){return a=this._prepareModel(a,b),this.add(a,f.extend({at:0},b)),a},shift:function(a){var b=this.at(0);return this.remove(b,a),b},get:function(a){return null!=a?this._byId[null!=a.id?a.id:a]:void 0},getByCid:function(a){return a&&this._byCid[a.cid||a]},at:function(a){return this.models[a]},where:function(a){return f.isEmpty(a)?[]:this.filter(function(b){for(var c in a)if(a[c]!==b.get(c))return!1;return!0})},sort:function(a){if(a||(a={}),!this.comparator)throw new Error("Cannot sort a set without a comparator");var b=f.bind(this.comparator,this);return 1==this.comparator.length?this.models=this.sortBy(b):this.models.sort(b),a.silent||this.trigger("reset",this,a),this},pluck:function(a){return f.map(this.models,function(b){return b.get(a)})},reset:function(a,b){a||(a=[]),b||(b={});for(var c=0,d=this.models.length;d>c;c++)this._removeReference(this.models[c]);return this._reset(),this.add(a,f.extend({silent:!0},b)),b.silent||this.trigger("reset",this,b),this},fetch:function(b){b=b?f.clone(b):{},void 0===b.parse&&(b.parse=!0);var c=this,d=b.success;return b.success=function(a,e,f){c[b.add?"add":"reset"](c.parse(a,f),b),d&&d(c,a)},b.error=a.wrapError(b.error,c,b),(this.sync||a.sync).call(this,"read",this,b)},create:function(a,b){var c=this;if(b=b?f.clone(b):{},a=this._prepareModel(a,b),!a)return!1;b.wait||c.add(a,b);var d=b.success;return b.success=function(e,f,g){b.wait&&c.add(e,b),d?d(e,f):e.trigger("sync",a,f,b)},a.save(null,b),a},parse:function(a,b){return a},chain:function(){return f(this.models).chain()},_reset:function(a){this.length=0,this.models=[],this._byId={},this._byCid={}},_prepareModel:function(a,b){if(b||(b={}),a instanceof j)a.collection||(a.collection=this);else{var c=a;b.collection=this,a=new this.model(c,b),a._validate(a.attributes,b)||(a=!1)}return a},_removeReference:function(a){this==a.collection&&delete a.collection,a.off("all",this._onModelEvent,this)},_onModelEvent:function(a,b,c,d){("add"!=a&&"remove"!=a||c==this)&&("destroy"==a&&this.remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],this._byId[b.id]=b),this.trigger.apply(this,arguments))}});var l=["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","sortBy","sortedIndex","toArray","size","first","initial","rest","last","without","indexOf","shuffle","lastIndexOf","isEmpty","groupBy"];f.each(l,function(a){k.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)))}});var m=a.Router=function(a){a||(a={}),a.routes&&(this.routes=a.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},n=/:\w+/g,o=/\*\w+/g,p=/[-[\]{}()+?.,\\^$|#\s]/g;f.extend(m.prototype,i,{initialize:function(){},route:function(b,c,d){return a.history||(a.history=new q),f.isRegExp(b)||(b=this._routeToRegExp(b)),d||(d=this[c]),a.history.route(b,f.bind(function(e){var f=this._extractParameters(b,e);d&&d.apply(this,f),this.trigger.apply(this,["route:"+c].concat(f)),a.history.trigger("route",this,c,f)},this)),this},navigate:function(b,c){a.history.navigate(b,c)},_bindRoutes:function(){if(this.routes){var a=[];for(var b in this.routes)a.unshift([b,this.routes[b]]);for(var c=0,d=a.length;d>c;c++)this.route(a[c][0],a[c][1],this[a[c][1]])}},_routeToRegExp:function(a){return a=a.replace(p,"\\$&").replace(n,"([^/]+)").replace(o,"(.*?)"),new RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});var q=a.History=function(){this.handlers=[],f.bindAll(this,"checkUrl")},r=/^[#\/]/,s=/msie [\w.]+/;q.started=!1,f.extend(q.prototype,i,{interval:50,getHash:function(a){var b=a?a.location:window.location,c=b.href.match(/#(.*)$/);return c?c[1]:""},getFragment:function(a,b){if(null==a)if(this._hasPushState||b){a=window.location.pathname;var c=window.location.search;c&&(a+=c)}else a=this.getHash();return a.indexOf(this.options.root)||(a=a.substr(this.options.root.length)),a.replace(r,"")},start:function(a){if(q.started)throw new Error("Backbone.history has already been started");q.started=!0,this.options=f.extend({},{root:"/"},this.options,a),this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&window.history&&window.history.pushState);var b=this.getFragment(),c=document.documentMode,d=s.exec(navigator.userAgent.toLowerCase())&&(!c||7>=c);d&&(this.iframe=g('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(b)),this._hasPushState?g(window).bind("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!d?g(window).bind("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=b;var e=window.location,h=e.pathname==this.options.root;return this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!h?(this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0):(this._wantsPushState&&this._hasPushState&&h&&e.hash&&(this.fragment=this.getHash().replace(r,""),window.history.replaceState({},document.title,e.protocol+"//"+e.host+this.options.root+this.fragment)),this.options.silent?void 0:this.loadUrl())},stop:function(){g(window).unbind("popstate",this.checkUrl).unbind("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),q.started=!1},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(a){var b=this.getFragment();return b==this.fragment&&this.iframe&&(b=this.getFragment(this.getHash(this.iframe))),b==this.fragment?!1:(this.iframe&&this.navigate(b),void(this.loadUrl()||this.loadUrl(this.getHash())))},loadUrl:function(a){var b=this.fragment=this.getFragment(a),c=f.any(this.handlers,function(a){return a.route.test(b)?(a.callback(b),!0):void 0});return c},navigate:function(a,b){if(!q.started)return!1;b&&b!==!0||(b={trigger:b});var c=(a||"").replace(r,"");this.fragment!=c&&(this._hasPushState?(0!=c.indexOf(this.options.root)&&(c=this.options.root+c),this.fragment=c,window.history[b.replace?"replaceState":"pushState"]({},document.title,c)):this._wantsHashChange?(this.fragment=c,this._updateHash(window.location,c,b.replace),this.iframe&&c!=this.getFragment(this.getHash(this.iframe))&&(b.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,c,b.replace))):window.location.assign(this.options.root+a),b.trigger&&this.loadUrl(a))},_updateHash:function(a,b,c){c?a.replace(a.toString().replace(/(javascript:|#).*$/,"")+"#"+b):a.hash=b}});var t=a.View=function(a){this.cid=f.uniqueId("view"),this._configure(a||{}),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},u=/^(\S+)\s*(.*)$/,v=["model","collection","el","id","attributes","className","tagName"];f.extend(t.prototype,i,{tagName:"div",$:function(a){return this.$el.find(a)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this},make:function(a,b,c){var d=document.createElement(a);return b&&g(d).attr(b),c&&g(d).html(c),d},setElement:function(a,b){return this.$el&&this.undelegateEvents(),this.$el=a instanceof g?a:g(a),this.el=this.$el[0],b!==!1&&this.delegateEvents(),this},delegateEvents:function(a){if(a||(a=A(this,"events"))){this.undelegateEvents();for(var b in a){var c=a[b];if(f.isFunction(c)||(c=this[a[b]]),!c)throw new Error('Method "'+a[b]+'" does not exist');var d=b.match(u),e=d[1],g=d[2];c=f.bind(c,this),e+=".delegateEvents"+this.cid,""===g?this.$el.bind(e,c):this.$el.delegate(g,e,c)}}},undelegateEvents:function(){this.$el.unbind(".delegateEvents"+this.cid)},_configure:function(a){this.options&&(a=f.extend({},this.options,a));for(var b=0,c=v.length;c>b;b++){var d=v[b];a[d]&&(this[d]=a[d])}this.options=a},_ensureElement:function(){if(this.el)this.setElement(this.el,!1);else{var a=A(this,"attributes")||{};this.id&&(a.id=this.id),this.className&&(a["class"]=this.className),this.setElement(this.make(this.tagName,a),!1)}}});var w=function(a,b){var c=z(this,a,b);return c.extend=this.extend,c};j.extend=k.extend=m.extend=t.extend=w;var x={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};a.sync=function(b,c,d){var e=x[b];d||(d={});var h={type:e,dataType:"json"};return d.url||(h.url=A(c,"url")||B()),d.data||!c||"create"!=b&&"update"!=b||(h.contentType="application/json",h.data=JSON.stringify(c.toJSON())),a.emulateJSON&&(h.contentType="application/x-www-form-urlencoded",h.data=h.data?{model:h.data}:{}),a.emulateHTTP&&("PUT"===e||"DELETE"===e)&&(a.emulateJSON&&(h.data._method=e),h.type="POST",h.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",e)}),"GET"===h.type||a.emulateJSON||(h.processData=!1),g.ajax(f.extend(h,d))},a.wrapError=function(a,b,c){return function(d,e){e=d===b?e:d,a?a(b,e,c):b.trigger("error",b,e,c)}};var y=function(){},z=function(a,b,c){var d;return d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){a.apply(this,arguments)},f.extend(d,a),y.prototype=a.prototype,d.prototype=new y,b&&f.extend(d.prototype,b),c&&f.extend(d,c),d.prototype.constructor=d,d.__super__=a.prototype,d},A=function(a,b){return a&&a[b]?f.isFunction(a[b])?a[b]():a[b]:null},B=function(){throw new Error('A "url" property or function must be specified')}}).call(this);