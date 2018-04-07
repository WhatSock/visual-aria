/*!
Visual ARIA Bookmarklet (CSS: 03/08/2018), JS last modified 04/06/2018
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
AccName Prototype 2.1, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
var calcNames=function(z,l,u){if(!z||z.nodeType!==1){return}var r=z;var F=[];var D=[];var k=function(X,Z,aa,V,ac,U){var T="";var j=function(af,ae){if(!ae||!af||ae.nodeType!==1||af.nodeType!==1){return false}var ad=function(ah,ai){var aj=e(ah);var ag=ah.nodeName.toLowerCase();return(aj&&ai.roles.indexOf(aj)>=0)||(!aj&&ai.tags.indexOf(ag)>=0)};if(ad(af,K)){if(af===ae&&!(af.id&&U[af.id]&&U[af.id].node)){return !x(af)}else{return !((Y(af,U.top)&&af.nodeName.toLowerCase()!="select")||ad(ae,N))}}else{if(ad(af,L)||(af===r&&!ad(af,N))){return true}else{return false}}};var Y=function(ae,ad){var af=[];while(ae){if(ae.id&&U[ae.id]&&U[ae.id].node&&af.indexOf(ae)===-1){af.push(ae);ae=U[ae.id].node}else{ae=ae.parentNode}if(ae&&ae===ad){return true}else{if((!ae||ae===U.top)||ae===document.body){return false}}}return false};var W={before:"",after:""};if(F.indexOf(X)===-1){W=h(X,null);if(u){if(W.before.indexOf(" [ARIA] ")!==-1||W.before.indexOf(" aria-")!==-1||W.before.indexOf(" accName: ")!==-1){W.before=""}if(W.after.indexOf(" [ARIA] ")!==-1||W.after.indexOf(" aria-")!==-1||W.after.indexOf(" accDescription: ")!==-1){W.after=""}}}var ab=function(ag,af,ae){if(!ag){return""}var ah="";var ai=ag&&ag.nodeType===1&&f(ag);if(ai){ah=" "}var ad=af(ag)||{};if(ad.name&&ad.name.length){ah+=ad.name}if(!j(ag,U.top,U)){ag=ag.firstChild;while(ag){ah+=ab(ag,af,ae);ag=ag.nextSibling}}if(!a(ah)&&a(ad.title)){ah=ad.title}if(ai){ah+=" "}ah+=ad.owns||"";return ah};T=ab(X,function(aC){var aq={name:"",title:"",owns:""};var ah=aC&&aC.nodeType===1&&V&&V.length&&V.indexOf(aC)!==-1&&aC===r&&aC!==X?true:false;if((aa||!aC||F.indexOf(aC)!==-1||(n(aC,U.top)))&&!ac&&!ah){return aq}if(F.indexOf(aC)===-1){F.push(aC)}var aK="";var al="";var aG={before:"",after:""};var an=X===aC?aC:aC.parentNode;if(F.indexOf(an)===-1){F.push(an);aG=h(an,X);if(u){if(aG.before.indexOf(" [ARIA] ")!==-1||aG.before.indexOf(" aria-")!==-1||aG.before.indexOf(" accName: ")!==-1){aG.before=""}if(aG.after.indexOf(" [ARIA] ")!==-1||aG.after.indexOf(" aria-")!==-1||aG.after.indexOf(" accDescription: ")!==-1){aG.after=""}}}if(aC.nodeType===1){var ap=aC.getAttribute("aria-labelledby")||"";var ar=aC.getAttribute("aria-label")||"";var aD=aC.getAttribute("title")||"";var aB=aC.nodeName.toLowerCase();var af=e(aC);var ai=t.indexOf(aB)!==-1;var ag=G.indexOf(af)!==-1;var aJ=M.indexOf(af)!==-1;var aI=q.indexOf(af)!==-1;var ak=ag||aJ||aI||af=="combobox";var ax=ak||E.indexOf(af)!==-1;var aF=false;var ao=aC.getAttribute("aria-owns")||"";var aw=(!ah&&((aC!==X&&(ai||ak))||(aC.id&&U[aC.id]&&U[aC.id].target&&U[aC.id].target===aC)))?true:false;if(!Z&&aC===X&&ap){var aA=ap.split(/\s+/);var az=[];for(var aE=0;aE<aA.length;aE++){var ae=document.getElementById(aA[aE]);az.push(k(ae,true,aa,[aC],ae===X,{ref:U,top:ae}))}aK=v(a(az.join(" ")));if(a(aK)){aF=true;aa=true}}if(aw){if(!(V&&V.length&&V.indexOf(aC)!==-1)){if(ag){aK=S(af,aC,true)}else{if(aJ||(af=="combobox"&&ai)){aK=S(af,aC,false,true)}else{if(aI){aK=S(af,aC,false,false,true)}else{if(ai&&["input","textarea"].indexOf(aB)!==-1&&(!ax||aJ)){aK=S(af,aC,false,false,false,true)}else{if(ai&&aB==="select"&&(!ax||af=="combobox")){aK=S(af,aC,false,false,true,true)}}}}}aK=v(a(aK))}if(a(aK)){aF=true}}if(!aF&&a(ar)&&!aw){aK=v(a(ar));if(a(aK)){aF=true;if(aC===X){aa=true}}}if(!aF&&aC===X&&ai){var aH=document.querySelectorAll("label");var au=J(aC,"label")||false;var aj=aC.id&&document.querySelectorAll('label[for="'+aC.id+'"]').length?document.querySelector('label[for="'+aC.id+'"]'):false;var at=0;var ad=0;for(var aE=0;aE<aH.length;aE++){if(aH[aE]===au){at=aE}else{if(aH[aE]===aj){ad=aE}}}var ay=au&&au.nodeType===1&&aj&&aj.nodeType===1&&at<ad?true:false;if(au&&aj&&ay){aK=v(a(k(au,true,aa,[aC],false,{ref:U,top:au})))+v(a(k(aj,true,aa,[aC],false,{ref:U,top:aj})))}else{if(aj&&au){aK=v(a(k(aj,true,aa,[aC],false,{ref:U,top:aj})))+v(a(k(au,true,aa,[aC],false,{ref:U,top:au})))}else{if(aj){aK=v(a(k(aj,true,aa,[aC],false,{ref:U,top:aj})))}else{if(au){aK=v(a(k(au,true,aa,[aC],false,{ref:U,top:au})))}}}}if(a(aK)){aF=true}}if(!aF&&(aB=="img"||(aB=="input"&&aC.getAttribute("type")=="image"))&&a(aC.getAttribute("alt"))){aK=v(a(aC.getAttribute("alt")));if(a(aK)){aF=true}}if(!aF&&(aB=="img"||(aB=="input"&&aC.getAttribute("type")=="image"))&&a(aD)){aK=v(a(aD));if(a(aK)){aF=true}}var av=!aF&&af&&["presentation","none"].indexOf(af)!==-1&&!x(aC)&&!H(aC)?true:false;if(!aF&&!av&&a(aD)&&!aw){aq.title=v(a(aD))}if(ao&&!ai&&aB!="img"){var aA=ao.split(/\s+/);var az=[];for(var aE=0;aE<aA.length;aE++){var ae=document.getElementById(aA[aE]);if(ae&&D.indexOf(aA[aE])===-1){D.push(aA[aE]);var am={ref:U,top:U.top};am[aA[aE]]={refNode:X,node:aC,target:ae};az.push(a(k(ae,true,aa,[],false,am)))}}al=v(az.join(" "))}}else{if(aC.nodeType===3){aK=aC.data}}aK=aG.before+aK.replace(/\s+/g," ")+aG.after;if(aK.length&&!c(aC,false,U.top,U)){aq.name=aK}aq.owns=al;return aq},X);T=W.before+T.replace(/\s+/g," ")+W.after;return T};var e=function(V){var W=V&&V.getAttribute?V.getAttribute("role"):"";if(!a(W)){return""}var j=function(X){return a(W).length>0&&X.roles.indexOf(W)>=0};var U=W.split(/\s+/);for(var T=0;T<U.length;T++){W=U[T];if(j(N)||j(L)||j(K)){return W}}return""};var x=function(j){var T=j.nodeName.toLowerCase();if(j.getAttribute("tabindex")){return true}if(T==="a"&&j.getAttribute("href")){return true}if(["button","input","select"].indexOf(T)!==-1&&j.getAttribute("type")!=="hidden"){return true}return false};var N={roles:["button","checkbox","link","option","radio","switch","tab","treeitem","menuitem","menuitemcheckbox","menuitemradio","cell","gridcell","columnheader","rowheader","tooltip","heading"],tags:["a","button","summary","input","h1","h2","h3","h4","h5","h6","menuitem","option","td","th"]};var L={roles:["application","alert","log","marquee","timer","alertdialog","dialog","banner","complementary","form","main","navigation","region","search","article","document","feed","figure","img","math","toolbar","menu","menubar","grid","listbox","radiogroup","textbox","searchbox","spinbutton","scrollbar","slider","tablist","tabpanel","tree","treegrid","separator"],tags:["article","aside","body","select","datalist","optgroup","dialog","figure","footer","form","header","hr","img","textarea","input","main","math","menu","nav","section"]};var K={roles:["term","definition","directory","list","group","note","status","table","rowgroup","row","contentinfo"],tags:["dl","ul","ol","dd","details","output","table","thead","tbody","tfoot","tr"]};var t=["input","select","textarea"];var G=["scrollbar","slider","spinbutton"];var M=["searchbox","textbox"];var q=["grid","listbox","tablist","tree","treegrid"];var E=["button","checkbox","link","switch","option","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","radio","tab","treeitem","gridcell"];var H=function(V){var T=["busy","controls","current","describedby","details","disabled","dropeffect","errormessage","flowto","grabbed","haspopup","invalid","keyshortcuts","live","owns","roledescription"];for(var U=0;U<T.length;U++){var j=a(V.getAttribute("aria-"+T[U]));if(j){return true}}return false};var n=function(U,j){if(U.nodeType!==1||U==j){return false}if(U.getAttribute("aria-hidden")==="true"){return true}if(U.getAttribute("hidden")){return true}var T=m(U);if(T.display==="none"||T.visibility==="hidden"){return true}return false};var m=function(T){var j={};if(document.defaultView&&document.defaultView.getComputedStyle){j=document.defaultView.getComputedStyle(T,"")}else{if(T.currentStyle){j=T.currentStyle}}return j};var d=function(W,X){var V=X;if(V.indexOf("attr(")!==-1){var T=V.match(/attr\((.|\n|\r\n)*?\)/g);for(var U=0;U<T.length;U++){var j=T[U].slice(5,-1);j=W.getAttribute(j)||"";V=V.replace(T[U],j)}}return V||X};var f=function(V,X){var T=X||m(V);for(var W in B){var j=B[W];for(var U=0;U<j.length;U++){if(T[W]&&((j[U].indexOf("!")===0&&[j[U].slice(1),"inherit","initial","unset"].indexOf(T[W])===-1)||T[W].indexOf(j[U])!==-1)){return true}}}if(!X&&V.nodeName&&g.indexOf(V.nodeName.toLowerCase())!==-1){return true}return false};var B={display:["block","grid","table","flow-root","flex"],position:["absolute","fixed"],"float":["left","right","inline"],clear:["left","right","both","inline"],overflow:["hidden","scroll","auto"],"column-count":["!auto"],"column-width":["!auto"],"column-span":["all"],contain:["layout","content","strict"]};var g=["address","article","aside","blockquote","br","canvas","dd","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","legend","li","main","nav","noscript","ol","output","p","pre","section","table","td","tfoot","th","tr","ul","video"];var S=function(Z,U,Y,X,W,j){var T="";var aa=false;if(Y&&!j){T=U.getAttribute("aria-valuetext")||U.getAttribute("aria-valuenow")||""}else{if(X&&!j){T=b(U)||""}else{if(W&&!j){var V=[];if(Z=="grid"||Z=="treegrid"){V=["gridcell","rowheader","columnheader"]}else{if(Z=="listbox"){V=["option"]}else{if(Z=="tablist"){V=["tab"]}else{if(Z=="tree"){V=["treeitem"]}}}}T=i(U,U.querySelectorAll('*[aria-selected="true"]'),false,V);aa=true}}}T=a(T);if(!T&&(Y||X)&&U.value){T=U.value}if(!aa&&!T&&j){if(W){T=i(U,U.querySelectorAll("option[selected]"),true)}else{T=U.value}}return T};var v=function(j){return j.length?" "+j+" ":""};var i=function(X,W,T,j){if(!W||!W.length){return""}var Y=[];for(var V=0;V<W.length;V++){var Z=e(W[V]);var U=!j||j.indexOf(Z)!==-1;if(U){Y.push(T?b(W[V]):k(W[V],true,false,[],false,{top:W[V]}))}}return Y.join(" ")};var y=function(T,j){var U={};for(var V in B){U[V]=document.defaultView.getComputedStyle(T,j).getPropertyValue(V)}U.content=document.defaultView.getComputedStyle(T,j).getPropertyValue("content").replace(/^\"|\\|\"$/g,"");return U};var b=function(U,j){if(!j&&U.nodeType===1){return U.innerText||U.textContent||""}var T=y(U,j);var V=T.content;if(!V||V==="none"){return""}if(f({},T)){if(j==":before"){V+=" "}else{if(j==":after"){V=" "+V}}}return V};var h=function(T,j){if(T&&T.nodeType!==1||T==j||["input","select","textarea","img","iframe"].indexOf(T.nodeName.toLowerCase())!==-1){return{before:"",after:""}}if(document.defaultView&&document.defaultView.getComputedStyle){return{before:d(T,b(T,":before")),after:d(T,b(T,":after"))}}else{return{before:"",after:""}}};var J=function(j,T){while(j){j=j.parentNode;if(j&&j.nodeName&&j.nodeName.toLowerCase()==T){return j}}return{}};var c=function(U,j,T,W){var V=[];while(U&&U!==T){if(U.id&&W&&W[U.id]&&W[U.id].node&&V.indexOf(U)===-1){V.push(U);U=W[U.id].node}else{U=U.parentNode}if(U&&U.getAttribute){if(!j&&U.getAttribute("aria-label")){return true}if(n(U,T)){return true}}}return false};var a=function(j){if(typeof j!=="string"){return""}return j.replace(/^\s+|\s+$/g,"")};if(n(z,document.body)||c(z,true,document.body)){return}var s=k(z,false,false,[],false,{top:z});var P="";var A=a(z.getAttribute("title"));if(A){if(!a(s)){s=A}else{if(s.indexOf(A)===-1){P=A}}}var C=z.getAttribute("aria-describedby")||"";if(C){var R=C.split(/\s+/);var Q=[];for(var O=0;O<R.length;O++){var o=document.getElementById(R[O]);var p=k(o,true,false,[],false,{top:o});if(s.indexOf(p)===-1){Q.push(p)}}var I=a(Q.join(" "));if(I){P=I}}s=a(s.replace(/\s+/g," "));P=a(P.replace(/\s+/g," "));if(s===P){P=""}var w={name:s,desc:P};F=[];D=[];if(l&&typeof l=="function"){return l.apply(z,[z,w])}else{return w}};

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