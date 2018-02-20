/*!
Visual ARIA Bookmarklet (CSS: 01/22/2018), JS last modified 02/19/2018
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
CalcNames 1.4, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
var calcNames=function(w,A,h){if(!w||w.nodeType!==1){return}var u=[];var D=function(I,J,K,j){var N="";var M={before:"",after:""};if(u.indexOf(I)===-1){M=p(I,null);if(h){if(M.before.indexOf(" [ARIA] ")!==-1||M.before.indexOf(" aria-")!==-1||M.before.indexOf(" accName: ")!==-1){M.before=""}if(M.after.indexOf(" [ARIA] ")!==-1||M.after.indexOf(" aria-")!==-1||M.after.indexOf(" accDescription: ")!==-1){M.after=""}}}var O=[];var L=function(Q){var R=O.length;for(var P=R;P;P--){if(!l(Q,O[P-1],I)){O.splice(P-1,1)}}if(O.length<R){return true}return false};e(I,function(ac){if(K||!ac||u.indexOf(ac)!==-1||(n(ac,I))){return}if(u.indexOf(ac)===-1){u.push(ac)}var ah="";var ag={before:"",after:""};var U=I===ac?ac:ac.parentNode;if(u.indexOf(U)===-1){u.push(U);ag=p(U,I);if(h){if(ag.before.indexOf(" [ARIA] ")!==-1||ag.before.indexOf(" aria-")!==-1||ag.before.indexOf(" accName: ")!==-1){ag.before=""}if(ag.after.indexOf(" [ARIA] ")!==-1||ag.after.indexOf(" aria-")!==-1||ag.after.indexOf(" accDescription: ")!==-1){ag.after=""}}}if(ac.nodeType===1){var Y=r(ac);if(Y&&O.indexOf(ac)===-1){O.push(ac)}if(Y&&ac!==I){ah+=" "}var V=ac.getAttribute("aria-labelledby")||"";var X=ac.getAttribute("aria-label")||"";var ae=ac.getAttribute("title")||"";var ab=ac.nodeName.toLowerCase();var Q=ac.getAttribute("role");var Z=["presentation","none"].indexOf(Q)!==-1;var R=["input","select","textarea"].indexOf(ab)!==-1;var S=["searchbox","scrollbar","slider","spinbutton","textbox","combobox","grid","listbox","tablist","tree","treegrid"].indexOf(Q)!==-1;var W=ac.getAttribute("aria-owns")||"";if(!J&&ac===I&&V){if(!Z){var ad=V.split(/\s+/);var aa=[];for(var af=0;af<ad.length;af++){var P=document.getElementById(ad[af]);aa.push(D(P,true,K,[ac]))}ah=c(z(aa.join(" ")))}if(ah||Z){K=true}}if(!Z&&ac!==I&&(R||S)){if(!(j&&j.length&&j.indexOf(ac)!==-1)){if(S&&["scrollbar","slider","spinbutton"].indexOf(Q)!==-1){ah=x(Q,ac,true)}else{if(S&&["searchbox","textbox","combobox"].indexOf(Q)!==-1){ah=x(Q,ac,false,true)}else{if(S&&["grid","listbox","tablist","tree","treegrid"].indexOf(Q)!==-1){ah=x(Q,ac,false,false,true)}else{if(R&&["input","textarea"].indexOf(ab)!==-1){ah=x(Q,ac,false,false,false,true)}else{if(R&&ab==="select"){ah=x(Q,ac,false,false,true,true)}}}}}ah=c(z(ah))}}else{if(!ah&&!Z&&X){ah=c(z(X));if(ah&&ac===I){K=true}}}if(!ah&&!Z&&ac===I&&R&&ac.id&&document.querySelectorAll('label[for="'+ac.id+'"]').length){var T=document.querySelector('label[for="'+ac.id+'"]');ah=c(z(D(T,true,K,[ac])))}if(!ah&&!Z&&ac===I&&R&&o(ac,"label").nodeType===1){ah=c(z(D(o(ac,"label"),true,K,[ac])))}else{if(!ah&&!Z&&ab=="img"&&ac.getAttribute("alt")){ah=c(z(ac.getAttribute("alt")))}}if(!ah&&!Z&&ae){ah=c(z(ae))}if(W&&!R&&ab!="img"){var ad=W.split(/\s+/);var aa=[];for(var af=0;af<ad.length;af++){var P=document.getElementById(ad[af]);if(!l(P,ac)){aa.push(z(D(P,true,K)))}}ah+=c(aa.join(" "))}}else{if(ac.nodeType===3){ah=(L(ac)?" ":"")+ac.data}}ah=ag.before+ah.replace(/\s+/g," ")+ag.after;if(ah&&!F(ac,false,I)){N+=ah}},I);N=M.before+N.replace(/\s+/g," ")+M.after;u=[];return N};var m=function(K,J){if(!J||!K||J.nodeType!==1||K.nodeType!==1){return false}var I={roles:["link","button","checkbox","option","radio","switch","tab","treeitem","menuitem","menuitemcheckbox","menuitemradio","cell","columnheader","rowheader","tooltip","heading"],tags:["a","button","summary","input","h1","h2","h3","h4","h5","h6","menuitem","option","td","th"]};var M={roles:["application","alert","log","marquee","timer","alertdialog","dialog","banner","complementary","form","main","navigation","region","search","article","document","feed","figure","img","math","toolbar","menu","menubar","grid","listbox","radiogroup","textbox","searchbox","spinbutton","scrollbar","slider","tablist","tabpanel","tree","treegrid","separator"],tags:["article","aside","body","select","datalist","optgroup","dialog","figure","footer","form","header","hr","img","textarea","input","main","math","menu","nav","section"]};var L={roles:["combobox","term","definition","directory","list","group","note","status","table","rowgroup","row","contentinfo"],tags:["dl","ul","ol","dd","details","output","table","thead","tbody","tfoot","tr"]};var j=function(O,P){var Q=O.getAttribute("role");var N=O.nodeName.toLowerCase();return(P.roles.indexOf(Q)>=0||(!Q&&M.tags.indexOf(N)>=0))};if(j(K,M)){return true}else{if(j(K,L)){if(K===J){return !s(K)}else{return !j(J,I)}}else{return false}}};var s=function(j){var I=j.nodeName.toLowerCase();if(j.getAttribute("tabindex")){return true}if(I==="a"&&j.getAttribute("href")){return true}if(["input","select","button"].indexOf(I)!==-1&&j.getAttribute("type")!=="hidden"){return true}return false};var n=function(J,j){if(J.nodeType!==1||J==j){return false}if(J.getAttribute("aria-hidden")==="true"){return true}var I=g(J);if(I.display==="none"||I.visibility==="hidden"){return true}return false};var e=function(J,I,j){if(!J){return}I(J);if(!m(J,j)){J=J.firstChild;while(J){e(J,I,j);J=J.nextSibling}}};var g=function(I){var j={};if(document.defaultView&&document.defaultView.getComputedStyle){j=document.defaultView.getComputedStyle(I,"")}else{if(I.currentStyle){j=I.currentStyle}}return j};var r=function(K,M){var I=M||g(K);for(var L in C){var j=C[L];for(var J=0;J<j.length;J++){if(I[L]&&((j[J].indexOf("!")===0&&[j[J].slice(1),"inherit","initial","unset"].indexOf(I[L])===-1)||I[L].indexOf(j[J])!==-1)){return true}}}if(!M&&K.nodeName&&k.indexOf(K.nodeName.toLowerCase())!==-1){return true}return false};var C={display:["block","grid","table","flow-root","flex"],position:["absolute","fixed"],"float":["left","right","inline"],clear:["left","right","both","inline"],overflow:["hidden","scroll","auto"],"column-count":["!auto"],"column-width":["!auto"],"column-span":["all"],contain:["layout","content","strict"]};var k=["address","article","aside","blockquote","br","canvas","dd","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","li","main","nav","noscript","ol","output","p","pre","section","table","tfoot","ul","video"];var x=function(O,J,N,M,L,j){var I="";var P=false;if(N&&!j){I=J.getAttribute("aria-valuetext")||J.getAttribute("aria-valuenow")||""}else{if(M&&!j){I=b(J)||""}else{if(L&&!j){var K=[];if(O=="grid"||O=="treegrid"){K=["gridcell","rowheader","columnheader"]}else{if(O=="listbox"){K=["option"]}else{if(O=="tablist"){K=["tab"]}else{if(O=="tree"){K=["treeitem"]}}}}I=G(J,J.querySelectorAll('*[aria-selected="true"]'),false,K);P=true}}}I=z(I);if(!I&&(N||M)&&J.value){I=J.value}if(!P&&!I&&j){I=(L&&J.multiple)?G(J,J.querySelectorAll("option[selected]"),true):J.value}return I};var c=function(j){return j.length?" "+j+" ":""};var G=function(M,L,I,j){if(!L||!L.length){return""}var N=[];for(var K=0;K<L.length;K++){var O=L[K].getAttribute("role");var J=!j||j.indexOf(O)!==-1;if(J){N.push(I?b(L[K]):D(L[K],true))}}return N.join(" ")};var a=function(I,j){var J={};for(var K in C){J[K]=document.defaultView.getComputedStyle(I,j).getPropertyValue(K)}J.content=document.defaultView.getComputedStyle(I,j).getPropertyValue("content").replace(/^\"|\\|\"$/g,"");return J};var b=function(J,j){if(!j&&J.nodeType===1){return J.innerText||J.textContent||""}var I=a(J,j);var K=I.content;if(!K||K==="none"){return""}if(r({},I)){if(j==":before"){K+=" "}else{if(j==":after"){K=" "+K}}}return K};var p=function(I,j){if(I.nodeType!==1||I==j||["input","select","textarea","img","iframe"].indexOf(I.nodeName.toLowerCase())!==-1){return{before:"",after:""}}if(document.defaultView&&document.defaultView.getComputedStyle){return{before:b(I,":before"),after:b(I,":after")}}else{return{before:"",after:""}}};var l=function(J,I,j){while(J){J=J.parentNode;if(J==I){return true}else{if(J==j){return false}}}return false};var o=function(j,I){while(j){j=j.parentNode;if(j.nodeName.toLowerCase()==I){return j}}return{}};var F=function(J,j,I){while(J&&J!==I){J=J.parentNode;if(J.getAttribute){if(["presentation","none"].indexOf(J.getAttribute("role"))===-1){if(!j&&J.getAttribute("aria-label")){return true}if(n(J,I)){return true}}}}return false};var z=function(j){if(typeof j!=="string"){return""}return j.replace(/^\s+|\s+$/g,"")};if(n(w,document.body)||F(w,true,document.body)){return}var f=D(w,false);var E="";if(["presentation","none"].indexOf(w.getAttribute("role"))===-1){var H=z(w.getAttribute("title"));if(H){if(!f){f=H}else{E=H}}var q=w.getAttribute("aria-describedby")||"";if(q){var v=q.split(/\s+/);var t=[];for(var y=0;y<v.length;y++){var d=document.getElementById(v[y]);t.push(D(d,true))}var B=z(t.join(" "));if(B){E=B}}}f=z(f.replace(/\s+/g," "));E=z(E.replace(/\s+/g," "));if(f===E){E=""}var i={name:f,desc:E};if(A&&typeof A=="function"){return A.apply(w,[w,i])}else{return i}};

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