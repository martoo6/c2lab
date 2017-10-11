(function(){'use strict';
var e="object"===typeof __ScalaJSEnv&&__ScalaJSEnv?__ScalaJSEnv:{},l="object"===typeof e.global&&e.global?e.global:"object"===typeof global&&global&&global.Object===Object?global:this;e.global=l;e.exportsNamespace="object"===typeof e.exportsNamespace&&e.exportsNamespace?e.exportsNamespace:l;l.Object.freeze(e);var m={envInfo:e,semantics:{asInstanceOfs:2,arrayIndexOutOfBounds:2,moduleInit:2,strictFloats:!1,productionMode:!0},assumingES6:!1,linkerVersion:"0.6.20",globalThis:this};l.Object.freeze(m);
l.Object.freeze(m.semantics);var n=l.Math.imul||function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0},p=l.Math.clz32||function(a){if(0===a)return 32;var b=1;0===(a&4294901760)&&(a<<=16,b+=16);0===(a&4278190080)&&(a<<=8,b+=8);0===(a&4026531840)&&(a<<=4,b+=4);0===(a&3221225472)&&(a<<=2,b+=2);return b+(a>>31)},q=0,t=l.WeakMap?new l.WeakMap:null;function u(a){return function(b,c){return!(!b||!b.$classData||b.$classData.k!==c||b.$classData.i!==a)}}
function aa(a){for(var b in a)return b}function v(a,b,c){var d=new a.B(b[c]);if(c<b.length-1){a=a.l;c+=1;for(var f=d.z,g=0;g<f.length;g++)f[g]=v(a,b,c)}return d}function ca(a){switch(typeof a){case "string":return w(x);case "number":var b=a|0;return b===a?y(b)?w(z):A(b)?w(B):w(C):"number"===typeof a?w(D):w(E);case "boolean":return w(F);case "undefined":return w(G);default:return null===a?a.S():a&&a.$classData&&a.$classData.e.x?w(H):a&&a.$classData?w(a.$classData):null}}
function I(a){switch(typeof a){case "string":J||(J=(new K).g());for(var b=0,c=1,d=-1+(a.length|0)|0;0<=d;)b=b+n(65535&(a.charCodeAt(d)|0),c)|0,c=n(31,c),d=-1+d|0;return b;case "number":L||(L=(new M).g());b=L;c=a|0;if(c===a&&-Infinity!==1/a)b=c;else{if(b.f)b.C[0]=a,b=N(b.r[b.E]|0,b.r[b.D]|0);else{if(a!==a)b=!1,a=2047,c=+l.Math.pow(2,51);else if(Infinity===a||-Infinity===a)b=0>a,a=2047,c=0;else if(0===a)b=-Infinity===1/a,c=a=0;else if(d=(b=0>a)?-a:a,d>=+l.Math.pow(2,-1022)){a=+l.Math.pow(2,52);var c=
+l.Math.log(d)/.6931471805599453,c=+l.Math.floor(c)|0,c=1023>c?c:1023,f=+l.Math.pow(2,c);f>d&&(c=-1+c|0,f/=2);f=d/f*a;d=+l.Math.floor(f);f-=d;d=.5>f?d:.5<f?1+d:0!==d%2?1+d:d;2<=d/a&&(c=1+c|0,d=1);1023<c?(c=2047,d=0):(c=1023+c|0,d-=a);a=c;c=d}else a=d/+l.Math.pow(2,-1074),c=+l.Math.floor(a),d=a-c,a=0,c=.5>d?c:.5<d?1+c:0!==c%2?1+c:c;c=+c;b=N(c|0,(b?-2147483648:0)|(a|0)<<20|c/4294967296|0)}b=b.s^b.q}return b;case "boolean":return a?1231:1237;case "undefined":return 0;default:return a&&a.$classData||
null===a?a.w():null===t?42:O(a)}}function da(a,b){var c=l.Object.getPrototypeOf,d=l.Object.getOwnPropertyDescriptor;for(a=c(a);null!==a;){var f=d(a,b);if(void 0!==f)return f;a=c(a)}}function ea(a,b,c){a=da(a,c);if(void 0!==a)return c=a.get,void 0!==c?c.call(b):a.value}function fa(a,b,c,d){a=da(a,c);if(void 0!==a&&(a=a.set,void 0!==a)){a.call(b,d);return}throw new l.TypeError("super has no setter '"+c+"'.");}
var O=null!==t?function(a){switch(typeof a){case "string":case "number":case "boolean":case "undefined":return I(a);default:if(null===a)return 0;var b=t.get(a);void 0===b&&(q=b=q+1|0,t.set(a,b));return b}}:function(a){if(a&&a.$classData){var b=a.$idHashCode$0;if(void 0!==b)return b;if(l.Object.isSealed(a))return 42;q=b=q+1|0;return a.$idHashCode$0=b}return null===a?0:I(a)};function y(a){return"number"===typeof a&&a<<24>>24===a&&1/a!==1/-0}
function A(a){return"number"===typeof a&&a<<16>>16===a&&1/a!==1/-0}function P(){this.t=this.B=void 0;this.i=this.l=this.e=null;this.k=0;this.A=null;this.p="";this.b=this.n=this.o=void 0;this.name="";this.isRawJSType=this.isArrayClass=this.isInterface=this.isPrimitive=!1;this.isInstance=void 0}function Q(a,b,c){var d=new P;d.e={};d.l=null;d.A=a;d.p=b;d.b=function(){return!1};d.name=c;d.isPrimitive=!0;d.isInstance=function(){return!1};return d}
function R(a,b,c,d,f,g,k){var h=new P,r=aa(a);g=g||function(a){return!!(a&&a.$classData&&a.$classData.e[r])};k=k||function(a,b){return!!(a&&a.$classData&&a.$classData.k===b&&a.$classData.i.e[r])};h.t=f;h.e=c;h.p="L"+b+";";h.b=k;h.name=b;h.isInterface=!1;h.isRawJSType=!!d;h.isInstance=g;return h}
function ga(a){function b(a){if("number"===typeof a){this.z=Array(a);for(var b=0;b<a;b++)this.z[b]=f}else this.z=a}var c=new P,d=a.A,f="longZero"==d?S().u:d;b.prototype=new T;b.prototype.constructor=b;b.prototype.$classData=c;var d="["+a.p,g=a.i||a,k=a.k+1;c.B=b;c.t=ha;c.e={a:1,U:1,c:1};c.l=a;c.i=g;c.k=k;c.A=null;c.p=d;c.o=void 0;c.n=void 0;c.b=void 0;c.name=d;c.isPrimitive=!1;c.isInterface=!1;c.isArrayClass=!0;c.isInstance=function(a){return g.b(a,k)};return c}
function w(a){if(!a.o){var b=new U;b.m=a;a.o=b}return a.o}P.prototype.getFakeInstance=function(){return this===x?"some string":this===F?!1:this===z||this===B||this===C||this===D||this===E?0:this===H?S().u:this===G?void 0:{$classData:this}};P.prototype.getSuperclass=function(){return this.t?w(this.t):null};P.prototype.getComponentType=function(){return this.l?w(this.l):null};P.prototype.newArrayOfThisClass=function(a){for(var b=this,c=0;c<a.length;c++)b.n||(b.n=ga(b)),b=b.n;return v(b,a,0)};
var ia=Q(!1,"Z","boolean"),ja=Q(0,"C","char"),ka=Q(0,"B","byte"),la=Q(0,"S","short"),ma=Q(0,"I","int"),na=Q("longZero","J","long"),oa=Q(0,"F","float"),qa=Q(0,"D","double");ia.b=u(ia);ja.b=u(ja);ka.b=u(ka);la.b=u(la);ma.b=u(ma);na.b=u(na);oa.b=u(oa);qa.b=u(qa);function V(){}function T(){}T.prototype=V.prototype;V.prototype.g=function(){return this};V.prototype.y=function(){var a=ca(this).m.name,b=(+(this.w()>>>0)).toString(16);return a+"@"+b};V.prototype.w=function(){return O(this)};V.prototype.toString=function(){return this.y()};var ha=R({a:0},"java.lang.Object",{a:1},void 0,void 0,function(a){return null!==a},function(a,b){if(a=a&&a.$classData){var c=a.k||0;return!(c<b)&&(c>b||!a.i.isPrimitive)}return!1});V.prototype.$classData=ha;
function U(){this.m=null}U.prototype=new T;U.prototype.constructor=U;U.prototype.y=function(){return(this.m.isInterface?"interface ":this.m.isPrimitive?"":"class ")+this.m.name};U.prototype.$classData=R({I:0},"java.lang.Class",{I:1,a:1});function M(){this.f=!1;this.C=this.r=this.j=null;this.v=!1;this.E=this.D=0}M.prototype=new T;M.prototype.constructor=M;
M.prototype.g=function(){L=this;this.j=(this.f=!!(l.ArrayBuffer&&l.Int32Array&&l.Float32Array&&l.Float64Array))?new l.ArrayBuffer(8):null;this.r=this.f?new l.Int32Array(this.j,0,2):null;this.f&&new l.Float32Array(this.j,0,2);this.C=this.f?new l.Float64Array(this.j,0,1):null;if(this.f)this.r[0]=16909060,a=1===((new l.Int8Array(this.j,0,8))[0]|0);else var a=!0;this.D=(this.v=a)?0:1;this.E=this.v?1:0;return this};M.prototype.$classData=R({O:0},"scala.scalajs.runtime.Bits$",{O:1,a:1});var L=void 0;
function K(){}K.prototype=new T;K.prototype.constructor=K;K.prototype.g=function(){return this};K.prototype.$classData=R({Q:0},"scala.scalajs.runtime.RuntimeString$",{Q:1,a:1});var J=void 0;function W(){}W.prototype=new T;W.prototype.constructor=W;function ra(){}ra.prototype=W.prototype;var G=R({R:0},"scala.runtime.BoxedUnit",{R:1,a:1,c:1},void 0,void 0,function(a){return void 0===a}),F=R({G:0},"java.lang.Boolean",{G:1,a:1,c:1,d:1},void 0,void 0,function(a){return"boolean"===typeof a});
function X(){this.u=null}X.prototype=new T;X.prototype.constructor=X;X.prototype.g=function(){Y=this;this.u=N(0,0);return this};
function sa(a,b){if(0===(-2097152&b))b=""+(4294967296*b+ +(a>>>0));else{var c=(32+p(1E9)|0)-(0!==b?p(b):32+p(a)|0)|0,d=c,f=0===(32&d)?1E9<<d:0,d=0===(32&d)?5E8>>>(31-d|0)|0|0<<d:1E9<<d,g=a,k=b;for(a=b=0;0<=c&&0!==(-2097152&k);){var h=g,r=k,pa=f,ba=d;if(r===ba?(-2147483648^h)>=(-2147483648^pa):(-2147483648^r)>=(-2147483648^ba))h=k,r=d,k=g-f|0,h=(-2147483648^k)>(-2147483648^g)?-1+(h-r|0)|0:h-r|0,g=k,k=h,32>c?b|=1<<c:a|=1<<c;c=-1+c|0;h=d>>>1|0;f=f>>>1|0|d<<31;d=h}c=k;if(0===c?-1147483648<=(-2147483648^
g):-2147483648<=(-2147483648^c))c=4294967296*k+ +(g>>>0),g=c/1E9,f=g/4294967296|0,d=b,b=g=d+(g|0)|0,a=(-2147483648^g)<(-2147483648^d)?1+(a+f|0)|0:a+f|0,g=c%1E9|0;c=""+g;b=""+(4294967296*a+ +(b>>>0))+"000000000".substring(c.length|0)+c}return b}X.prototype.$classData=R({P:0},"scala.scalajs.runtime.RuntimeLong$",{P:1,a:1,V:1,c:1});var Y=void 0;function S(){Y||(Y=(new X).g());return Y}
var x=R({F:0},"java.lang.String",{F:1,a:1,c:1,T:1,d:1},void 0,void 0,function(a){return"string"===typeof a}),z=R({H:0},"java.lang.Byte",{H:1,h:1,a:1,c:1,d:1},void 0,void 0,function(a){return y(a)}),E=R({J:0},"java.lang.Double",{J:1,h:1,a:1,c:1,d:1},void 0,void 0,function(a){return"number"===typeof a}),D=R({K:0},"java.lang.Float",{K:1,h:1,a:1,c:1,d:1},void 0,void 0,function(a){return"number"===typeof a}),C=R({L:0},"java.lang.Integer",{L:1,h:1,a:1,c:1,d:1},void 0,void 0,function(a){return"number"===
typeof a&&(a|0)===a&&1/a!==1/-0}),H=R({M:0},"java.lang.Long",{M:1,h:1,a:1,c:1,d:1},void 0,void 0,function(a){return!!(a&&a.$classData&&a.$classData.e.x)}),B=R({N:0},"java.lang.Short",{N:1,h:1,a:1,c:1,d:1},void 0,void 0,function(a){return A(a)});function Z(){this.q=this.s=0}Z.prototype=new ra;Z.prototype.constructor=Z;Z.prototype.y=function(){S();var a=this.s,b=this.q;return b===a>>31?""+a:0>b?"-"+sa(-a|0,0!==a?~b:-b|0):sa(a,b)};function N(a,b){var c=new Z;c.s=a;c.q=b;return c}
Z.prototype.w=function(){return this.s^this.q};Z.prototype.$classData=R({x:0},"scala.scalajs.runtime.RuntimeLong",{x:1,h:1,a:1,c:1,d:1});
}).call(this);
//# sourceMappingURL=c2lab-opt.js.map
