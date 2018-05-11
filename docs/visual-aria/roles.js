/*!
Visual ARIA Bookmarklet (CSS: 03/08/2018), JS last modified 05/11/2018
Copyright 2018 Bryan Garaventa (http://whatsock.com/training/matrices/visual-aria.htm)
Part of the ARIA Role Conformance Matrices, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

// Set useOffline=true to disable the dynamic loader,
// or reference an https:// path to ensure that both secure and non-secure sites can be accessed by Visual ARIA when useOffline=false.
// When useOffline=true, the roles.css file must be manually added to provide visual feedback within the same document where roles.js is being processed.
	var useOffline = false,

	// Base path for dynamic loading of individual CSS files.
	basePath = 'https://accdc.github.io/visual-aria/visual-aria/public/',

// Set millisecond interval for dynamically loading supporting CSS files and performing the naming calculation for widget roles
	msInterval = 3000;

	if (!document.getElementById('ws-bm-aria-matrices-lnk')){
		var s = document.createElement('span');
		s.className = 'WS-BM-Loading-Msg';
		s.innerHTML
			= '<span role="alert" style="position: fixed; z-index:10000; color: white; background-color: black; border: inset thick gray; top: 40%; left: 35%; padding: 20px; font-size: 18pt;">Loading Visual ARIA, please wait.<br /><i>(Hold down Ctrl+Shift then Left-click any role for more details.)</i></span>';
		document.body.appendChild(s);
	}

	var WSBMInit = function(isTop, useOffline, basePath, msInterval, document, attrs, isNested, check, loaded){

		var bind = function(obj, type, fn){
			if (obj.attachEvent){
				obj['e' + type + fn] = fn;

				obj[type + fn] = function(){
					obj['e' + type + fn](window.event);
				};

				obj.attachEvent('on' + type, obj[type + fn]);
			}

			else if (obj.addEventListener){
				obj.addEventListener(type, fn, false);
			}

			return obj;
		}, trim = function(str){
			if (typeof str !== 'string')
				return '';

			return str.replace(/^\s+|\s+$/g, '');
		}, activeObj = null, activeDObj = null;

		attrs
			= 'aria-disabled,aria-readonly,aria-haspopup,aria-orientation,aria-label,aria-labelledby,aria-describedby,aria-pressed,aria-checked,aria-valuemin,aria-valuemax,aria-valuenow,aria-valuetext,aria-controls,aria-autocomplete,aria-expanded,aria-owns,aria-activedescendant,aria-posinset,aria-setsize,aria-level,role,alt'.split(
				',');
		isNested = function(start, role){
			while (start){
				start = start.parentNode;

				if (start.getAttribute('role') == role)
					return 'true';
			}

			return 'false';
		};

		check = function(nodes, obj, frames, focused, pNode, focusHidden, isSelfRef, isDefTerm){
			if (loaded && loaded.init){
				if (!loaded.comboboxListbox && !document.getElementById('ws-visual-aria-7')
					&& document.querySelectorAll('*[role="combobox"], *[role="listbox"], *[role="option"]').length){
					loaded.comboboxListbox = true;
					loadCSS('7combobox-listbox.css', '7');
				}

				if (!loaded.menuMenubar
					&& !document.getElementById('ws-visual-aria-8')
						&& document.querySelectorAll(
							'*[role="menu"], *[role="menubar"], *[role="menuitem"], *[role="menuitemradio"], *[role="menuitemcheckbox"]').length)
					{
					loaded.menuMenubar = true;
					loadCSS('8menu-menubar.css', '8');
				}

				if (!loaded.radiogroup && !document.getElementById('ws-visual-aria-9')
					&& document.querySelectorAll('*[role="radiogroup"], *[role="radio"]').length){
					loaded.radiogroup = true;
					loadCSS('9radiogroup.css', '9');
				}

				if (!loaded.tablist && !document.getElementById('ws-visual-aria-10')
					&& document.querySelectorAll('*[role="tablist"], *[role="tab"], *[role="tabpanel"]').length){
					loaded.tablist = true;
					loadCSS('10tablist.css', '10');
				}

				if (!loaded.tree && !document.getElementById('ws-visual-aria-11')
					&& document.querySelectorAll('*[role="tree"], *[role="treeitem"]').length){
					loaded.tree = true;
					loadCSS('11tree.css', '11');
				}

				if (!loaded.treegridGridTable
					&& !document.getElementById('ws-visual-aria-12')
						&& document.querySelectorAll(
							'*[role="treegrid"], *[role="grid"], *[role="table"], *[role="rowgroup"], *[role="row"], *[role="columnheader"], *[role="rowheader"], *[role="gridcell"], *[role="cell"]').length)
					{
					loaded.treegridGridTable = true;
					loadCSS('12treegrid-grid-table.css', '12');
				}
			}

			if (loaded && !loaded.init){
				loaded.init = true;
				loadCSS('1roles.css', '1');
				loaded.landmarks = true;
				loadCSS('2landmarks.css', '2');
				loaded.structural = true;
				loadCSS('3structural.css', '3');
				loaded.dialogs = true;
				loadCSS('4dialogs.css', '4');
				loaded.liveRegions = true;
				loadCSS('5live-regions.css', '5');
				loaded.simpleWidgets = true;
				loadCSS('6simple-widgets.css', '6');
			}

			// BG:12/18/2017: Added the AREA and HR elements to check for improper usage of aria-owns as well.
			nodes = document.querySelectorAll('input[aria-owns], img[aria-owns], area[aria-owns], hr[aria-owns]');

			for (var i = 0; i < nodes.length; i++){
				nodes[i].setAttribute('data-ws-bm-aria-owns-invalid', 'true');
				nodes[i].parentNode.setAttribute('data-ws-bm-aria-owns-invalid', nodes[i].nodeName.toUpperCase());
			}

			nodes = document.querySelectorAll('input, *[role], img, progress');

			obj = {};

			isSelfRef = function(node, role, ids){
				if (!node || node.nodeType !== 1
					|| !trim(role)
						|| !trim(ids)
							|| ' application banner complementary contentinfo form main navigation region search article directory document list note table toolbar feed log status combobox grid listbox menu menubar radiogroup tablist tabpanel tree group treegrid '.indexOf(
								' ' + role + ' ') === -1)
					return false;

				var isF = false, a = ids.split(' ');

				for (var i = 0; i < a.length; i++){
					if (document.getElementById(a[i]) == node)
						isF = true;
				}

				if (isF)
					node.setAttribute('data-ws-bm-self-ref', 'true');
				return isF;
			};

			isDefTerm = function(ids){
				var isT = true, a = ids.split(' ');

				for (var i = 0; i < a.length; i++){
					var o = document.getElementById(a[i]);

					if (o && o.nodeType === 1 && o.getAttribute('role') != 'term'){
						o.setAttribute('data-ws-bm-dtr-missing', 'true');
						isT = false;
					}
				}
				return isT;
			};

			for (var i = 0; i < nodes.length; i++){
				for (var j = 0; j < attrs.length; j++)
								obj[attrs[j]] = nodes[i].getAttribute(attrs[j]) || null;
				obj['node-name'] = nodes[i].nodeName.toLowerCase();
				obj.tabindex = nodes[i].getAttribute('tabindex');
				obj['input-type'] = obj['node-name'] == 'input' ? nodes[i].getAttribute('type') : null;

				if (obj.role == 'radio')
					obj['role-nested'] = isNested(nodes[i], 'radiogroup');

				else if (obj.role == 'tab')
					obj['role-nested'] = isNested(nodes[i], 'tablist');

				else if (obj.role == 'treeitem')
					obj['role-nested'] = isNested(nodes[i], 'tree');

				isSelfRef(nodes[i], obj.role, obj['aria-labelledby']);

				if (obj.role == 'definition' && obj['aria-labelledby'])
					isDefTerm(obj['aria-labelledby']);

				if (' input img progress '.indexOf(' ' + obj['node-name'] + ' ') !== -1){
					if (pNode != nodes[i].parentNode){
						pNode = nodes[i].parentNode;

						for (var a in obj){
							if (obj[a] || !isNaN(parseInt(obj[a])))
								pNode.setAttribute('data-ws-bm-' + a, obj[a]);

							else
								pNode.removeAttribute('data-ws-bm-' + a);
						}
					}
				}
			}

			focused = document.querySelectorAll('*[aria-describedby]:focus');

			if (focused.length){
				var dbs = focused[0].getAttribute('aria-describedby').split(' ');

				for (var d = 0; d < dbs.length; d++){
					var t = document.getElementById(dbs[d]);

					if (t && t.nodeType === 1)
						t.setAttribute('data-ws-bm-db-match', dbs[d]);
				}
			}

			focused = document.querySelectorAll('*[aria-activedescendant]:focus');
			var fO = null;

			if (focused.length)
				fO = document.getElementById(focused[0].getAttribute('aria-activedescendant'));

			if ((!focused.length || !fO || focused[0] != activeObj || fO != activeDObj)
				&& (activeDObj && activeDObj.nodeType === 1 && activeDObj.getAttribute('data-ws-bm-ad-match'))){
				activeDObj.removeAttribute('data-ws-bm-ad-match');
				activeDObj.removeAttribute('data-ws-bm-ad-invalid');
				activeDObj = null;
			}

			if (fO && fO.nodeType === 1){
				activeObj = focused[0];
				activeDObj = fO;
				var nn = fO.nodeName.toLowerCase(), href = fO.getAttribute('href'), rl = fO.getAttribute('role');

				if (!rl && nn == 'a' && href)
					rl = 'link';

				else if (!rl && nn == 'button')
					rl = 'button';
				fO.setAttribute('data-ws-bm-ad-match', rl);

				if (!rl)
					fO.setAttribute('data-ws-bm-ad-invalid', 'true');
			}

			focusHidden = document.querySelectorAll('*[hidefocus="true"]');

			for (var h = 0; h < focusHidden.length; h++)
							focusHidden[h].removeAttribute('hidefocus');

			frames = document.querySelectorAll('frame, iframe');

			for (var f = 0; f < frames.length; f++){
				try{
					if (frames[f].contentDocument && frames[f].contentDocument.head && !frames[f].contentDocument.WSBMInit){
						frames[f].contentDocument.WSBMInit = WSBMInit;
						frames[f].contentDocument.WSBMInit(false, useOffline, basePath, msInterval, frames[f].contentDocument);
					}
				}
				catch (e){}
			}

			var presentational = document.querySelectorAll('*[role="presentation"], *[role="none"]');

			for (var p = 0; p < presentational.length; p++){
				var pO = presentational[p], oR = pO.getAttribute('role'), oN = pO.nodeName.toUpperCase(),
					aN = oR == 'none' ? 'data-ws-role-none' : 'data-ws-role-presentation';

				if (' input textarea img progress '.indexOf(' ' + oN.toLowerCase() + ' ') !== -1)
					pO.parentNode.setAttribute(aN, oN);

				else
					pO.setAttribute(aN, oN);
			}

			setTimeout(check, msInterval);
		};

		var checkNames = function(){

/*
AccName Prototype 2.13, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
var calcNames=function(y,l,t){var v={name:"",desc:""};if(!y||y.nodeType!==1){return v}var q=y;var C=[];var A=[];var k=function(Q,S,T,O,W,N){var U={name:"",title:""};var M=function(Z,Y){if(!Y||!Z||Y.nodeType!==1||Z.nodeType!==1){return false}var X=function(ab,ac){var ad=e(ab);var aa=ab.nodeName.toLowerCase();return(ad&&ac.roles.indexOf(ad)>=0)||(!ad&&ac.tags.indexOf(aa)>=0)};if(X(Z,G)){if(Z===Y&&!(Z.id&&N[Z.id]&&N[Z.id].node)){return !w(Z)}else{return !((R(Z,N.top)&&Z.nodeName.toLowerCase()!="select")||X(Y,J))}}else{if(X(Z,H)||(Z===q&&!X(Z,J))){return true}else{return false}}};var R=function(Y,X){var Z=[];while(Y){if(Y.id&&N[Y.id]&&N[Y.id].node&&Z.indexOf(Y)===-1){Z.push(Y);Y=N[Y.id].node}else{Y=Y.parentNode}if(Y&&Y===X){return true}else{if((!Y||Y===N.top)||Y===document.body){return false}}}return false};var P={before:"",after:""};if(N.ref){if(b(Q,document.body,true,true)){return U}else{if(n(Q,document.body)){var L=true}}}if(C.indexOf(Q)===-1){P=h(Q,null);if(t){if(P.before.indexOf(" [ARIA] ")!==-1||P.before.indexOf(" aria-")!==-1||P.before.indexOf(" accName: ")!==-1){P.before=""}if(P.after.indexOf(" [ARIA] ")!==-1||P.after.indexOf(" aria-")!==-1||P.after.indexOf(" accDescription: ")!==-1){P.after=""}}}var V=function(ab,aa,Y){var Z={name:"",title:""};if(!ab){return Z}var ac=ab&&ab.nodeType===1&&f(ab)?true:false;var X=aa(ab)||{};if(X.name&&X.name.length){Z.name+=X.name}if(!M(ab,N.top,N)){ab=ab.firstChild;while(ab){Z.name+=V(ab,aa,Y).name;ab=ab.nextSibling}}Z.name+=X.owns||"";if(!a(Z.name)&&a(X.title)){Z.name=u(X.title)}else{Z.title=u(X.title)}if(a(X.desc)){Z.title=u(X.desc)}if(ac||X.isWidget){Z.name=u(Z.name)}return Z};U=V(Q,function(aq){var aj={name:"",title:"",owns:""};var aw=aq&&aq.nodeType===1&&O&&O.length&&O.indexOf(aq)!==-1&&aq===q&&aq!==Q?true:false;if((T||!aq||C.indexOf(aq)!==-1||(!L&&n(aq,N.top)))&&!W&&!aw){return aj}if(C.indexOf(aq)===-1){C.push(aq)}var ag="";var ar="";var aE={before:"",after:""};var ad=Q===aq?aq:aq.parentNode;if(C.indexOf(ad)===-1){C.push(ad);aE=h(ad,Q);if(t){if(aE.before.indexOf(" [ARIA] ")!==-1||aE.before.indexOf(" aria-")!==-1||aE.before.indexOf(" accName: ")!==-1){aE.before=""}if(aE.after.indexOf(" [ARIA] ")!==-1||aE.after.indexOf(" aria-")!==-1||aE.after.indexOf(" accDescription: ")!==-1){aE.after=""}}}if(aq.nodeType===1){var ac=aq.getAttribute("aria-labelledby")||"";var aC=aq.getAttribute("aria-describedby")||"";var au=aq.getAttribute("aria-label")||"";var aa=aq.getAttribute("title")||"";var ax=aq.nodeName.toLowerCase();var al=e(aq);var Y=r.indexOf(ax)!==-1;var av=D.indexOf(al)!==-1;var at=I.indexOf(al)!==-1;var an=p.indexOf(al)!==-1;var ae=av||at||an||al=="combobox";var ao=(ae||B.indexOf(al)!==-1)&&al!="link";aj.isWidget=Y||ao;var X=false;var aH=aq.getAttribute("aria-owns")||"";var Z=(!aw&&((aq!==Q&&(Y||ae))||(aq.id&&N[aq.id]&&N[aq.id].target&&N[aq.id].target===aq)))?true:false;if(!S&&aq===Q){if(ac){var aG=ac.split(/\s+/);var aB=[];for(var aA=0;aA<aG.length;aA++){var ah=document.getElementById(aG[aA]);aB.push(k(ah,true,T,[aq],ah===Q,{ref:N,top:ah}).name)}ag=a(aB.join(" "));if(a(ag)){X=true;T=true}}if(aC){var ay="";aG=aC.split(/\s+/);var aB=[];for(var aA=0;aA<aG.length;aA++){var ah=document.getElementById(aG[aA]);aB.push(k(ah,true,false,[aq],false,{ref:N,top:ah}).name)}ay=a(aB.join(" "));if(a(ay)){aj.desc=ay}}}if(Z){if(!(O&&O.length&&O.indexOf(aq)!==-1)){if(av){ag=K(al,aq,true)}else{if(at||(al=="combobox"&&Y)){ag=K(al,aq,false,true)}else{if(an){ag=K(al,aq,false,false,true)}else{if(Y&&["input","textarea"].indexOf(ax)!==-1&&(!ao||at)){ag=K(al,aq,false,false,false,true)}else{if(Y&&ax==="select"&&(!ao||al=="combobox")){ag=K(al,aq,false,false,true,true)}}}}}ag=a(ag)}if(a(ag)){X=true}}if(!X&&a(au)&&!Z){ag=au;if(a(ag)){X=true;if(aq===Q){T=true}}}if(!X&&aq===Q&&Y){var af=document.querySelectorAll("label");var az=F(aq,"label")||false;var aF=aq.id&&document.querySelectorAll('label[for="'+aq.id+'"]').length?document.querySelector('label[for="'+aq.id+'"]'):false;var ak=0;var ap=0;for(var aA=0;aA<af.length;aA++){if(af[aA]===az){ak=aA}else{if(af[aA]===aF){ap=aA}}}var aD=az&&az.nodeType===1&&aF&&aF.nodeType===1&&ak<ap?true:false;if(az&&aF&&aD){ag=a(k(az,true,T,[aq],false,{ref:N,top:az}).name+" "+k(aF,true,T,[aq],false,{ref:N,top:aF}).name)}else{if(aF&&az){ag=a(k(aF,true,T,[aq],false,{ref:N,top:aF}).name+" "+k(az,true,T,[aq],false,{ref:N,top:az}).name)}else{if(aF){ag=a(k(aF,true,T,[aq],false,{ref:N,top:aF}).name)}else{if(az){ag=a(k(az,true,T,[aq],false,{ref:N,top:az}).name)}}}}if(a(ag)){X=true}}var am=!X&&al&&s.indexOf(al)!==-1&&!w(aq)&&!E(aq)?true:false;var ab=am?"":a(aq.getAttribute("alt"));if(!X&&!am&&(ax=="img"||(ax=="input"&&aq.getAttribute("type")=="image"))&&ab){ag=a(ab);if(a(ag)){X=true}}if(!am&&a(aa)&&!Z){aj.title=a(aa)}if(aH&&!Y&&ax!="img"){var aG=aH.split(/\s+/);var aB=[];for(var aA=0;aA<aG.length;aA++){var ah=document.getElementById(aG[aA]);if(ah&&A.indexOf(aG[aA])===-1){A.push(aG[aA]);var ai={ref:N,top:N.top};ai[aG[aA]]={refNode:Q,node:aq,target:ah};if(!b(ah,document.body,true)){aB.push(k(ah,true,T,[],false,ai).name)}}}ar=aB.join("")}}else{if(aq.nodeType===3){ag=aq.data}}ag=aE.before+ag.replace(/\s+/g," ")+aE.after;if(ag.length&&!o(aq,N.top,N,L)){aj.name=ag}aj.owns=ar;return aj},Q);U.name=P.before+U.name.replace(/\s+/g," ")+P.after;return U};var e=function(O){var P=O&&O.getAttribute?O.getAttribute("role"):"";if(!a(P)){return""}var L=function(Q){return a(P).length>0&&Q.roles.indexOf(P)>=0};var N=P.split(/\s+/);for(var M=0;M<N.length;M++){P=N[M];if(L(J)||L(H)||L(G)||s.indexOf(P)!==-1){return P}}return""};var w=function(L){var M=L.nodeName.toLowerCase();if(L.getAttribute("tabindex")){return true}if(M==="a"&&L.getAttribute("href")){return true}if(["button","input","select"].indexOf(M)!==-1&&L.getAttribute("type")!=="hidden"){return true}return false};var J={roles:["button","checkbox","link","option","radio","switch","tab","treeitem","menuitem","menuitemcheckbox","menuitemradio","cell","gridcell","columnheader","rowheader","tooltip","heading"],tags:["a","button","summary","input","h1","h2","h3","h4","h5","h6","menuitem","option","td","th"]};var H={roles:["application","alert","log","marquee","timer","alertdialog","dialog","banner","complementary","form","main","navigation","region","search","article","document","feed","figure","img","math","toolbar","menu","menubar","grid","listbox","radiogroup","textbox","searchbox","spinbutton","scrollbar","slider","tablist","tabpanel","tree","treegrid","separator"],tags:["article","aside","body","select","datalist","optgroup","dialog","figure","footer","form","header","hr","img","textarea","input","main","math","menu","nav","section"]};var G={roles:["term","definition","directory","list","group","note","status","table","rowgroup","row","contentinfo"],tags:["dl","ul","ol","dd","details","output","table","thead","tbody","tfoot","tr"]};var r=["button","input","select","textarea"];var D=["scrollbar","slider","spinbutton"];var I=["searchbox","textbox"];var p=["grid","listbox","tablist","tree","treegrid"];var B=["button","checkbox","link","switch","option","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","radio","tab","treeitem","gridcell"];var s=["presentation","none"];var E=function(O){var M=["busy","controls","current","describedby","details","disabled","dropeffect","errormessage","flowto","grabbed","haspopup","invalid","keyshortcuts","live","owns","roledescription"];for(var N=0;N<M.length;N++){var L=a(O.getAttribute("aria-"+M[N]));if(L){return true}}return false};var n=function(M,L){var N=function(P){if(P.nodeType!==1||P==L){return false}if(P.getAttribute("aria-hidden")==="true"){return true}if(P.getAttribute("hidden")){return true}var O=m(P);if(O.display==="none"||O.visibility==="hidden"){return true}return false};return N(M)};var b=function(M,L,P,O){var N=[];while(M&&M!==L){if(!O&&M.nodeType===1&&n(M,L)){return true}else{O=false}if(!P&&M.id&&ownedBy&&ownedBy[M.id]&&ownedBy[M.id].node&&N.indexOf(M)===-1){N.push(M);M=ownedBy[M.id].node}else{M=M.parentNode}}return false};var m=function(M){var L={};if(document.defaultView&&document.defaultView.getComputedStyle){L=document.defaultView.getComputedStyle(M,"")}else{if(M.currentStyle){L=M.currentStyle}}return L};var d=function(P,Q){var O=Q;if(O.indexOf("attr(")!==-1){var M=O.match(/attr\((.|\n|\r\n)*?\)/g);for(var N=0;N<M.length;N++){var L=M[N].slice(5,-1);L=P.getAttribute(L)||"";O=O.replace(M[N],L)}}return O||Q};var f=function(O,Q){var M=Q||m(O);for(var P in z){var L=z[P];for(var N=0;N<L.length;N++){if(M[P]&&((L[N].indexOf("!")===0&&[L[N].slice(1),"inherit","initial","unset"].indexOf(M[P])===-1)||M[P].indexOf(L[N])!==-1)){return true}}}if(!Q&&O.nodeName&&g.indexOf(O.nodeName.toLowerCase())!==-1){return true}return false};var z={display:["block","grid","table","flow-root","flex"],position:["absolute","fixed"],"float":["left","right","inline"],clear:["left","right","both","inline"],overflow:["hidden","scroll","auto"],"column-count":["!auto"],"column-width":["!auto"],"column-span":["all"],contain:["layout","content","strict"]};var g=["address","article","aside","blockquote","br","canvas","dd","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","legend","li","main","nav","noscript","ol","output","p","pre","section","table","td","tfoot","th","tr","ul","video"];var K=function(S,N,R,Q,P,L){var M="";var T=false;if(R&&!L){M=N.getAttribute("aria-valuetext")||N.getAttribute("aria-valuenow")||""}else{if(Q&&!L){M=c(N)||""}else{if(P&&!L){var O=[];if(S=="grid"||S=="treegrid"){O=["gridcell","rowheader","columnheader"]}else{if(S=="listbox"){O=["option"]}else{if(S=="tablist"){O=["tab"]}else{if(S=="tree"){O=["treeitem"]}}}}M=i(N,N.querySelectorAll('*[aria-selected="true"]'),false,O);T=true}}}M=a(M);if(!M&&(R||Q)&&N.value){M=N.value}if(!T&&!M&&L){if(P){M=i(N,N.querySelectorAll("option[selected]"),true)}else{M=N.value}}return M};var u=function(L){return a(L).length?" "+L+" ":" "};var i=function(Q,P,M,L){if(!P||!P.length){return""}var R=[];for(var O=0;O<P.length;O++){var S=e(P[O]);var N=!L||L.indexOf(S)!==-1;if(N){R.push(M?c(P[O]):k(P[O],true,false,[],false,{top:P[O]}).name)}}return R.join(" ")};var x=function(M,L){var N={};for(var O in z){N[O]=document.defaultView.getComputedStyle(M,L).getPropertyValue(O)}N.content=document.defaultView.getComputedStyle(M,L).getPropertyValue("content").replace(/^\"|\\|\"$/g,"");return N};var c=function(N,L){if(!L&&N.nodeType===1){return N.innerText||N.textContent||""}var M=x(N,L);var O=M.content;if(!O||O==="none"){return""}if(f({},M)){if(L==":before"){O+=" "}else{if(L==":after"){O=" "+O}}}return O};var h=function(M,L){if(M&&M.nodeType!==1||M==L||["input","select","textarea","img","iframe"].indexOf(M.nodeName.toLowerCase())!==-1){return{before:"",after:""}}if(document.defaultView&&document.defaultView.getComputedStyle){return{before:d(M,c(M,":before")),after:d(M,c(M,":after"))}}else{return{before:"",after:""}}};var F=function(L,M){while(L){L=L.parentNode;if(L&&L.nodeName&&L.nodeName.toLowerCase()==M){return L}}return{}};var o=function(N,M,P,L){var O=[];while(N&&N!==M){if(N.id&&P&&P[N.id]&&P[N.id].node&&O.indexOf(N)===-1){O.push(N);N=P[N.id].node}else{N=N.parentNode}if(N&&N.getAttribute){if(a(N.getAttribute("aria-label"))||(!L&&n(N,M))){return true}}}return false};var a=function(L){if(typeof L!=="string"){return""}return L.replace(/^\s+|\s+$/g,"")};if(b(y,document.body,true)){return v}var j=k(y,false,false,[],false,{top:y});accName=a(j.name.replace(/\s+/g," "));accDesc=a(j.title.replace(/\s+/g," "));if(accName===accDesc){accDesc=""}v.name=accName;v.desc=accDesc;C=[];A=[];if(l&&typeof l=="function"){return l.apply(y,[y,v])}else{return v}};

			var accNames =
				document.querySelectorAll(
					'textarea, input, select, button, a[href], progress, *[role="button"], *[role="checkbox"], *[role="link"], *[role="searchbox"], *[role="scrollbar"], *[role="slider"], *[role="spinbutton"], *[role="switch"], *[role="textbox"], *[role="combobox"], *[role="option"], *[role="menuitem"], *[role="menuitemcheckbox"], *[role="menuitemradio"], *[role="radio"], *[role="tab"], *[role="treeitem"], h1, h2, h3, h4, h5, h6, *[role="heading"], ul[aria-labelledby], ol[aria-labelledby], *[role="list"][aria-labelledby], *[role="directory"][aria-labelledby], ul[aria-label], ol[aria-label], *[role="list"][aria-label], *[role="directory"][aria-label], table[aria-labelledby], *[role="table"][aria-labelledby], *[role="grid"][aria-labelledby], *[role="treegrid"][aria-labelledby], table[aria-label], *[role="table"][aria-label], *[role="grid"][aria-label], *[role="treegrid"][aria-label], *[role="row"][aria-labelledby], *[role="row"][aria-label], *[role="cell"], *[role="gridcell"], th, *[role="columnheader"], *[role="rowheader"], *[role="alertdialog"][aria-labelledby], dialog[aria-labelledby], *[role="dialog"][aria-labelledby], *[role="alertdialog"][aria-label], dialog[aria-label], *[role="dialog"][aria-label], header[aria-labelledby], *[role="banner"][aria-labelledby], aside[aria-labelledby], *[role="complementary"][aria-labelledby], footer[aria-labelledby], *[role="contentinfo"][aria-labelledby], header[aria-label], *[role="banner"][aria-label], aside[aria-label], *[role="complementary"][aria-label], footer[aria-label], *[role="contentinfo"][aria-label], form[aria-labelledby], *[role="form"][aria-labelledby], form[aria-label], *[role="form"][aria-label], main[aria-labelledby], *[role="main"][aria-labelledby], nav[aria-labelledby], *[role="navigation"][aria-labelledby], main[aria-label], *[role="main"][aria-label], nav[aria-label], *[role="navigation"][aria-label], section[aria-labelledby], section[aria-label], *[role="region"][aria-labelledby], *[role="search"][aria-labelledby], *[role="article"][aria-labelledby], *[role="definition"][aria-labelledby], *[role="document"][aria-labelledby], *[role="feed"][aria-labelledby], *[role="figure"][aria-labelledby], *[role="img"][aria-labelledby], *[role="math"][aria-labelledby], *[role="note"][aria-labelledby], *[role="application"][aria-labelledby], *[role="region"][aria-label], *[role="search"][aria-label], *[role="article"][aria-label], *[role="definition"][aria-label], *[role="document"][aria-label], *[role="feed"][aria-label], *[role="figure"][aria-label], *[role="img"][aria-label], *[role="math"][aria-label], *[role="note"][aria-label], *[role="application"][aria-label], *[role="log"][aria-labelledby], *[role="marquee"][aria-labelledby], *[role="status"][aria-labelledby], *[role="timer"][aria-labelledby], *[role="log"][aria-label], *[role="marquee"][aria-label], *[role="status"][aria-label], *[role="timer"][aria-label], *[role="toolbar"][aria-labelledby], *[role="group"][aria-labelledby], *[role="listbox"][aria-labelledby], *[role="menu"][aria-labelledby], *[role="menubar"][aria-labelledby], *[role="toolbar"][aria-label], *[role="group"][aria-label], *[role="listbox"][aria-label], *[role="menu"][aria-label], *[role="menubar"][aria-label], *[role="radiogroup"][aria-labelledby], *[role="tree"][aria-labelledby], *[role="tablist"][aria-labelledby], *[role="tabpanel"][aria-labelledby], *[role="radiogroup"][aria-label], *[role="tree"][aria-label], *[role="tablist"][aria-label], *[role="tabpanel"][aria-label]');

			for (var aN = 0; aN < accNames.length; aN++){
				calcNames(accNames[aN], function(node, props){
					if (' input textarea img progress '.indexOf(' ' + node.nodeName.toLowerCase() + ' ') !== -1){
						node.parentNode.setAttribute('data-ws-bm-name-prop', props.name);

						node.parentNode.setAttribute('data-ws-bm-desc-prop', props.desc);
					}

					else{
						node.setAttribute('data-ws-bm-name-prop', props.name);

						node.setAttribute('data-ws-bm-desc-prop', props.desc);
					}
				}, true);
			}

			setTimeout(checkNames, 5000);
		};

		setTimeout(checkNames, 5000);

		if (!useOffline){
			loaded =
							{
							init: false,
							landmarks: false,
							structural: false,
							dialogs: false,
							liveRegions: false,
							simpleWidgets: false,
							comboboxListbox: false,
							menuMenubar: false,
							radiogroup: false,
							tablist: false,
							tree: false,
							treegridGridTable: false
							};

			var loadCSS = function(file, i){
				var l = document.createElement('link');
				l.type = 'text/css';
				l.rel = 'stylesheet';
				l.href = basePath + file;
				l.id = 'ws-visual-aria-' + i;
				document.head.appendChild(l);
			};
		}

		check();

		bind(document.body, 'mousedown', function(ev){
			if (ev.shiftKey && ev.ctrlKey){
				var targ = null;

				if (!ev)
					ev = window.event;

				if (ev.target)
					targ = ev.target;

				else if (ev.srcElement)
					targ = ev.srcElement;

				if (targ.nodeType == 3)
					targ = targ.parentNode;
				var getClosestRole = function(o){
					while (o){
						var r = o.getAttribute('role');

						if (r && ' rowgroup row columnheader rowheader menuitem menuitemcheckbox menuitemradio group '.indexOf(' ' + r
							+ ' ') === -1){
							if (r == 'option')
								r = 'listbox';

							else if (r == 'radio')
								r = 'radiogroup';

							else if (r == 'tab' || r == 'tabpanel')
								r = 'tablist';

							else if (r == 'treeitem')
								r = 'tree';
							return r;
						}
						o = o.parentNode;
					}
					return null;
				};
				var role = getClosestRole(targ), rmo = top.document.getElementById('ws-bm-aria-matrices-lnk-a');

				if (role && rmo.nodeType === 1)
					rmo.href = 'http://whatsock.com/training/matrices/#' + role;

				if (rmo.nodeType === 1)
					rmo.click();
			}
		});
	};

	setTimeout(function(){
		WSBMInit(true, useOffline, basePath, msInterval, document);
	}, 3000);

	if (!document.getElementById('ws-bm-aria-matrices-lnk')){
		var m = document.createElement('span');
		m.innerHTML
			= '<span id="ws-bm-aria-matrices-lnk" style="position: fixed; top: 0; left: 0;padding: 3px; border: 1px solid #dedede; background: #f5f5f5; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#f9f9f9\', endColorstr=\'#f0f0f0\'); background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0)); background: -moz-linear-gradient(top,  #f9f9f9, #f0f0f0); border-color: #000; -webkit-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; -moz-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb;" onmouseover="document.getElementById(\'ws-bm-aria-matrices-lnk-a\').innerHTML=\'ARIA Role Matrices\';" onmouseleave="document.getElementById(\'ws-bm-aria-matrices-lnk-a\').innerHTML=\'?\';"><a id="ws-bm-aria-matrices-lnk-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" target="ws_aria_role_matrices" onmouseover="this.href=\'http://whatsock.com/training/matrices/\';" onfocus="this.href=\'http://whatsock.com/training/matrices/\'; this.innerHTML=\'ARIA Role Matrices\';" onblur="this.innerHTML=\'?\';" href="http://whatsock.com/training/matrices/" aria-label="ARIA Role Matrices">?</a></span>';
		document.body.appendChild(m);
	}
})();