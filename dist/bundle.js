!function(t){var e={};function r(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/dist/",r(r.s=3)}([function(t,e,r){var i;"undefined"!=typeof window?i=window:"undefined"!=typeof self?i=self:(console.warn("Using browser-only version of superagent in non-browser environment"),i=this);var n=r(5),o=r(6),s=r(1),a=r(7),c=r(9);function u(){}var h=e=t.exports=function(t,r){return"function"==typeof r?new e.Request("GET",t).end(r):1==arguments.length?new e.Request("GET",t):new e.Request(t,r)};e.Request=v,h.getXHR=function(){if(!(!i.XMLHttpRequest||i.location&&"file:"==i.location.protocol&&i.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(t){}throw Error("Browser-only version of superagent could not find XHR")};var l="".trim?function(t){return t.trim()}:function(t){return t.replace(/(^\s*|\s*$)/g,"")};function p(t){if(!s(t))return t;var e=[];for(var r in t)f(e,r,t[r]);return e.join("&")}function f(t,e,r){if(null!=r)if(Array.isArray(r))r.forEach(function(r){f(t,e,r)});else if(s(r))for(var i in r)f(t,e+"["+i+"]",r[i]);else t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));else null===r&&t.push(encodeURIComponent(e))}h.serializeObject=p;function d(t){for(var e,r,i={},n=t.split("&"),o=0,s=n.length;o<s;++o)-1==(r=(e=n[o]).indexOf("="))?i[decodeURIComponent(e)]="":i[decodeURIComponent(e.slice(0,r))]=decodeURIComponent(e.slice(r+1));return i}h.parseString=d,h.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},h.serialize={"application/x-www-form-urlencoded":p,"application/json":JSON.stringify},h.parse={"application/x-www-form-urlencoded":d,"application/json":JSON.parse};function y(t){return/[\/+]json($|[^-\w])/.test(t)}function m(t){this.req=t,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||void 0===this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;var e=this.xhr.status;1223===e&&(e=204),this._setStatusProperties(e),this.header=this.headers=function(t){for(var e,r,i,n,o=t.split(/\r?\n/),s={},a=0,c=o.length;a<c;++a)-1!==(e=(r=o[a]).indexOf(":"))&&(i=r.slice(0,e).toLowerCase(),n=l(r.slice(e+1)),s[i]=n);return s}(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&t._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null}a(m.prototype),m.prototype._parseBody=function(t){var e=h.parse[this.type];return this.req._parser?this.req._parser(this,t):(!e&&y(this.type)&&(e=h.parse["application/json"]),e&&t&&(t.length||t instanceof Object)?e(t):null)},m.prototype.toError=function(){var t=this.req,e=t.method,r=t.url,i="cannot "+e+" "+r+" ("+this.status+")",n=new Error(i);return n.status=this.status,n.method=e,n.url=r,n},h.Response=m;function v(t,e){var r=this;this._query=this._query||[],this.method=t,this.url=e,this.header={},this._header={},this.on("end",function(){var t=null,e=null;try{e=new m(r)}catch(e){return(t=new Error("Parser is unable to parse the response")).parse=!0,t.original=e,r.xhr?(t.rawResponse=void 0===r.xhr.responseType?r.xhr.responseText:r.xhr.response,t.status=r.xhr.status?r.xhr.status:null,t.statusCode=t.status):(t.rawResponse=null,t.status=null),r.callback(t)}r.emit("response",e);var i;try{r._isResponseOK(e)||(i=new Error(e.statusText||"Unsuccessful HTTP response"))}catch(t){i=t}i?(i.original=t,i.response=e,i.status=e.status,r.callback(i,e)):r.callback(null,e)})}n(v.prototype),o(v.prototype),v.prototype.type=function(t){return this.set("Content-Type",h.types[t]||t),this},v.prototype.accept=function(t){return this.set("Accept",h.types[t]||t),this},v.prototype.auth=function(t,e,r){1===arguments.length&&(e=""),"object"==typeof e&&null!==e&&(r=e,e=""),r||(r={type:"function"==typeof btoa?"basic":"auto"});return this._auth(t,e,r,function(t){if("function"==typeof btoa)return btoa(t);throw new Error("Cannot use basic auth, btoa is not a function")})},v.prototype.query=function(t){return"string"!=typeof t&&(t=p(t)),t&&this._query.push(t),this},v.prototype.attach=function(t,e,r){if(e){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(t,e,r||e.name)}return this},v.prototype._getFormData=function(){return this._formData||(this._formData=new i.FormData),this._formData},v.prototype.callback=function(t,e){if(this._shouldRetry(t,e))return this._retry();var r=this._callback;this.clearTimeout(),t&&(this._maxRetries&&(t.retries=this._retries-1),this.emit("error",t)),r(t,e)},v.prototype.crossDomainError=function(){var t=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");t.crossDomain=!0,t.status=this.status,t.method=this.method,t.url=this.url,this.callback(t)},v.prototype.buffer=v.prototype.ca=v.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},v.prototype.pipe=v.prototype.write=function(){throw Error("Streaming is not supported in browser version of superagent")},v.prototype._isHost=function(t){return t&&"object"==typeof t&&!Array.isArray(t)&&"[object Object]"!==Object.prototype.toString.call(t)},v.prototype.end=function(t){return this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=t||u,this._finalizeQueryString(),this._end()},v.prototype._end=function(){var t=this,e=this.xhr=h.getXHR(),r=this._formData||this._data;this._setTimeouts(),e.onreadystatechange=function(){var r=e.readyState;if(r>=2&&t._responseTimeoutTimer&&clearTimeout(t._responseTimeoutTimer),4==r){var i;try{i=e.status}catch(t){i=0}if(!i){if(t.timedout||t._aborted)return;return t.crossDomainError()}t.emit("end")}};var i=function(e,r){r.total>0&&(r.percent=r.loaded/r.total*100),r.direction=e,t.emit("progress",r)};if(this.hasListeners("progress"))try{e.onprogress=i.bind(null,"download"),e.upload&&(e.upload.onprogress=i.bind(null,"upload"))}catch(t){}try{this.username&&this.password?e.open(this.method,this.url,!0,this.username,this.password):e.open(this.method,this.url,!0)}catch(t){return this.callback(t)}if(this._withCredentials&&(e.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof r&&!this._isHost(r)){var n=this._header["content-type"],o=this._serializer||h.serialize[n?n.split(";")[0]:""];!o&&y(n)&&(o=h.serialize["application/json"]),o&&(r=o(r))}for(var s in this.header)null!=this.header[s]&&this.header.hasOwnProperty(s)&&e.setRequestHeader(s,this.header[s]);return this._responseType&&(e.responseType=this._responseType),this.emit("request",this),e.send(void 0!==r?r:null),this},h.agent=function(){return new c},["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(function(t){c.prototype[t.toLowerCase()]=function(e,r){var i=new h.Request(t,e);return this._setDefaults(i),r&&i.end(r),i}}),c.prototype.del=c.prototype.delete,h.get=function(t,e,r){var i=h("GET",t);return"function"==typeof e&&(r=e,e=null),e&&i.query(e),r&&i.end(r),i},h.head=function(t,e,r){var i=h("HEAD",t);return"function"==typeof e&&(r=e,e=null),e&&i.query(e),r&&i.end(r),i},h.options=function(t,e,r){var i=h("OPTIONS",t);return"function"==typeof e&&(r=e,e=null),e&&i.send(e),r&&i.end(r),i};function _(t,e,r){var i=h("DELETE",t);return"function"==typeof e&&(r=e,e=null),e&&i.send(e),r&&i.end(r),i}h.del=_,h.delete=_,h.patch=function(t,e,r){var i=h("PATCH",t);return"function"==typeof e&&(r=e,e=null),e&&i.send(e),r&&i.end(r),i},h.post=function(t,e,r){var i=h("POST",t);return"function"==typeof e&&(r=e,e=null),e&&i.send(e),r&&i.end(r),i},h.put=function(t,e,r){var i=h("PUT",t);return"function"==typeof e&&(r=e,e=null),e&&i.send(e),r&&i.end(r),i}},function(t,e,r){"use strict";t.exports=function(t){return null!==t&&"object"==typeof t}},function(t,e,r){var i;!function(n){"use strict";var o,s=20,a=1,c=1e6,u=-7,h=21,l="[big.js] Invalid ",p=l+"decimal places",f=l+"rounding mode",d="[big.js] Division by zero",y={},m=void 0,v=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function _(t,e,r,i){var n=t.c,o=t.e+e+1;if(o<n.length){if(1===r)i=n[o]>=5;else if(2===r)i=n[o]>5||5==n[o]&&(i||o<0||n[o+1]!==m||1&n[o-1]);else if(3===r)i=i||n[o]!==m||o<0;else if(i=!1,0!==r)throw Error(f);if(o<1)n.length=1,i?(t.e=-e,n[0]=1):n[0]=t.e=0;else{if(n.length=o--,i)for(;++n[o]>9;)n[o]=0,o--||(++t.e,n.unshift(1));for(o=n.length;!n[--o];)n.pop()}}else if(r<0||r>3||r!==~~r)throw Error(f);return t}function b(t,e,r,i){var n,o,s=t.constructor,a=!t.c[0];if(r!==m){if(r!==~~r||r<(3==e)||r>c)throw Error(3==e?l+"precision":p);for(r=i-(t=new s(t)).e,t.c.length>++i&&_(t,r,s.RM),2==e&&(i=t.e+r+1);t.c.length<i;)t.c.push(0)}if(n=t.e,r=(o=t.c.join("")).length,2!=e&&(1==e||3==e&&i<=n||n<=s.NE||n>=s.PE))o=o.charAt(0)+(r>1?"."+o.slice(1):"")+(n<0?"e":"e+")+n;else if(n<0){for(;++n;)o="0"+o;o="0."+o}else if(n>0)if(++n>r)for(n-=r;n--;)o+="0";else n<r&&(o=o.slice(0,n)+"."+o.slice(n));else r>1&&(o=o.charAt(0)+"."+o.slice(1));return t.s<0&&(!a||4==e)?"-"+o:o}y.abs=function(){var t=new this.constructor(this);return t.s=1,t},y.cmp=function(t){var e,r=this.c,i=(t=new this.constructor(t)).c,n=this.s,o=t.s,s=this.e,a=t.e;if(!r[0]||!i[0])return r[0]?n:i[0]?-o:0;if(n!=o)return n;if(e=n<0,s!=a)return s>a^e?1:-1;for(o=(s=r.length)<(a=i.length)?s:a,n=-1;++n<o;)if(r[n]!=i[n])return r[n]>i[n]^e?1:-1;return s==a?0:s>a^e?1:-1},y.div=function(t){var e=this.constructor,r=this.c,i=(t=new e(t)).c,n=this.s==t.s?1:-1,o=e.DP;if(o!==~~o||o<0||o>c)throw Error(p);if(!i[0])throw Error(d);if(!r[0])return new e(0*n);var s,a,u,h,l,f=i.slice(),y=s=i.length,v=r.length,b=r.slice(0,s),w=b.length,g=t,T=g.c=[],x=0,E=o+(g.e=this.e-t.e)+1;for(g.s=n,n=E<0?0:E,f.unshift(0);w++<s;)b.push(0);do{for(u=0;u<10;u++){if(s!=(w=b.length))h=s>w?1:-1;else for(l=-1,h=0;++l<s;)if(i[l]!=b[l]){h=i[l]>b[l]?1:-1;break}if(!(h<0))break;for(a=w==s?i:f;w;){if(b[--w]<a[w]){for(l=w;l&&!b[--l];)b[l]=9;--b[l],b[w]+=10}b[w]-=a[w]}for(;!b[0];)b.shift()}T[x++]=h?u:++u,b[0]&&h?b[w]=r[y]||0:b=[r[y]]}while((y++<v||b[0]!==m)&&n--);return T[0]||1==x||(T.shift(),g.e--),x>E&&_(g,o,e.RM,b[0]!==m),g},y.eq=function(t){return!this.cmp(t)},y.gt=function(t){return this.cmp(t)>0},y.gte=function(t){return this.cmp(t)>-1},y.lt=function(t){return this.cmp(t)<0},y.lte=function(t){return this.cmp(t)<1},y.minus=y.sub=function(t){var e,r,i,n,o=this.constructor,s=this.s,a=(t=new o(t)).s;if(s!=a)return t.s=-a,this.plus(t);var c=this.c.slice(),u=this.e,h=t.c,l=t.e;if(!c[0]||!h[0])return h[0]?(t.s=-a,t):new o(c[0]?this:0);if(s=u-l){for((n=s<0)?(s=-s,i=c):(l=u,i=h),i.reverse(),a=s;a--;)i.push(0);i.reverse()}else for(r=((n=c.length<h.length)?c:h).length,s=a=0;a<r;a++)if(c[a]!=h[a]){n=c[a]<h[a];break}if(n&&(i=c,c=h,h=i,t.s=-t.s),(a=(r=h.length)-(e=c.length))>0)for(;a--;)c[e++]=0;for(a=e;r>s;){if(c[--r]<h[r]){for(e=r;e&&!c[--e];)c[e]=9;--c[e],c[r]+=10}c[r]-=h[r]}for(;0===c[--a];)c.pop();for(;0===c[0];)c.shift(),--l;return c[0]||(t.s=1,c=[l=0]),t.c=c,t.e=l,t},y.mod=function(t){var e,r=this,i=r.constructor,n=r.s,o=(t=new i(t)).s;if(!t.c[0])throw Error(d);return r.s=t.s=1,e=1==t.cmp(r),r.s=n,t.s=o,e?new i(r):(n=i.DP,o=i.RM,i.DP=i.RM=0,r=r.div(t),i.DP=n,i.RM=o,this.minus(r.times(t)))},y.plus=y.add=function(t){var e,r=this.constructor,i=this.s,n=(t=new r(t)).s;if(i!=n)return t.s=-n,this.minus(t);var o=this.e,s=this.c,a=t.e,c=t.c;if(!s[0]||!c[0])return c[0]?t:new r(s[0]?this:0*i);if(s=s.slice(),i=o-a){for(i>0?(a=o,e=c):(i=-i,e=s),e.reverse();i--;)e.push(0);e.reverse()}for(s.length-c.length<0&&(e=c,c=s,s=e),i=c.length,n=0;i;s[i]%=10)n=(s[--i]=s[i]+c[i]+n)/10|0;for(n&&(s.unshift(n),++a),i=s.length;0===s[--i];)s.pop();return t.c=s,t.e=a,t},y.pow=function(t){var e=this,r=new e.constructor(1),i=r,n=t<0;if(t!==~~t||t<-1e6||t>1e6)throw Error(l+"exponent");for(n&&(t=-t);1&t&&(i=i.times(e)),t>>=1;)e=e.times(e);return n?r.div(i):i},y.round=function(t,e){var r=this.constructor;if(t===m)t=0;else if(t!==~~t||t<0||t>c)throw Error(p);return _(new r(this),t,e===m?r.RM:e)},y.sqrt=function(){var t,e,r,i=this.constructor,n=this.s,o=this.e,s=new i(.5);if(!this.c[0])return new i(this);if(n<0)throw Error("[big.js] No square root");0===(n=Math.sqrt(this.toString()))||n===1/0?((e=this.c.join("")).length+o&1||(e+="0"),(t=new i(Math.sqrt(e).toString())).e=((o+1)/2|0)-(o<0||1&o)):t=new i(n.toString()),o=t.e+(i.DP+=4);do{r=t,t=s.times(r.plus(this.div(r)))}while(r.c.slice(0,o).join("")!==t.c.slice(0,o).join(""));return _(t,i.DP-=4,i.RM)},y.times=y.mul=function(t){var e,r=this.constructor,i=this.c,n=(t=new r(t)).c,o=i.length,s=n.length,a=this.e,c=t.e;if(t.s=this.s==t.s?1:-1,!i[0]||!n[0])return new r(0*t.s);for(t.e=a+c,o<s&&(e=i,i=n,n=e,c=o,o=s,s=c),e=new Array(c=o+s);c--;)e[c]=0;for(a=s;a--;){for(s=0,c=o+a;c>a;)s=e[c]+n[a]*i[c-a-1]+s,e[c--]=s%10,s=s/10|0;e[c]=(e[c]+s)%10}for(s?++t.e:e.shift(),a=e.length;!e[--a];)e.pop();return t.c=e,t},y.toExponential=function(t){return b(this,1,t,t)},y.toFixed=function(t){return b(this,2,t,this.e+t)},y.toPrecision=function(t){return b(this,3,t,t-1)},y.toString=function(){return b(this)},y.valueOf=y.toJSON=function(){return b(this,4)},(o=function t(){function e(r){if(!(this instanceof e))return r===m?t():new e(r);r instanceof e?(this.s=r.s,this.e=r.e,this.c=r.c.slice()):function(t,e){var r,i,n;if(0===e&&1/e<0)e="-0";else if(!v.test(e+=""))throw Error(l+"number");for(t.s="-"==e.charAt(0)?(e=e.slice(1),-1):1,(r=e.indexOf("."))>-1&&(e=e.replace(".","")),(i=e.search(/e/i))>0?(r<0&&(r=i),r+=+e.slice(i+1),e=e.substring(0,i)):r<0&&(r=e.length),n=e.length,i=0;i<n&&"0"==e.charAt(i);)++i;if(i==n)t.c=[t.e=0];else{for(;n>0&&"0"==e.charAt(--n););for(t.e=r-i-1,t.c=[],r=0;i<=n;)t.c[r++]=+e.charAt(i++)}}(this,r),this.constructor=e}return e.prototype=y,e.DP=s,e.RM=a,e.NE=u,e.PE=h,e.version="5.0.2",e}()).default=o.Big=o,void 0===(i=function(){return o}.call(e,r,e,t))||(t.exports=i)}()},function(t,e,r){"use strict";var i=this&&this.__awaiter||function(t,e,r,i){return new(r||(r=Promise))(function(n,o){function s(t){try{c(i.next(t))}catch(t){o(t)}}function a(t){try{c(i.throw(t))}catch(t){o(t)}}function c(t){t.done?n(t.value):new r(function(e){e(t.value)}).then(s,a)}c((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const n=r(4),o=r(10),s=r(11);function a(t,e,r=!1){const i=r?"pre":"div",n=document.createElement(i);n.textContent=t,n.className="box",e.appendChild(n)}const c=["BTC","LTC","ETH"];function u(t){return t[0].map((e,r)=>t.map(t=>t[r]))}!function(){i(this,void 0,void 0,function*(){const t=document.getElementById("dash");if(t){const r=yield n.getTickers(),h=yield function(){return i(this,void 0,void 0,function*(){const t=yield n.getPrices(),e=yield o.getPrices(),r=[t.btc,t.ltc,t.eth],i=[e.btc,e.ltc,e.eth],s=u([c,i,r]),[a,h,l]=s.map(t=>(p=t[1],f=t[2],p.minus(f).div(f).times(100).toFixed(2)+"%"));var p,f;return{btc:a,ltc:h,eth:l}})}();u([[r.btc,r.ltc,r.eth],[h.btc,h.ltc,h.eth]]).forEach(r=>{const i=r[0],n=r[1];a(`${i.symbol}\n`+`Price: ${e=i.price_cad,parseFloat(e).toLocaleString("en-US",{style:"currency",currency:"USD"})}\n`+`1h: ${i.percent_change_1h}%\n1d: ${i.percent_change_24h}%\n`+`7d: ${i.percent_change_7d}%\nQcx Price: ${n}`,t,!0)}),a(yield function(){return i(this,void 0,void 0,function*(){const t=yield s.getShapeshiftCoins(),e=s.availabilityCount(t),{addedCoins:r,removedCoins:i}=s.addedRemovedCoins(t),n=r.size>0?`\nAdded Coins: ${[...r].join(",")}`:"",o=i.size>0?`\nRemoved Coins: ${[...i].join(",")}`:"",a=s.xrbAvailable(t)?"exists on":"does not exist on",c=`\nRaiBlocks (XRB) ${a} Shapeshift.io`;return`Shapeshift.io has ${e.percentAvailable}% coins available (${e.unavailable} unavailable)`+c+n+o})}(),t,!0)}var e})}()},function(t,e,r){"use strict";var i=this&&this.__awaiter||function(t,e,r,i){return new(r||(r=Promise))(function(n,o){function s(t){try{c(i.next(t))}catch(t){o(t)}}function a(t){try{c(i.throw(t))}catch(t){o(t)}}function c(t){t.done?n(t.value):new r(function(e){e(t.value)}).then(s,a)}c((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(2);e.getPrices=function(){return i(this,void 0,void 0,function*(){const[t,e,r,i]=yield Promise.all([s("https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=CAD"),s("https://api.coinmarketcap.com/v1/ticker/litecoin/?convert=CAD"),s("https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=CAD"),s("https://api.coinmarketcap.com/v1/ticker/raiblocks/?convert=CAD")]);return{btc:t,ltc:e,eth:r,rai:i}})};function s(t){return i(this,void 0,void 0,function*(){return o.Big(JSON.parse((yield n(t)).text)[0].price_cad)})}e.getTickers=function(){return i(this,void 0,void 0,function*(){const[t,e,r,i]=yield Promise.all([a("https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=CAD"),a("https://api.coinmarketcap.com/v1/ticker/litecoin/?convert=CAD"),a("https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=CAD"),a("https://api.coinmarketcap.com/v1/ticker/raiblocks/?convert=CAD")]);return{btc:t,ltc:e,eth:r,rai:i}})};function a(t){return i(this,void 0,void 0,function*(){return JSON.parse((yield n(t)).text)[0]})}},function(t,e,r){t.exports=i;function i(t){if(t)return function(t){for(var e in i.prototype)t[e]=i.prototype[e];return t}(t)}i.prototype.on=i.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},i.prototype.once=function(t,e){function r(){this.off(t,r),e.apply(this,arguments)}return r.fn=e,this.on(t,r),this},i.prototype.off=i.prototype.removeListener=i.prototype.removeAllListeners=i.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var i,n=0;n<r.length;n++)if((i=r[n])===e||i.fn===e){r.splice(n,1);break}return this},i.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),r=this._callbacks["$"+t];if(r)for(var i=0,n=(r=r.slice(0)).length;i<n;++i)r[i].apply(this,e);return this},i.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},i.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,r){"use strict";var i=r(1);t.exports=n;function n(t){if(t)return function(t){for(var e in n.prototype)t[e]=n.prototype[e];return t}(t)}n.prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},n.prototype.parse=function(t){return this._parser=t,this},n.prototype.responseType=function(t){return this._responseType=t,this},n.prototype.serialize=function(t){return this._serializer=t,this},n.prototype.timeout=function(t){if(!t||"object"!=typeof t)return this._timeout=t,this._responseTimeout=0,this;for(var e in t)switch(e){case"deadline":this._timeout=t.deadline;break;case"response":this._responseTimeout=t.response;break;default:console.warn("Unknown timeout option",e)}return this},n.prototype.retry=function(t,e){return 0!==arguments.length&&!0!==t||(t=1),t<=0&&(t=0),this._maxRetries=t,this._retries=0,this._retryCallback=e,this};var o=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];n.prototype._shouldRetry=function(t,e){if(!this._maxRetries||this._retries++>=this._maxRetries)return!1;if(this._retryCallback)try{var r=this._retryCallback(t,e);if(!0===r)return!0;if(!1===r)return!1}catch(t){console.error(t)}if(e&&e.status&&e.status>=500&&501!=e.status)return!0;if(t){if(t.code&&~o.indexOf(t.code))return!0;if(t.timeout&&"ECONNABORTED"==t.code)return!0;if(t.crossDomain)return!0}return!1},n.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},n.prototype.then=function(t,e){if(!this._fullfilledPromise){var r=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise(function(t,e){r.end(function(r,i){r?e(r):t(i)})})}return this._fullfilledPromise.then(t,e)},n.prototype.catch=function(t){return this.then(void 0,t)},n.prototype.use=function(t){return t(this),this},n.prototype.ok=function(t){if("function"!=typeof t)throw Error("Callback required");return this._okCallback=t,this},n.prototype._isResponseOK=function(t){return!!t&&(this._okCallback?this._okCallback(t):t.status>=200&&t.status<300)},n.prototype.get=function(t){return this._header[t.toLowerCase()]},n.prototype.getHeader=n.prototype.get,n.prototype.set=function(t,e){if(i(t)){for(var r in t)this.set(r,t[r]);return this}return this._header[t.toLowerCase()]=e,this.header[t]=e,this},n.prototype.unset=function(t){return delete this._header[t.toLowerCase()],delete this.header[t],this},n.prototype.field=function(t,e){if(null===t||void 0===t)throw new Error(".field(name, val) name can not be empty");if(this._data&&console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"),i(t)){for(var r in t)this.field(r,t[r]);return this}if(Array.isArray(e)){for(var n in e)this.field(t,e[n]);return this}if(null===e||void 0===e)throw new Error(".field(name, val) val can not be empty");return"boolean"==typeof e&&(e=""+e),this._getFormData().append(t,e),this},n.prototype.abort=function(){return this._aborted?this:(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort"),this)},n.prototype._auth=function(t,e,r,i){switch(r.type){case"basic":this.set("Authorization","Basic "+i(t+":"+e));break;case"auto":this.username=t,this.password=e;break;case"bearer":this.set("Authorization","Bearer "+t)}return this},n.prototype.withCredentials=function(t){return void 0==t&&(t=!0),this._withCredentials=t,this},n.prototype.redirects=function(t){return this._maxRedirects=t,this},n.prototype.maxResponseSize=function(t){if("number"!=typeof t)throw TypeError("Invalid argument");return this._maxResponseSize=t,this},n.prototype.toJSON=function(){return{method:this.method,url:this.url,data:this._data,headers:this._header}},n.prototype.send=function(t){var e=i(t),r=this._header["content-type"];if(this._formData&&console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"),e&&!this._data)Array.isArray(t)?this._data=[]:this._isHost(t)||(this._data={});else if(t&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(e&&i(this._data))for(var n in t)this._data[n]=t[n];else"string"==typeof t?(r||this.type("form"),r=this._header["content-type"],this._data="application/x-www-form-urlencoded"==r?this._data?this._data+"&"+t:t:(this._data||"")+t):this._data=t;return!e||this._isHost(t)?this:(r||this.type("json"),this)},n.prototype.sortQuery=function(t){return this._sort=void 0===t||t,this},n.prototype._finalizeQueryString=function(){var t=this._query.join("&");if(t&&(this.url+=(this.url.indexOf("?")>=0?"&":"?")+t),this._query.length=0,this._sort){var e=this.url.indexOf("?");if(e>=0){var r=this.url.substring(e+1).split("&");"function"==typeof this._sort?r.sort(this._sort):r.sort(),this.url=this.url.substring(0,e)+"?"+r.join("&")}}},n.prototype._appendQueryString=function(){console.trace("Unsupported")},n.prototype._timeoutError=function(t,e,r){if(!this._aborted){var i=new Error(t+e+"ms exceeded");i.timeout=e,i.code="ECONNABORTED",i.errno=r,this.timedout=!0,this.abort(),this.callback(i)}},n.prototype._setTimeouts=function(){var t=this;this._timeout&&!this._timer&&(this._timer=setTimeout(function(){t._timeoutError("Timeout of ",t._timeout,"ETIME")},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(function(){t._timeoutError("Response timeout of ",t._responseTimeout,"ETIMEDOUT")},this._responseTimeout))}},function(t,e,r){"use strict";var i=r(8);t.exports=n;function n(t){if(t)return function(t){for(var e in n.prototype)t[e]=n.prototype[e];return t}(t)}n.prototype.get=function(t){return this.header[t.toLowerCase()]},n.prototype._setHeaderProperties=function(t){var e=t["content-type"]||"";this.type=i.type(e);var r=i.params(e);for(var n in r)this[n]=r[n];this.links={};try{t.link&&(this.links=i.parseLinks(t.link))}catch(t){}},n.prototype._setStatusProperties=function(t){var e=t/100|0;this.status=this.statusCode=t,this.statusType=e,this.info=1==e,this.ok=2==e,this.redirect=3==e,this.clientError=4==e,this.serverError=5==e,this.error=(4==e||5==e)&&this.toError(),this.accepted=202==t,this.noContent=204==t,this.badRequest=400==t,this.unauthorized=401==t,this.notAcceptable=406==t,this.forbidden=403==t,this.notFound=404==t}},function(t,e,r){"use strict";e.type=function(t){return t.split(/ *; */).shift()},e.params=function(t){return t.split(/ *; */).reduce(function(t,e){var r=e.split(/ *= */),i=r.shift(),n=r.shift();return i&&n&&(t[i]=n),t},{})},e.parseLinks=function(t){return t.split(/ *, */).reduce(function(t,e){var r=e.split(/ *; */),i=r[0].slice(1,-1);return t[r[1].split(/ *= */)[1].slice(1,-1)]=i,t},{})},e.cleanHeader=function(t,e){return delete t["content-type"],delete t["content-length"],delete t["transfer-encoding"],delete t.host,e&&(delete t.authorization,delete t.cookie),t}},function(t,e){function r(){this._defaults=[]}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(function(t){r.prototype[t]=function(){return this._defaults.push({fn:t,arguments:arguments}),this}}),r.prototype._setDefaults=function(t){this._defaults.forEach(function(e){t[e.fn].apply(t,e.arguments)})},t.exports=r},function(t,e,r){"use strict";var i=this&&this.__awaiter||function(t,e,r,i){return new(r||(r=Promise))(function(n,o){function s(t){try{c(i.next(t))}catch(t){o(t)}}function a(t){try{c(i.throw(t))}catch(t){o(t)}}function c(t){t.done?n(t.value):new r(function(e){e(t.value)}).then(s,a)}c((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(2);function s(){return i(this,void 0,void 0,function*(){const t="https://api.quadrigacx.com/v2/ticker?book=",[e,r,i,o]=yield Promise.all([JSON.parse((yield n(t+"btc_cad")).text),JSON.parse((yield n(t+"eth_cad")).text),JSON.parse((yield n(t+"ltc_cad")).text),JSON.parse((yield n(t+"bch_cad")).text)]);return{btc:e,eth:r,ltc:i,bch:o}})}e.getCurrentBooks=s;e.getPrices=function(){return i(this,void 0,void 0,function*(){const t=yield s();return{btc:o.Big(t.btc.last),eth:o.Big(t.eth.last),ltc:o.Big(t.ltc.last),bch:o.Big(t.bch.last)}})}},function(t,e,r){"use strict";var i=this&&this.__awaiter||function(t,e,r,i){return new(r||(r=Promise))(function(n,o){function s(t){try{c(i.next(t))}catch(t){o(t)}}function a(t){try{c(i.throw(t))}catch(t){o(t)}}function c(t){t.done?n(t.value):new r(function(e){e(t.value)}).then(s,a)}c((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const n=r(0);e.getShapeshiftCoins=function(){return i(this,void 0,void 0,function*(){return function(t){return i(this,void 0,void 0,function*(){return JSON.parse((yield n(t)).text)})}("https://shapeshift.io/getcoins")})};e.availabilityCount=function(t){const e=Object.values(t).length,r=Object.values(t).filter(t=>"available"===t.status).length;return{available:r,unavailable:e-r,percentAvailable:(r/e*100).toFixed(1)}};e.xrbAvailable=function(t){return Object.values(t).filter(t=>t.name.toLowerCase().includes("raiblocks")||t.symbol.toLowerCase().includes("xrb")).length>0};const o=["BTC","1ST","ANT","BAT","BNT","BCH","BCY","BLK","BTCD","BTS","CVC","CLAM","DASH","DCR","DGB","DNT","DOGE","EMC","EDG","EOS","ETH","ETC","FCT","FUN","GAME","GNO","GNT","GUP","KMD","LBC","LSK","LTC","MAID","MLN","MTL","MONA","MSC","NEO","NBT","NMC","XEM","NMR","NVC","NXT","OMG","POT","PPC","QTUM","REP","RDD","RCN","RLC","SALT","SC","SNT","STORJ","START","STEEM","SNGLS","SWT","TRST","USDT","VOX","VRC","VTC","WAVES","WINGS","XCP","XMR","XRP","ZEC","ZRX"];e.addedRemovedCoins=function(t){const e=new Set(o),r=new Set(Object.values(t).map(t=>t.symbol)),i=(t,e)=>new Set([...t].filter(t=>!e.has(t)));return{addedCoins:i(r,e),removedCoins:i(e,r)}}}]);