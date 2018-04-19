/*!
Visual ARIA Bookmarklet (CSS: 03/08/2018), JS last modified 04/19/2018
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
AccName Prototype 2.9, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
var calcNames=function(x,l,s){var u={name:"",desc:""};if(!x||x.nodeType!==1){return u}var p=x;var B=[];var z=[];var k=function(O,Q,R,M,U,L){var S={name:"",title:""};var K=function(X,W){if(!W||!X||W.nodeType!==1||X.nodeType!==1){return false}var V=function(Z,aa){var ab=e(Z);var Y=Z.nodeName.toLowerCase();return(ab&&aa.roles.indexOf(ab)>=0)||(!ab&&aa.tags.indexOf(Y)>=0)};if(V(X,F)){if(X===W&&!(X.id&&L[X.id]&&L[X.id].node)){return !v(X)}else{return !((P(X,L.top)&&X.nodeName.toLowerCase()!="select")||V(W,I))}}else{if(V(X,G)||(X===p&&!V(X,I))){return true}else{return false}}};var P=function(W,V){var X=[];while(W){if(W.id&&L[W.id]&&L[W.id].node&&X.indexOf(W)===-1){X.push(W);W=L[W.id].node}else{W=W.parentNode}if(W&&W===V){return true}else{if((!W||W===L.top)||W===document.body){return false}}}return false};var N={before:"",after:""};if(B.indexOf(O)===-1){N=h(O,null);if(s){if(N.before.indexOf(" [ARIA] ")!==-1||N.before.indexOf(" aria-")!==-1||N.before.indexOf(" accName: ")!==-1){N.before=""}if(N.after.indexOf(" [ARIA] ")!==-1||N.after.indexOf(" aria-")!==-1||N.after.indexOf(" accDescription: ")!==-1){N.after=""}}}var T=function(Z,Y,W){var X={name:"",title:""};if(!Z){return X}var aa=Z&&Z.nodeType===1&&f(Z)?true:false;var V=Y(Z)||{};if(V.name&&V.name.length){X.name+=V.name}if(!K(Z,L.top,L)){Z=Z.firstChild;while(Z){X.name+=T(Z,Y,W).name;Z=Z.nextSibling}}X.name+=V.owns||"";if(aa){X.name=" "+X.name+" "}if(!a(X.name)&&a(V.title)){X.name=V.title}else{X.title=V.title}if(a(V.desc)){X.title=V.desc}return X};S=T(O,function(ao){var ah={name:"",title:"",owns:""};var au=ao&&ao.nodeType===1&&M&&M.length&&M.indexOf(ao)!==-1&&ao===p&&ao!==O?true:false;if((R||!ao||B.indexOf(ao)!==-1||(n(ao,L.top)))&&!U&&!au){return ah}if(B.indexOf(ao)===-1){B.push(ao)}var ae="";var ap="";var aC={before:"",after:""};var ab=O===ao?ao:ao.parentNode;if(B.indexOf(ab)===-1){B.push(ab);aC=h(ab,O);if(s){if(aC.before.indexOf(" [ARIA] ")!==-1||aC.before.indexOf(" aria-")!==-1||aC.before.indexOf(" accName: ")!==-1){aC.before=""}if(aC.after.indexOf(" [ARIA] ")!==-1||aC.after.indexOf(" aria-")!==-1||aC.after.indexOf(" accDescription: ")!==-1){aC.after=""}}}if(ao.nodeType===1){var aa=ao.getAttribute("aria-labelledby")||"";var aA=ao.getAttribute("aria-describedby")||"";var ar=ao.getAttribute("aria-label")||"";var Y=ao.getAttribute("title")||"";var av=ao.nodeName.toLowerCase();var aj=e(ao);var W=q.indexOf(av)!==-1;var at=C.indexOf(aj)!==-1;var aq=H.indexOf(aj)!==-1;var al=o.indexOf(aj)!==-1;var ac=at||aq||al||aj=="combobox";var am=ac||A.indexOf(aj)!==-1;var V=false;var aF=ao.getAttribute("aria-owns")||"";var X=(!au&&((ao!==O&&(W||ac))||(ao.id&&L[ao.id]&&L[ao.id].target&&L[ao.id].target===ao)))?true:false;if(!Q&&ao===O){if(aa){var aE=aa.split(/\s+/);var az=[];for(var ay=0;ay<aE.length;ay++){var af=document.getElementById(aE[ay]);az.push(k(af,true,R,[ao],af===O,{ref:L,top:af}).name)}ae=t(a(az.join(" ")));if(a(ae)){V=true;R=true}}if(aA){var aw="";aE=aA.split(/\s+/);var az=[];for(var ay=0;ay<aE.length;ay++){var af=document.getElementById(aE[ay]);az.push(k(af,true,false,[ao],false,{ref:L,top:af}).name)}aw=t(a(az.join(" ")));if(a(aw)){ah.desc=aw}}}if(X){if(!(M&&M.length&&M.indexOf(ao)!==-1)){if(at){ae=J(aj,ao,true)}else{if(aq||(aj=="combobox"&&W)){ae=J(aj,ao,false,true)}else{if(al){ae=J(aj,ao,false,false,true)}else{if(W&&["input","textarea"].indexOf(av)!==-1&&(!am||aq)){ae=J(aj,ao,false,false,false,true)}else{if(W&&av==="select"&&(!am||aj=="combobox")){ae=J(aj,ao,false,false,true,true)}}}}}ae=t(a(ae))}if(a(ae)){V=true}}if(!V&&a(ar)&&!X){ae=t(a(ar));if(a(ae)){V=true;if(ao===O){R=true}}}if(!V&&ao===O&&W){var ad=document.querySelectorAll("label");var ax=E(ao,"label")||false;var aD=ao.id&&document.querySelectorAll('label[for="'+ao.id+'"]').length?document.querySelector('label[for="'+ao.id+'"]'):false;var ai=0;var an=0;for(var ay=0;ay<ad.length;ay++){if(ad[ay]===ax){ai=ay}else{if(ad[ay]===aD){an=ay}}}var aB=ax&&ax.nodeType===1&&aD&&aD.nodeType===1&&ai<an?true:false;if(ax&&aD&&aB){ae=t(a(k(ax,true,R,[ao],false,{ref:L,top:ax}).name))+t(a(k(aD,true,R,[ao],false,{ref:L,top:aD}).name))}else{if(aD&&ax){ae=t(a(k(aD,true,R,[ao],false,{ref:L,top:aD}).name))+t(a(k(ax,true,R,[ao],false,{ref:L,top:ax}).name))}else{if(aD){ae=t(a(k(aD,true,R,[ao],false,{ref:L,top:aD}).name))}else{if(ax){ae=t(a(k(ax,true,R,[ao],false,{ref:L,top:ax}).name))}}}}if(a(ae)){V=true}}var ak=!V&&aj&&r.indexOf(aj)!==-1&&!v(ao)&&!D(ao)?true:false;var Z=ak?"":a(ao.getAttribute("alt"));if(!V&&!ak&&(av=="img"||(av=="input"&&ao.getAttribute("type")=="image"))&&Z){ae=t(Z);if(a(ae)){V=true}}if(!ak&&a(Y)&&!X){ah.title=t(a(Y))}if(aF&&!W&&av!="img"){var aE=aF.split(/\s+/);var az=[];for(var ay=0;ay<aE.length;ay++){var af=document.getElementById(aE[ay]);if(af&&z.indexOf(aE[ay])===-1){z.push(aE[ay]);var ag={ref:L,top:L.top};ag[aE[ay]]={refNode:O,node:ao,target:af};az.push(k(af,true,R,[],false,ag).name)}}ap=az.join("")}}else{if(ao.nodeType===3){ae=ao.data}}ae=aC.before+ae.replace(/\s+/g," ")+aC.after;if(ae.length&&!c(ao,false,L.top,L)){ah.name=ae}ah.owns=ap;return ah},O);S.name=N.before+S.name.replace(/\s+/g," ")+N.after;return S};var e=function(N){var O=N&&N.getAttribute?N.getAttribute("role"):"";if(!a(O)){return""}var K=function(P){return a(O).length>0&&P.roles.indexOf(O)>=0};var M=O.split(/\s+/);for(var L=0;L<M.length;L++){O=M[L];if(K(I)||K(G)||K(F)||r.indexOf(O)!==-1){return O}}return""};var v=function(K){var L=K.nodeName.toLowerCase();if(K.getAttribute("tabindex")){return true}if(L==="a"&&K.getAttribute("href")){return true}if(["button","input","select"].indexOf(L)!==-1&&K.getAttribute("type")!=="hidden"){return true}return false};var I={roles:["button","checkbox","link","option","radio","switch","tab","treeitem","menuitem","menuitemcheckbox","menuitemradio","cell","gridcell","columnheader","rowheader","tooltip","heading"],tags:["a","button","summary","input","h1","h2","h3","h4","h5","h6","menuitem","option","td","th"]};var G={roles:["application","alert","log","marquee","timer","alertdialog","dialog","banner","complementary","form","main","navigation","region","search","article","document","feed","figure","img","math","toolbar","menu","menubar","grid","listbox","radiogroup","textbox","searchbox","spinbutton","scrollbar","slider","tablist","tabpanel","tree","treegrid","separator"],tags:["article","aside","body","select","datalist","optgroup","dialog","figure","footer","form","header","hr","img","textarea","input","main","math","menu","nav","section"]};var F={roles:["term","definition","directory","list","group","note","status","table","rowgroup","row","contentinfo"],tags:["dl","ul","ol","dd","details","output","table","thead","tbody","tfoot","tr"]};var q=["input","select","textarea"];var C=["scrollbar","slider","spinbutton"];var H=["searchbox","textbox"];var o=["grid","listbox","tablist","tree","treegrid"];var A=["button","checkbox","link","switch","option","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","radio","tab","treeitem","gridcell"];var r=["presentation","none"];var D=function(N){var L=["busy","controls","current","describedby","details","disabled","dropeffect","errormessage","flowto","grabbed","haspopup","invalid","keyshortcuts","live","owns","roledescription"];for(var M=0;M<L.length;M++){var K=a(N.getAttribute("aria-"+L[M]));if(K){return true}}return false};var n=function(M,K){if(M.nodeType!==1||M==K){return false}if(M.getAttribute("aria-hidden")==="true"){return true}if(M.getAttribute("hidden")){return true}var L=m(M);if(L.display==="none"||L.visibility==="hidden"){return true}return false};var m=function(L){var K={};if(document.defaultView&&document.defaultView.getComputedStyle){K=document.defaultView.getComputedStyle(L,"")}else{if(L.currentStyle){K=L.currentStyle}}return K};var d=function(O,P){var N=P;if(N.indexOf("attr(")!==-1){var L=N.match(/attr\((.|\n|\r\n)*?\)/g);for(var M=0;M<L.length;M++){var K=L[M].slice(5,-1);K=O.getAttribute(K)||"";N=N.replace(L[M],K)}}return N||P};var f=function(N,P){var L=P||m(N);for(var O in y){var K=y[O];for(var M=0;M<K.length;M++){if(L[O]&&((K[M].indexOf("!")===0&&[K[M].slice(1),"inherit","initial","unset"].indexOf(L[O])===-1)||L[O].indexOf(K[M])!==-1)){return true}}}if(!P&&N.nodeName&&g.indexOf(N.nodeName.toLowerCase())!==-1){return true}return false};var y={display:["block","grid","table","flow-root","flex"],position:["absolute","fixed"],"float":["left","right","inline"],clear:["left","right","both","inline"],overflow:["hidden","scroll","auto"],"column-count":["!auto"],"column-width":["!auto"],"column-span":["all"],contain:["layout","content","strict"]};var g=["address","article","aside","blockquote","br","canvas","dd","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","legend","li","main","nav","noscript","ol","output","p","pre","section","table","td","tfoot","th","tr","ul","video"];var J=function(R,M,Q,P,O,K){var L="";var S=false;if(Q&&!K){L=M.getAttribute("aria-valuetext")||M.getAttribute("aria-valuenow")||""}else{if(P&&!K){L=b(M)||""}else{if(O&&!K){var N=[];if(R=="grid"||R=="treegrid"){N=["gridcell","rowheader","columnheader"]}else{if(R=="listbox"){N=["option"]}else{if(R=="tablist"){N=["tab"]}else{if(R=="tree"){N=["treeitem"]}}}}L=i(M,M.querySelectorAll('*[aria-selected="true"]'),false,N);S=true}}}L=a(L);if(!L&&(Q||P)&&M.value){L=M.value}if(!S&&!L&&K){if(O){L=i(M,M.querySelectorAll("option[selected]"),true)}else{L=M.value}}return L};var t=function(K){return K.length?" "+K+" ":""};var i=function(P,O,L,K){if(!O||!O.length){return""}var Q=[];for(var N=0;N<O.length;N++){var R=e(O[N]);var M=!K||K.indexOf(R)!==-1;if(M){Q.push(L?b(O[N]):k(O[N],true,false,[],false,{top:O[N]}).name)}}return Q.join(" ")};var w=function(L,K){var M={};for(var N in y){M[N]=document.defaultView.getComputedStyle(L,K).getPropertyValue(N)}M.content=document.defaultView.getComputedStyle(L,K).getPropertyValue("content").replace(/^\"|\\|\"$/g,"");return M};var b=function(M,K){if(!K&&M.nodeType===1){return M.innerText||M.textContent||""}var L=w(M,K);var N=L.content;if(!N||N==="none"){return""}if(f({},L)){if(K==":before"){N+=" "}else{if(K==":after"){N=" "+N}}}return N};var h=function(L,K){if(L&&L.nodeType!==1||L==K||["input","select","textarea","img","iframe"].indexOf(L.nodeName.toLowerCase())!==-1){return{before:"",after:""}}if(document.defaultView&&document.defaultView.getComputedStyle){return{before:d(L,b(L,":before")),after:d(L,b(L,":after"))}}else{return{before:"",after:""}}};var E=function(K,L){while(K){K=K.parentNode;if(K&&K.nodeName&&K.nodeName.toLowerCase()==L){return K}}return{}};var c=function(M,K,L,O){var N=[];while(M&&M!==L){if(M.id&&O&&O[M.id]&&O[M.id].node&&N.indexOf(M)===-1){N.push(M);M=O[M.id].node}else{M=M.parentNode}if(M&&M.getAttribute){if(!K&&M.getAttribute("aria-label")){return true}if(n(M,L)){return true}}}return false};var a=function(K){if(typeof K!=="string"){return""}return K.replace(/^\s+|\s+$/g,"")};if(n(x,document.body)||c(x,true,document.body)){return u}var j=k(x,false,false,[],false,{top:x});accName=a(j.name.replace(/\s+/g," "));accDesc=a(j.title.replace(/\s+/g," "));if(accName===accDesc){accDesc=""}u.name=accName;u.desc=accDesc;B=[];z=[];if(l&&typeof l=="function"){return l.apply(x,[x,u])}else{return u}};

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