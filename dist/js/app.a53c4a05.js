(function(e){function t(t){for(var n,o,s=t[0],c=t[1],u=t[2],d=0,l=[];d<s.length;d++)o=s[d],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&l.push(i[o][0]),i[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);m&&m(t);while(l.length)l.shift()();return a.push.apply(a,u||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,o=1;o<r.length;o++){var s=r[o];0!==i[s]&&(n=!1)}n&&(a.splice(t--,1),e=c(c.s=r[0]))}return e}var n={},o={app:0},i={app:0},a=[];function s(e){return c.p+"js/"+({Conference:"Conference",Edit:"Edit",VoteDetailWindow:"VoteDetailWindow"}[e]||e)+"."+{Conference:"066ed97a",Edit:"f1f86ff2",VoteDetailWindow:"f71fa64e"}[e]+".js"}function c(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,c),r.l=!0,r.exports}c.e=function(e){var t=[],r={Conference:1,Edit:1,VoteDetailWindow:1};o[e]?t.push(o[e]):0!==o[e]&&r[e]&&t.push(o[e]=new Promise((function(t,r){for(var n="css/"+({Conference:"Conference",Edit:"Edit",VoteDetailWindow:"VoteDetailWindow"}[e]||e)+"."+{Conference:"55b684fd",Edit:"4139db95",VoteDetailWindow:"716f5714"}[e]+".css",i=c.p+n,a=document.getElementsByTagName("link"),s=0;s<a.length;s++){var u=a[s],d=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(d===n||d===i))return t()}var l=document.getElementsByTagName("style");for(s=0;s<l.length;s++){u=l[s],d=u.getAttribute("data-href");if(d===n||d===i)return t()}var m=document.createElement("link");m.rel="stylesheet",m.type="text/css",m.onload=t,m.onerror=function(t){var n=t&&t.target&&t.target.src||i,a=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");a.code="CSS_CHUNK_LOAD_FAILED",a.request=n,delete o[e],m.parentNode.removeChild(m),r(a)},m.href=i;var p=document.getElementsByTagName("head")[0];p.appendChild(m)})).then((function(){o[e]=0})));var n=i[e];if(0!==n)if(n)t.push(n[2]);else{var a=new Promise((function(t,r){n=i[e]=[t,r]}));t.push(n[2]=a);var u,d=document.createElement("script");d.charset="utf-8",d.timeout=120,c.nc&&d.setAttribute("nonce",c.nc),d.src=s(e);var l=new Error;u=function(t){d.onerror=d.onload=null,clearTimeout(m);var r=i[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+n+": "+o+")",l.name="ChunkLoadError",l.type=n,l.request=o,r[1](l)}i[e]=void 0}};var m=setTimeout((function(){u({type:"timeout",target:d})}),12e4);d.onerror=d.onload=u,document.head.appendChild(d)}return Promise.all(t)},c.m=e,c.c=n,c.d=function(e,t,r){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(c.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(r,n,function(t){return e[t]}.bind(null,n));return r},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="",c.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],d=u.push.bind(u);u.push=t,u=u.slice();for(var l=0;l<u.length;l++)t(u[l]);var m=d;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"08ed":function(e,t,r){"use strict";r.d(t,"d",(function(){return o})),r.d(t,"c",(function(){return i})),r.d(t,"a",(function(){return a})),r.d(t,"e",(function(){return s})),r.d(t,"b",(function(){return c})),r.d(t,"f",(function(){return u}));var n=r("cda8"),o=function(){return Object(n["a"])({url:"delibration",method:"get"})},i=function(){return Object(n["a"])({url:"delibration/leader",method:"get"})},a=function(e){var t=e.dName,r=e.startTime,o=e.endTime,i=e.position,a=e.semester,s=e.period;return Object(n["a"])({url:"delibration/createDelibration",data:{dName:t,startTime:r,endTime:o,position:i,semester:a,period:s},method:"post"})},s=function(e){return Object(n["a"])({url:"/delibration/editProposals/"+e,method:"get"})},c=function(e){return Object(n["a"])({url:"/delibration/deleteDelibration",data:{delibrationID:e},method:"delete"})},u=function(e,t){var r=t.endTime,o=t.dName,i=t.period,a=t.position,s=t.semester,c=t.startTime;return Object(n["a"])({url:"/delibration/saveEditDelibration",data:{delibrationID:e,endTime:r,dName:o,period:i,position:a,semester:s,startTime:c},method:"post"})}},"1e66":function(e,t,r){"use strict";var n=r("973f"),o=r.n(n);o.a},2051:function(e,t,r){},"21ba":function(e,t,r){"use strict";var n=r("d064"),o=r.n(n);o.a},4360:function(e,t,r){"use strict";var n=r("5530"),o=r("2b0e"),i=r("2f62"),a=r("a18c"),s={namespaced:!0,state:function(){return{isLogin:!1,isLeader:!1,studentID:""}},mutations:{login:function(e,t){var r=t.isLeader,n=t.studentID;e.isLogin=!0,e.isLeader=r,e.studentID=n},logout:function(e){e.isLogin=!1,e.isLeader=!1,e.studentID="",a["a"].push({name:"login"})}},actions:{login:function(e,t){var r=e.commit,n=t.isLeader,o=t.studentID;r("login",{isLeader:n,studentID:o})},logout:function(e){var t=e.commit;t("logout")}}},c={namespaced:!0,state:function(){return{showError:!1,errorType:"login"}},mutations:{setErrorWindow:function(e,t){var r=t.showError,n=t.errorType;e.showError=r,e.errorType=n}},actions:{setErrorWindow:function(e,t){var r=e.commit,n=t.showError,o=void 0!==n&&n,i=t.errorType,a=void 0===i?"":i;r("setErrorWindow",{showError:o,errorType:a})}}},u=(r("b0c0"),r("96cf"),r("1da1")),d=r("08ed"),l={namespaced:!0,state:function(){return{delibrationInfo:{semester:0,period:0,name:""},delibrations:[]}},mutations:{setDelibrations:function(e,t){e.delibrations=t},setDelibrationInfo:function(e,t){e.delibrationInfo=t}},actions:{setDelibrations:function(e){var t=arguments;return Object(u["a"])(regeneratorRuntime.mark((function r(){var n,o,i,a,s;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:if(n=e.commit,o=t.length>1&&void 0!==t[1]?t[1]:{},i=o.isLeader,a=void 0!==i&&i,!a){r.next=8;break}return r.next=5,Object(d["c"])();case 5:s=r.sent,r.next=11;break;case 8:return r.next=10,Object(d["d"])();case 10:s=r.sent;case 11:n("setDelibrations",s.data);case 12:case"end":return r.stop()}}),r)})))()},setDelibrationInfo:function(e,t){var r=e.commit,n=t.semester,o=t.period,i=t.name;r("setDelibrationInfo",{semester:n,period:o,name:i})}}};o["a"].use(i["a"]);t["a"]=new i["a"].Store({state:{votingInfo:{isVoting:!1,votingType:"resolution"},isLoding:!1},mutations:{setVotingStatus:function(e,t){e.votingInfo=Object(n["a"])(Object(n["a"])({},e.votingInfo),t)},setLodingStatus:function(e,t){e.isLoding=t}},actions:{setVotingStatus:function(e,t){var r=e.commit;r("setVotingStatus",t)},setLodingStatus:function(e,t){var r=e.commit;r("setLodingStatus",t)},SOCKET_closeVote:function(e){var t=e.commit;t("setVotingStatus",!1)},SOCKET_startResolutionVote:function(e){var t=e.commit;console.log("開始決議案投票"),t("setVotingStatus",{isVoting:!0,votingType:"resolution"})},SOCKET_startAmendmentVote:function(e){var t=e.commit;console.log("開始修正案投票"),t("setVotingStatus",{isVoting:!0,votingType:"amendment"})},SOCKET_closeResolutionVote:function(e){var t=e.commit;console.log("結束決議案投票"),t("setVotingStatus",{isVoting:!1,votingType:"resolution"})},SOCKET_closeAmendmentVote:function(e){var t=e.commit;console.log("結束修正案投票"),t("setVotingStatus",{isVoting:!1,votingType:"amendment"})}},modules:{user:s,error:c,delibration:l}})},"43d8":function(e,t,r){"use strict";var n=r("4f33"),o=r.n(n);o.a},"4f33":function(e,t,r){},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[e.isLoding?r("div",{staticClass:"loding-mask"},[e._m(0),e._v(" Loding ")]):e._e(),r("Navbar"),r("div",{staticClass:"container",attrs:{id:"main"}},[r("router-view")],1),e.showError?r("ErrorWindow"):e._e(),r("Footer",{directives:[{name:"show",rawName:"v-show",value:e.showFooter,expression:"showFooter"}]})],1)},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"lds-grid"},[r("div"),r("div"),r("div"),r("div"),r("div"),r("div"),r("div"),r("div"),r("div")])}],a=(r("b0c0"),r("5530")),s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"navbar"},[n("router-link",{staticClass:"navbar__icon",attrs:{to:"/",tag:"div"}},[n("img",{attrs:{src:r("7409")}})]),e.$route.params.delibrationID?n("div",{staticClass:"navbar__title"},[n("p",{staticClass:"session"},[e._v(e._s(e.delibrationInfo.semester)+"學年度第"+e._s(e.delibrationInfo.period)+"會期")]),n("h2",{staticClass:"name"},[e._v(e._s(e.delibrationInfo.name))])]):n("h1",{staticClass:"navbar__title"},[e._v(e._s(e.$route.meta.title))]),e.isLoginPage?e._e():n("div",{staticClass:"navbar__logout",on:{click:e.userLogout}},[e._v("登出")])],1)},c=[],u=r("2f62"),d={name:"Navbar",computed:Object(a["a"])(Object(a["a"])({},Object(u["c"])("delibration",["delibrationInfo"])),{},{isLoginPage:function(){return"/login"===this.$route.path}}),methods:Object(a["a"])({},Object(u["b"])({userLogout:"user/logout"}))},l=d,m=(r("9926"),r("2877")),p=Object(m["a"])(l,s,c,!1,null,"5e086d16",null),f=p.exports,v=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},g=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"footer"},[r("p",[e._v("成大學代大會議事系統")])])}],b={name:"Footer"},h=b,_=(r("5843"),Object(m["a"])(h,v,g,!1,null,"2c78fbde",null)),w=_.exports,C=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"error_window container window"},[r("div",{staticClass:"close_layer",on:{click:function(t){return e.setErrorWindow({})}}}),r("div",{staticClass:"error_container"},[r("span",{staticClass:"error_block"},[e._v("錯 誤")]),r("p",{staticClass:"error_message"},[e._v(e._s(e.errorMessage))]),r("button",{staticClass:"error_return"},[e._v("點擊畫面返回")])])])},y=[],O={name:"ErrorWindow",data:function(){return{}},computed:Object(a["a"])({errorMessage:function(){return{login:"帳號或密碼錯誤，請重新嘗試",notAvailable:"會議簽到未開放/已過期",cantVote:"議案尚未開放投票，請稍後再試",cantChangeManipulation:"投票中無法切換，請先結束當前決議/動議",duplicateRegisteration:"學生ID重複，註冊失敗",register:"系統錯誤，請稍後重試",cantShowResult:"投票進行中，無法查看結果"}[this.errorType]}},Object(u["c"])({errorType:function(e){return e.error.errorType}})),methods:Object(a["a"])({},Object(u["b"])({setErrorWindow:"error/setErrorWindow"}))},E=O,j=(r("6dd8"),Object(m["a"])(E,C,y,!1,null,null,null)),D=j.exports,x={name:"app",components:{Navbar:f,Footer:w,ErrorWindow:D},data:function(){return{}},computed:Object(a["a"])(Object(a["a"])({},Object(u["c"])({showError:function(e){return e.error.showError},isLoding:"isLoding"})),{},{showFooter:function(){return"detail"!==this.$route.name}})},k=x,I=(r("5c0b"),Object(m["a"])(k,o,i,!1,null,null,null)),L=I.exports,T=r("a18c"),S=r("4360"),V=r("5132"),P=r.n(V);r("fce9");n["a"].config.productionTip=!1,n["a"].use(new P.a({debug:!1,connection:"/",vuex:{store:S["a"],actionPrefix:"SOCKET_",mutationPrefix:"SOCKET_"}})),new n["a"]({router:T["a"],store:S["a"],render:function(e){return e(L)}}).$mount("#app")},5843:function(e,t,r){"use strict";var n=r("60ff"),o=r.n(n);o.a},"5c0b":function(e,t,r){"use strict";var n=r("9c0c"),o=r.n(n);o.a},"60ff":function(e,t,r){},"6dd8":function(e,t,r){"use strict";var n=r("2051"),o=r.n(n);o.a},7409:function(e,t,r){e.exports=r.p+"img/brand-icon.5a57c816.svg"},"973f":function(e,t,r){},9926:function(e,t,r){"use strict";var n=r("a540"),o=r.n(n);o.a},"9c0c":function(e,t,r){},a18c:function(e,t,r){"use strict";r("45fc"),r("d3b7");var n=r("2b0e"),o=r("8c4f"),i=r("4360"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"home"},e._l(e.home_link,(function(t){return r("router-link",{key:t[0],staticClass:"home__block_link",class:{unopened:!t[1]},attrs:{tag:"div",to:t[1]}},[e._v(" "+e._s(t[0])+" ")])})),1)},s=[],c=r("5530"),u=r("2f62"),d={name:"Home",data:function(){return{home_link:[["公共提案",""],["選舉系統",""],["近期議案",""],["新增會議",""],["編輯會議",""],["加入會議","/conference"]]}},methods:Object(c["a"])({},Object(u["b"])({setDelibrations:"delibration/setDelibrations"})),computed:Object(c["a"])({},Object(u["c"])({isLeader:function(e){return e.user.isLeader}})),created:function(){this.isLeader&&(this.home_link[4]=["編輯會議","/editConference"],this.home_link[3]=["新增會議","/createConference"]),this.setDelibrations({isLeader:this.isLeader})}},l=d,m=(r("1e66"),r("2877")),p=Object(m["a"])(l,a,s,!1,null,"af194a9e",null),f=p.exports,v=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"Login"},[r("form",{staticClass:"login_form",on:{submit:function(t){return t.preventDefault(),e.login(t)}}},[r("div",{staticClass:"login_form__account"},[r("label",{attrs:{for:"account"}},[e._v("帳 號")]),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.studentID,expression:"studentID",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"account",type:"text",placeholder:"學號(H00000000)",required:""},domProps:{value:e.studentID},on:{input:function(t){t.target.composing||(e.studentID=t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}})]),r("div",{staticClass:"login_form__password"},[r("label",{attrs:{for:"password"}},[e._v("密 碼")]),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.password,expression:"password",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"password",type:"password",placeholder:"密碼(隨便打)",required:""},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}})]),r("div",{staticClass:"login_btn_container"},[r("button",{staticClass:"login_form__btn",class:{isValid:e.isValid},attrs:{type:"submit"}},[e._v("登 入")]),r("router-link",{staticClass:"login_form__btn",attrs:{tag:"button",to:{name:"register"}}},[e._v("註 冊")])],1)])])},g=[],b=(r("96cf"),r("1da1")),h=(r("b0c0"),r("cda8")),_=function(e){var t=e.studentID,r=e.department,n=e.grade,o=e.email,i=e.name,a=e.password,s=e.position;return Object(h["a"])({url:"user/signup",data:{studentID:t,department:r,grade:n,email:o,name:i,password:a,position:s},method:"post"})},w=function(e,t){return Object(h["a"])({url:"user/login",data:{studentID:e,password:t},method:"post"})},C={name:"Login",data:function(){return{studentID:"",password:""}},computed:{isValid:function(){return!(!this.studentID||!this.password)}},methods:Object(c["a"])(Object(c["a"])({},Object(u["b"])({userLogin:"user/login",setErrorWindow:"error/setErrorWindow"})),{},{login:function(){var e=this;return Object(b["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.isValid){t.next=15;break}return t.prev=1,t.next=4,w(e.studentID,e.password);case 4:if(r=t.sent,!r.data.studentID){t.next=10;break}return t.next=8,e.userLogin({isLeader:r.data.isLeader,studentID:r.data.studentID});case 8:console.log("route: ",e.$route),e.$router.push({name:"home"});case 10:t.next=15;break;case 12:t.prev=12,t.t0=t["catch"](1),e.setErrorWindow({showError:!0,errorType:"login"});case 15:case"end":return t.stop()}}),t,null,[[1,12]])})))()}})},y=C,O=(r("43d8"),Object(m["a"])(y,v,g,!1,null,"5bb3bd0f",null)),E=O.exports,j=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"Register"},[r("form",{staticClass:"register_form",on:{submit:function(t){return t.preventDefault(),e.register()}}},[r("div",{staticClass:"register_form__item"},[r("label",{attrs:{for:"account"}},[e._v("帳 號")]),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.studentID,expression:"studentID",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"account",type:"text",placeholder:"學號(H00000000)",required:""},domProps:{value:e.studentID},on:{input:function(t){t.target.composing||(e.studentID=t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}})]),r("div",{staticClass:"register_form__item"},[r("label",{attrs:{for:"password"}},[e._v("密 碼")]),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.password,expression:"password",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"password",type:"password",placeholder:"密碼(隨便打)",required:""},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}})]),r("div",{staticClass:"register_form__item"},[r("label",{attrs:{for:"department"}},[e._v("系 所")]),r("select",{directives:[{name:"model",rawName:"v-model.trim",value:e.department,expression:"department",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"department",required:""},on:{change:function(t){var r=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.department=t.target.multiple?r:r[0]}}},[r("option",{attrs:{value:"工資系",selected:"selected"}},[e._v("工資系")]),r("option",{attrs:{value:"統計系"}},[e._v("統計系")])])]),r("div",{staticClass:"register_form__item"},[r("label",{attrs:{for:"grade"}},[e._v("系 級")]),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.grade,expression:"grade",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"grade",type:"text",placeholder:"110",required:""},domProps:{value:e.grade},on:{input:function(t){t.target.composing||(e.grade=t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}})]),r("div",{staticClass:"register_form__item"},[r("label",{attrs:{for:"name"}},[e._v("姓 名")]),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.name,expression:"name",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"name",type:"text",placeholder:"成大人",required:""},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}})]),r("div",{staticClass:"register_form__item"},[r("label",{attrs:{for:"email"}},[e._v("信 箱")]),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.email,expression:"email",modifiers:{trim:!0}}],staticClass:"input",attrs:{id:"email",type:"email",placeholder:"123@example.com",required:""},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}})]),r("div",{staticClass:"register_form__item"},[r("p",[e._v("預設為學代，如有其他身份請勾選")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.position,expression:"position"}],attrs:{type:"checkbox",id:"財委",value:"財委"},domProps:{checked:Array.isArray(e.position)?e._i(e.position,"財委")>-1:e.position},on:{change:function(t){var r=e.position,n=t.target,o=!!n.checked;if(Array.isArray(r)){var i="財委",a=e._i(r,i);n.checked?a<0&&(e.position=r.concat([i])):a>-1&&(e.position=r.slice(0,a).concat(r.slice(a+1)))}else e.position=o}}}),r("label",{attrs:{for:"財委"}},[e._v("財委")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.position,expression:"position"}],attrs:{type:"checkbox",id:"主委",value:"主委"},domProps:{checked:Array.isArray(e.position)?e._i(e.position,"主委")>-1:e.position},on:{change:function(t){var r=e.position,n=t.target,o=!!n.checked;if(Array.isArray(r)){var i="主委",a=e._i(r,i);n.checked?a<0&&(e.position=r.concat([i])):a>-1&&(e.position=r.slice(0,a).concat(r.slice(a+1)))}else e.position=o}}}),r("label",{attrs:{for:"主委"}},[e._v("主委")])]),r("button",{staticClass:"register_form__btn",attrs:{type:"submit"}},[e._v("註 冊")])])])},D=[],x={name:"Register",data:function(){return{studentID:"",password:"",department:"工資系",grade:"",name:"",email:"",position:[]}},computed:Object(c["a"])({},Object(u["c"])(["errorInfo"])),methods:Object(c["a"])({register:function(){var e=this;return Object(b["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,_({studentID:e.studentID,password:e.password,department:e.department,grade:e.grade,name:e.name,email:e.email,position:e.position});case 3:if(r=t.sent,"success"!==r.data.message){t.next=8;break}return t.next=7,e.userLogin({isLeader:!1,studentID:e.studentID});case 7:e.$router.push({name:"home"});case 8:t.next=19;break;case 10:t.prev=10,t.t0=t["catch"](0),t.t1=t.t0.message,t.next="duplicated"===t.t1?15:17;break;case 15:return e.setErrorWindow({showError:!0,errorType:"duplicateRegisteration"}),t.abrupt("break",19);case 17:return e.setErrorWindow({showError:!0,errorType:"register"}),t.abrupt("break",19);case 19:case"end":return t.stop()}}),t,null,[[0,10]])})))()}},Object(u["b"])({userLogin:"user/login",setErrorWindow:"error/setErrorWindow"}))},k=x,I=(r("21ba"),Object(m["a"])(k,j,D,!1,null,"6ab1289c",null)),L=I.exports;n["a"].use(o["a"]);var T=[{path:"/",name:"home",component:f,meta:{title:"成大學代會"}},{path:"/login",name:"login",component:E,meta:{title:"登入系統"}},{path:"/register",name:"register",component:L,meta:{title:"註冊帳號"}},{path:"/conference",name:"conference",component:function(){return r.e("Conference").then(r.bind(null,"d641"))},meta:{title:"加入會議"}},{path:"/conference/:delibrationID",name:"schedule",component:function(){return r.e("Conference").then(r.bind(null,"07cf"))}},{path:"/editConference",name:"editConference",component:function(){return r.e("Edit").then(r.bind(null,"40c3"))},meta:{title:"編輯會議",requiresAuth:!0}},{path:"/editConference/:delibrationID",name:"editSchedule",component:function(){return r.e("Edit").then(r.bind(null,"9497"))},meta:{requiresAuth:!0}},{path:"/createConference",name:"createConference",component:function(){return r.e("Edit").then(r.bind(null,"6b59"))},meta:{title:"新增會議",requiresAuth:!0}},{path:"/vote",name:"vote",component:function(){return r.e("VoteDetailWindow").then(r.bind(null,"a76e"))}},{path:"/conference/:delibrationID/proposal/:proposalID",name:"detail",component:function(){return r.e("Conference").then(r.bind(null,"496f"))}},{path:"/edit/:delibrationID",name:"edit",component:function(){return r.e("Edit").then(r.bind(null,"c60f"))},meta:{title:"編輯會議資訊",requiresAuth:!0}}],S=new o["a"]({routes:T,store:i["a"],scrollBehavior:function(e,t,r){return r||{x:0,y:0}}});S.beforeEach((function(e,t,r){if(i["a"].dispatch("setLodingStatus",!1),i["a"].state.user.isLogin)"/login"===e.path?r({path:"/",replace:!0}):e.matched.some((function(e){return e.meta.requiresAuth}))&&!i["a"].state.user.isLeader?r({path:"/"}):r();else switch(e.path){case"/login":r();break;case"/register":r();break;default:r({path:"/login"})}}));t["a"]=S},a540:function(e,t,r){},cda8:function(e,t,r){"use strict";r("d3b7"),r("96cf");var n=r("1da1"),o=r("bc3a"),i=r.n(o),a=function(e,t){switch(e){case 400:console.log(e,t);break;case 401:console.log(e,t);break;case 403:console.log(e,t);break;case 404:console.log(e,t);break;default:console.log(e,t)}},s=i.a.create({baseURL:"/api",withCredentials:!0,timeout:7e3,headers:{"Content-Type":"application/json"}});s.interceptors.request.use(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",t);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),(function(e){return Promise.reject(e)})),s.interceptors.response.use(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return console.log(t),e.abrupt("return",t);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),(function(e){return e?(console.log(e),a(e.response.status,e.response.data),Promise.reject(e.response.data)):window.navigator.onLine?Promise.reject(e.response.data):void console.log("Internet has been offLine, please check")})),t["a"]=s},d064:function(e,t,r){},fce9:function(e,t,r){}});
//# sourceMappingURL=app.a53c4a05.js.map