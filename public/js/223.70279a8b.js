"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[223],{4223:function(e,n,l){l.r(n),l.d(n,{default:function(){return v}});var a=l(5288),t=l(3339),o=l(2766);const r=e=>((0,a.dD)("data-v-8b027390"),e=e(),(0,a.Cn)(),e),i=r((()=>(0,a._)("header",null,[(0,a._)("h1",null,"login to your Teameet accout")],-1))),u=r((()=>(0,a._)("br",null,null,-1))),s=r((()=>(0,a._)("br",null,null,-1))),c=r((()=>(0,a._)("button",{type:"submit",onclick:"login()"},"Log In",-1))),d=r((()=>(0,a._)("br",null,null,-1))),f=(0,a.Uk)(" You don't have an account, yet? ");var p=(0,a.aZ)({__name:"Login",setup(e){const n=new URLSearchParams(document.location.search),l=decodeURI(n.get("ref")),r=(0,o.iH)(null),p=(0,o.iH)(null),h=(0,o.iH)(null),_=(0,o.iH)(null);function v(){fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:p.value.value,password:h.value.value})}).then((e=>e.json())).then((e=>{200==e.status?location.href=l||"/":r.value.style.display="block"}))}return fetch("/api/login").then((e=>e.json())).then((e=>{200==e.status&&(location.href=l||"/")})),(0,a.bv)((()=>{_.value.href="/register/?ref="+l})),(e,n)=>((0,a.wg)(),(0,a.iD)("div",null,[i,(0,a._)("main",null,[(0,a._)("form",{onSubmit:n[0]||(n[0]=(0,t.iM)((e=>v()),["prevent"]))},[(0,a._)("input",{id:"email",ref_key:"email",ref:p,placeholder:"E-Mail",type:"email"},null,512),u,(0,a._)("input",{id:"password",ref_key:"password",ref:h,placeholder:"Password",type:"password"},null,512),s,c,(0,a._)("p",null,[(0,a._)("span",{class:"failed",ref_key:"loginfailed",ref:r},"You typed in the wrong E-Mail or Password",512)])],32),d,(0,a._)("div",null,[f,(0,a._)("a",{ref_key:"register",ref:_,class:"button",href:"/register"},"you can register a new one here",512)])])]))}}),h=l(7184);const _=(0,h.Z)(p,[["__scopeId","data-v-8b027390"]]);var v=_}}]);
//# sourceMappingURL=223.70279a8b.js.map