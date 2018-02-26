/*!
Visual ARIA Bookmarklet (CSS: 01/22/2018), JS last modified 02/26/2018
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
CalcNames 1.11, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
var calcNames=function(v,z,h){if(!v||v.nodeType!==1){return}var f=v;var t=[];var o=[];var C=function(O,R,S,M,U,K){var J="";var j=function(Y,X){if(!X||!Y||X.nodeType!==1||Y.nodeType!==1){return false}var W={roles:["link","button","checkbox","option","radio","switch","tab","treeitem","menuitem","menuitemcheckbox","menuitemradio","cell","columnheader","rowheader","tooltip","heading"],tags:["a","button","summary","input","h1","h2","h3","h4","h5","h6","menuitem","option","td","th"]};var aa={roles:["combobox","application","alert","log","marquee","timer","alertdialog","dialog","banner","complementary","form","main","navigation","region","search","article","document","feed","figure","img","math","toolbar","menu","menubar","grid","listbox","radiogroup","textbox","searchbox","spinbutton","scrollbar","slider","tablist","tabpanel","tree","treegrid","separator"],tags:["article","aside","body","select","datalist","optgroup","dialog","figure","footer","form","header","hr","img","textarea","input","main","math","menu","nav","section"]};var Z={roles:["combobox","term","definition","directory","list","group","note","status","table","rowgroup","row","contentinfo"],tags:["dl","ul","ol","dd","details","output","table","thead","tbody","tfoot","tr"]};var V=function(ac,ad){var ae=ac.getAttribute("role");var ab=ac.nodeName.toLowerCase();return(ad.roles.indexOf(ae)>=0||(!ae&&aa.tags.indexOf(ab)>=0))};if(V(Y,Z)){if(Y===X&&!(Y.id&&K[Y.id]&&K[Y.id].node)){return !r(Y)}else{return !(Q(Y,K.top)||V(X,W))}}else{if(V(Y,aa)||Y===f){return true}else{return false}}};var Q=function(W,V){var X=[];while(W){if(W.id&&K[W.id]&&K[W.id].node&&X.indexOf(W)===-1){X.push(W);W=K[W.id].node}else{W=W.parentNode}if(W&&W===V){return true}else{if((!W||W===K.top)||W===document.body){return false}}}return false};var N={before:"",after:""};if(t.indexOf(O)===-1){N=n(O,null);if(h){if(N.before.indexOf(" [ARIA] ")!==-1||N.before.indexOf(" aria-")!==-1||N.before.indexOf(" accName: ")!==-1){N.before=""}if(N.after.indexOf(" [ARIA] ")!==-1||N.after.indexOf(" aria-")!==-1||N.after.indexOf(" accDescription: ")!==-1){N.after=""}}}var L=[];var P=function(W){var X=L.length;for(var V=X;V;V--){if(!Q(W,L[V-1])){L.splice(V-1,1)}}if(L.length<X){return true}return false};var T=function(Y,X,W){if(!Y){return""}var V=X(Y)||"";if(!j(Y,K.top)){Y=Y.firstChild;while(Y){T(Y,X,W);Y=Y.nextSibling}}J+=V};T(O,function(al){var X=al&&al.nodeType===1&&M&&M.length&&M.indexOf(al)!==-1&&al===f&&al!==O;if((S||!al||t.indexOf(al)!==-1||(l(al,K.top)))&&!U&&!X){return}if(t.indexOf(al)===-1){t.push(al)}var aq="";var aa="";var ap={before:"",after:""};var ad=O===al?al:al.parentNode;if(t.indexOf(ad)===-1){t.push(ad);ap=n(ad,O);if(h){if(ap.before.indexOf(" [ARIA] ")!==-1||ap.before.indexOf(" aria-")!==-1||ap.before.indexOf(" accName: ")!==-1){ap.before=""}if(ap.after.indexOf(" [ARIA] ")!==-1||ap.after.indexOf(" aria-")!==-1||ap.after.indexOf(" accDescription: ")!==-1){ap.after=""}}}if(al.nodeType===1){var ah=q(al);if(ah&&L.indexOf(al)===-1){L.push(al)}var ae=al.getAttribute("aria-labelledby")||"";var ag=al.getAttribute("aria-label")||"";var an=al.getAttribute("title")||"";var ak=al.nodeName.toLowerCase();var W=al.getAttribute("role");var ai=["presentation","none"].indexOf(W)!==-1;var Y=["input","select","textarea"].indexOf(ak)!==-1;var Z=["searchbox","scrollbar","slider","spinbutton","textbox","combobox","grid","listbox","tablist","tree","treegrid"].indexOf(W)!==-1;var af=al.getAttribute("aria-owns")||"";if(!R&&al===O&&ae){if(!ai){var am=ae.split(/\s+/);var aj=[];for(var ao=0;ao<am.length;ao++){var V=document.getElementById(am[ao]);aj.push(C(V,true,S,[al],V===O,{ref:K,top:V}))}aq=c(y(aj.join(" ")))}if(y(aq)||ai){S=true}}if((!ai&&al!==O&&(Y||Z))||(al.id&&K[al.id]&&K[al.id].target&&K[al.id].target===al)){if(!(M&&M.length&&M.indexOf(al)!==-1)){if(Z&&["scrollbar","slider","spinbutton"].indexOf(W)!==-1){aq=w(W,al,true)}else{if(Z&&["searchbox","textbox"].indexOf(W)!==-1){aq=w(W,al,false,true)}else{if(Z&&["grid","listbox","tablist","tree","treegrid"].indexOf(W)!==-1){aq=w(W,al,false,false,true)}else{if(Y&&["input","textarea"].indexOf(ak)!==-1){aq=w(W,al,false,false,false,true)}else{if(Y&&ak==="select"){aq=w(W,al,false,false,true,true)}}}}}aq=c(y(aq))}}else{if(!y(aq)&&!ai&&ag){aq=c(y(ag));if(y(aq)&&al===O){S=true}}}if(!y(aq)&&!ai&&al===O&&Y&&al.id&&document.querySelectorAll('label[for="'+al.id+'"]').length){var ac=document.querySelector('label[for="'+al.id+'"]');aq=c(y(C(ac,true,S,[al],false,{ref:K,top:ac})))}if(!y(aq)&&!ai&&al===O&&Y&&m(al,"label").nodeType===1){var ac=m(al,"label");aq=c(y(C(ac,true,S,[al],false,{ref:K,top:ac})))}else{if(!y(aq)&&!ai&&(ak=="img"||(ak=="input"&&al.getAttribute("type")=="image"))&&al.getAttribute("alt")){aq=c(y(al.getAttribute("alt")))}}if(!y(aq)&&!ai&&an){aq=c(y(an))}if(!y(aq)&&!ai&&al===O&&Y&&al.value){aq=c(y(al.value))}else{if(!y(aq)&&!ai&&al===O&&Z&&["scrollbar","slider","spinbutton"].indexOf(W)!==-1){aq=w(W,al,true)}}if(ah&&al!==O){aq=" "+aq}if(af&&!Y&&ak!="img"){var am=af.split(/\s+/);var aj=[];for(var ao=0;ao<am.length;ao++){var V=document.getElementById(am[ao]);if(V&&o.indexOf(am[ao])===-1){o.push(am[ao]);var ab={ref:K,top:K.top};ab[am[ao]]={refNode:O,node:al,target:V};aj.push(y(C(V,true,S,[],false,ab)))}}aa=c(aj.join(" "))}}else{if(al.nodeType===3){aq=(P(al)?" ":"")+al.data}}aq=ap.before+aq.replace(/\s+/g," ")+ap.after;if(y(aq)&&!G(al,false,K.top,K)){J+=aq}return aa},O);J=N.before+J.replace(/\s+/g," ")+N.after;return J};var r=function(j){var J=j.nodeName.toLowerCase();if(j.getAttribute("tabindex")){return true}if(J==="a"&&j.getAttribute("href")){return true}if(["input","select","button"].indexOf(J)!==-1&&j.getAttribute("type")!=="hidden"){return true}return false};var l=function(K,j){if(K.nodeType!==1||K==j){return false}if(K.getAttribute("aria-hidden")==="true"){return true}if(K.getAttribute("hidden")){return true}var J=g(K);if(J.display==="none"||J.visibility==="hidden"){return true}return false};var g=function(J){var j={};if(document.defaultView&&document.defaultView.getComputedStyle){j=document.defaultView.getComputedStyle(J,"")}else{if(J.currentStyle){j=J.currentStyle}}return j};var D=function(M,N){var L=N;if(L.indexOf("attr(")!==-1){var J=L.match(/attr\((.|\n|\r\n)*?\)/g);for(var K=0;K<J.length;K++){var j=J[K].slice(5,-1);j=M.getAttribute(j)||"";L=L.replace(J[K],j)}}return L||N};var q=function(L,N){var J=N||g(L);for(var M in B){var j=B[M];for(var K=0;K<j.length;K++){if(J[M]&&((j[K].indexOf("!")===0&&[j[K].slice(1),"inherit","initial","unset"].indexOf(J[M])===-1)||J[M].indexOf(j[K])!==-1)){return true}}}if(!N&&L.nodeName&&k.indexOf(L.nodeName.toLowerCase())!==-1){return true}return false};var B={display:["block","grid","table","flow-root","flex"],position:["absolute","fixed"],"float":["left","right","inline"],clear:["left","right","both","inline"],overflow:["hidden","scroll","auto"],"column-count":["!auto"],"column-width":["!auto"],"column-span":["all"],contain:["layout","content","strict"]};var k=["address","article","aside","blockquote","br","canvas","dd","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","li","main","nav","noscript","ol","output","p","pre","section","table","tfoot","ul","video"];var w=function(P,K,O,N,M,j){var J="";var Q=false;if(O&&!j){J=K.getAttribute("aria-valuetext")||K.getAttribute("aria-valuenow")||""}else{if(N&&!j){J=b(K)||""}else{if(M&&!j){var L=[];if(P=="grid"||P=="treegrid"){L=["gridcell","rowheader","columnheader"]}else{if(P=="listbox"){L=["option"]}else{if(P=="tablist"){L=["tab"]}else{if(P=="tree"){L=["treeitem"]}}}}J=H(K,K.querySelectorAll('*[aria-selected="true"]'),false,L);Q=true}}}J=y(J);if(!J&&(O||N)&&K.value){J=K.value}if(!Q&&!J&&j){if(M){J=H(K,K.querySelectorAll("option[selected]"),true)}else{J=K.value}}return J};var c=function(j){return j.length?" "+j+" ":""};var H=function(N,M,J,j){if(!M||!M.length){return""}var O=[];for(var L=0;L<M.length;L++){var P=M[L].getAttribute("role");var K=!j||j.indexOf(P)!==-1;if(K){O.push(J?b(M[L]):C(M[L],true,false,[],false,{top:M[L]}))}}return O.join(" ")};var a=function(J,j){var K={};for(var L in B){K[L]=document.defaultView.getComputedStyle(J,j).getPropertyValue(L)}K.content=document.defaultView.getComputedStyle(J,j).getPropertyValue("content").replace(/^\"|\\|\"$/g,"");return K};var b=function(K,j){if(!j&&K.nodeType===1){return K.innerText||K.textContent||""}var J=a(K,j);var L=J.content;if(!L||L==="none"){return""}if(q({},J)){if(j==":before"){L+=" "}else{if(j==":after"){L=" "+L}}}return L};var n=function(J,j){if(J&&J.nodeType!==1||J==j||["input","select","textarea","img","iframe"].indexOf(J.nodeName.toLowerCase())!==-1){return{before:"",after:""}}if(document.defaultView&&document.defaultView.getComputedStyle){return{before:D(J,b(J,":before")),after:D(J,b(J,":after"))}}else{return{before:"",after:""}}};var m=function(j,J){while(j){j=j.parentNode;if(j&&j.nodeName&&j.nodeName.toLowerCase()==J){return j}}return{}};var G=function(K,j,J,M){var L=[];while(K&&K!==J){if(K.id&&M&&M[K.id]&&M[K.id].node&&L.indexOf(K)===-1){L.push(K);K=M[K.id].node}else{K=K.parentNode}if(K&&K.getAttribute){if(["presentation","none"].indexOf(K.getAttribute("role"))===-1){if(!j&&K.getAttribute("aria-label")){return true}if(l(K,J)){return true}}}}return false};var y=function(j){if(typeof j!=="string"){return""}return j.replace(/^\s+|\s+$/g,"")};if(l(v,document.body)||G(v,true,document.body)){return}var e=C(v,false,false,[],false,{top:v});var F="";if(["presentation","none"].indexOf(v.getAttribute("role"))===-1){var I=y(v.getAttribute("title"));if(I){if(!y(e)){e=I}else{if(e.indexOf(I)===-1){F=I}}}var p=v.getAttribute("aria-describedby")||"";if(p){var u=p.split(/\s+/);var s=[];for(var x=0;x<u.length;x++){var d=document.getElementById(u[x]);var E=C(d,true,false,[],false,{top:d});if(e.indexOf(E)===-1){s.push(E)}}var A=y(s.join(" "));if(A){F=A}}}e=y(e.replace(/\s+/g," "));F=y(F.replace(/\s+/g," "));if(e===F){F=""}var i={name:e,desc:F};t=[];o=[];if(z&&typeof z=="function"){return z.apply(v,[v,i])}else{return i}};

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
			= '<span id="ws-bm-aria-matrices-lnk" style="position: fixed; top: 0; left: 0;padding: 3px; border: 1px solid #dedede; background: #f5f5f5; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#f9f9f9\', endColorstr=\'#f0f0f0\'); background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0)); background: -moz-linear-gradient(top,  #f9f9f9, #f0f0f0); border-color: #000; -webkit-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; -moz-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb;"><a id="ws-bm-aria-matrices-lnk-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" target="ws_aria_role_matrices" onmouseover="this.href=\'http://whatsock.com/training/matrices/\';" onfocus="this.href=\'http://whatsock.com/training/matrices/\';" href="http://whatsock.com/training/matrices/" aria-label="ARIA Role Matrices"></a></span>';
		document.body.appendChild(m);
	}
})();