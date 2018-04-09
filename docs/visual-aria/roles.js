/*!
Visual ARIA Bookmarklet (CSS: 03/08/2018), JS last modified 04/09/2018
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
AccName Prototype 2.2, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
var calcNames=function(A,l,v){if(!A||A.nodeType!==1){return}var r=A;var G=[];var E=[];var k=function(Y,aa,ab,W,ad,V){var U="";var j=function(ag,af){if(!af||!ag||af.nodeType!==1||ag.nodeType!==1){return false}var ae=function(ai,aj){var ak=e(ai);var ah=ai.nodeName.toLowerCase();return(ak&&aj.roles.indexOf(ak)>=0)||(!ak&&aj.tags.indexOf(ah)>=0)};if(ae(ag,L)){if(ag===af&&!(ag.id&&V[ag.id]&&V[ag.id].node)){return !y(ag)}else{return !((Z(ag,V.top)&&ag.nodeName.toLowerCase()!="select")||ae(af,O))}}else{if(ae(ag,M)||(ag===r&&!ae(ag,O))){return true}else{return false}}};var Z=function(af,ae){var ag=[];while(af){if(af.id&&V[af.id]&&V[af.id].node&&ag.indexOf(af)===-1){ag.push(af);af=V[af.id].node}else{af=af.parentNode}if(af&&af===ae){return true}else{if((!af||af===V.top)||af===document.body){return false}}}return false};var X={before:"",after:""};if(G.indexOf(Y)===-1){X=h(Y,null);if(v){if(X.before.indexOf(" [ARIA] ")!==-1||X.before.indexOf(" aria-")!==-1||X.before.indexOf(" accName: ")!==-1){X.before=""}if(X.after.indexOf(" [ARIA] ")!==-1||X.after.indexOf(" aria-")!==-1||X.after.indexOf(" accDescription: ")!==-1){X.after=""}}}var ac=function(ah,ag,af){if(!ah){return""}var ai="";var aj=ah&&ah.nodeType===1&&f(ah);if(aj){ai=" "}var ae=ag(ah)||{};if(ae.name&&ae.name.length){ai+=ae.name}if(!j(ah,V.top,V)){ah=ah.firstChild;while(ah){ai+=ac(ah,ag,af);ah=ah.nextSibling}}if(!a(ai)&&a(ae.title)){ai=ae.title}if(aj){ai+=" "}ai+=ae.owns||"";return ai};U=ac(Y,function(aE){var ar={name:"",title:"",owns:""};var ai=aE&&aE.nodeType===1&&W&&W.length&&W.indexOf(aE)!==-1&&aE===r&&aE!==Y?true:false;if((ab||!aE||G.indexOf(aE)!==-1||(n(aE,V.top)))&&!ad&&!ai){return ar}if(G.indexOf(aE)===-1){G.push(aE)}var aM="";var am="";var aI={before:"",after:""};var ao=Y===aE?aE:aE.parentNode;if(G.indexOf(ao)===-1){G.push(ao);aI=h(ao,Y);if(v){if(aI.before.indexOf(" [ARIA] ")!==-1||aI.before.indexOf(" aria-")!==-1||aI.before.indexOf(" accName: ")!==-1){aI.before=""}if(aI.after.indexOf(" [ARIA] ")!==-1||aI.after.indexOf(" aria-")!==-1||aI.after.indexOf(" accDescription: ")!==-1){aI.after=""}}}if(aE.nodeType===1){var aq=aE.getAttribute("aria-labelledby")||"";var at=aE.getAttribute("aria-label")||"";var aF=aE.getAttribute("title")||"";var aD=aE.nodeName.toLowerCase();var ag=e(aE);var aj=t.indexOf(aD)!==-1;var ah=H.indexOf(ag)!==-1;var aL=N.indexOf(ag)!==-1;var aK=q.indexOf(ag)!==-1;var al=ah||aL||aK||ag=="combobox";var ay=al||F.indexOf(ag)!==-1;var aH=false;var ap=aE.getAttribute("aria-owns")||"";var ax=(!ai&&((aE!==Y&&(aj||al))||(aE.id&&V[aE.id]&&V[aE.id].target&&V[aE.id].target===aE)))?true:false;if(!aa&&aE===Y&&aq){var aC=aq.split(/\s+/);var aB=[];for(var aG=0;aG<aC.length;aG++){var af=document.getElementById(aC[aG]);aB.push(k(af,true,ab,[aE],af===Y,{ref:V,top:af}))}aM=w(a(aB.join(" ")));if(a(aM)){aH=true;ab=true}}if(ax){if(!(W&&W.length&&W.indexOf(aE)!==-1)){if(ah){aM=T(ag,aE,true)}else{if(aL||(ag=="combobox"&&aj)){aM=T(ag,aE,false,true)}else{if(aK){aM=T(ag,aE,false,false,true)}else{if(aj&&["input","textarea"].indexOf(aD)!==-1&&(!ay||aL)){aM=T(ag,aE,false,false,false,true)}else{if(aj&&aD==="select"&&(!ay||ag=="combobox")){aM=T(ag,aE,false,false,true,true)}}}}}aM=w(a(aM))}if(a(aM)){aH=true}}if(!aH&&a(at)&&!ax){aM=w(a(at));if(a(aM)){aH=true;if(aE===Y){ab=true}}}if(!aH&&aE===Y&&aj){var aJ=document.querySelectorAll("label");var av=K(aE,"label")||false;var ak=aE.id&&document.querySelectorAll('label[for="'+aE.id+'"]').length?document.querySelector('label[for="'+aE.id+'"]'):false;var au=0;var ae=0;for(var aG=0;aG<aJ.length;aG++){if(aJ[aG]===av){au=aG}else{if(aJ[aG]===ak){ae=aG}}}var aA=av&&av.nodeType===1&&ak&&ak.nodeType===1&&au<ae?true:false;if(av&&ak&&aA){aM=w(a(k(av,true,ab,[aE],false,{ref:V,top:av})))+w(a(k(ak,true,ab,[aE],false,{ref:V,top:ak})))}else{if(ak&&av){aM=w(a(k(ak,true,ab,[aE],false,{ref:V,top:ak})))+w(a(k(av,true,ab,[aE],false,{ref:V,top:av})))}else{if(ak){aM=w(a(k(ak,true,ab,[aE],false,{ref:V,top:ak})))}else{if(av){aM=w(a(k(av,true,ab,[aE],false,{ref:V,top:av})))}}}}if(a(aM)){aH=true}}var aw=!aH&&ag&&u.indexOf(ag)!==-1&&!y(aE)&&!I(aE)?true:false;var az=aw?"":a(aE.getAttribute("alt"));if(!aH&&!aw&&(aD=="img"||(aD=="input"&&aE.getAttribute("type")=="image"))&&az){aM=w(az);if(a(aM)){aH=true}}if(!aH&&!aw&&a(aF)&&!ax){ar.title=w(a(aF))}if(ap&&!aj&&aD!="img"){var aC=ap.split(/\s+/);var aB=[];for(var aG=0;aG<aC.length;aG++){var af=document.getElementById(aC[aG]);if(af&&E.indexOf(aC[aG])===-1){E.push(aC[aG]);var an={ref:V,top:V.top};an[aC[aG]]={refNode:Y,node:aE,target:af};aB.push(a(k(af,true,ab,[],false,an)))}}am=w(aB.join(" "))}}else{if(aE.nodeType===3){aM=aE.data}}aM=aI.before+aM.replace(/\s+/g," ")+aI.after;if(aM.length&&!c(aE,false,V.top,V)){ar.name=aM}ar.owns=am;return ar},Y);U=X.before+U.replace(/\s+/g," ")+X.after;return U};var e=function(W){var X=W&&W.getAttribute?W.getAttribute("role"):"";if(!a(X)){return""}var j=function(Y){return a(X).length>0&&Y.roles.indexOf(X)>=0};var V=X.split(/\s+/);for(var U=0;U<V.length;U++){X=V[U];if(j(O)||j(M)||j(L)||u.indexOf(X)!==-1){return X}}return""};var y=function(j){var U=j.nodeName.toLowerCase();if(j.getAttribute("tabindex")){return true}if(U==="a"&&j.getAttribute("href")){return true}if(["button","input","select"].indexOf(U)!==-1&&j.getAttribute("type")!=="hidden"){return true}return false};var O={roles:["button","checkbox","link","option","radio","switch","tab","treeitem","menuitem","menuitemcheckbox","menuitemradio","cell","gridcell","columnheader","rowheader","tooltip","heading"],tags:["a","button","summary","input","h1","h2","h3","h4","h5","h6","menuitem","option","td","th"]};var M={roles:["application","alert","log","marquee","timer","alertdialog","dialog","banner","complementary","form","main","navigation","region","search","article","document","feed","figure","img","math","toolbar","menu","menubar","grid","listbox","radiogroup","textbox","searchbox","spinbutton","scrollbar","slider","tablist","tabpanel","tree","treegrid","separator"],tags:["article","aside","body","select","datalist","optgroup","dialog","figure","footer","form","header","hr","img","textarea","input","main","math","menu","nav","section"]};var L={roles:["term","definition","directory","list","group","note","status","table","rowgroup","row","contentinfo"],tags:["dl","ul","ol","dd","details","output","table","thead","tbody","tfoot","tr"]};var t=["input","select","textarea"];var H=["scrollbar","slider","spinbutton"];var N=["searchbox","textbox"];var q=["grid","listbox","tablist","tree","treegrid"];var F=["button","checkbox","link","switch","option","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","radio","tab","treeitem","gridcell"];var u=["presentation","none"];var I=function(W){var U=["busy","controls","current","describedby","details","disabled","dropeffect","errormessage","flowto","grabbed","haspopup","invalid","keyshortcuts","live","owns","roledescription"];for(var V=0;V<U.length;V++){var j=a(W.getAttribute("aria-"+U[V]));if(j){return true}}return false};var n=function(V,j){if(V.nodeType!==1||V==j){return false}if(V.getAttribute("aria-hidden")==="true"){return true}if(V.getAttribute("hidden")){return true}var U=m(V);if(U.display==="none"||U.visibility==="hidden"){return true}return false};var m=function(U){var j={};if(document.defaultView&&document.defaultView.getComputedStyle){j=document.defaultView.getComputedStyle(U,"")}else{if(U.currentStyle){j=U.currentStyle}}return j};var d=function(X,Y){var W=Y;if(W.indexOf("attr(")!==-1){var U=W.match(/attr\((.|\n|\r\n)*?\)/g);for(var V=0;V<U.length;V++){var j=U[V].slice(5,-1);j=X.getAttribute(j)||"";W=W.replace(U[V],j)}}return W||Y};var f=function(W,Y){var U=Y||m(W);for(var X in C){var j=C[X];for(var V=0;V<j.length;V++){if(U[X]&&((j[V].indexOf("!")===0&&[j[V].slice(1),"inherit","initial","unset"].indexOf(U[X])===-1)||U[X].indexOf(j[V])!==-1)){return true}}}if(!Y&&W.nodeName&&g.indexOf(W.nodeName.toLowerCase())!==-1){return true}return false};var C={display:["block","grid","table","flow-root","flex"],position:["absolute","fixed"],"float":["left","right","inline"],clear:["left","right","both","inline"],overflow:["hidden","scroll","auto"],"column-count":["!auto"],"column-width":["!auto"],"column-span":["all"],contain:["layout","content","strict"]};var g=["address","article","aside","blockquote","br","canvas","dd","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","legend","li","main","nav","noscript","ol","output","p","pre","section","table","td","tfoot","th","tr","ul","video"];var T=function(aa,V,Z,Y,X,j){var U="";var ab=false;if(Z&&!j){U=V.getAttribute("aria-valuetext")||V.getAttribute("aria-valuenow")||""}else{if(Y&&!j){U=b(V)||""}else{if(X&&!j){var W=[];if(aa=="grid"||aa=="treegrid"){W=["gridcell","rowheader","columnheader"]}else{if(aa=="listbox"){W=["option"]}else{if(aa=="tablist"){W=["tab"]}else{if(aa=="tree"){W=["treeitem"]}}}}U=i(V,V.querySelectorAll('*[aria-selected="true"]'),false,W);ab=true}}}U=a(U);if(!U&&(Z||Y)&&V.value){U=V.value}if(!ab&&!U&&j){if(X){U=i(V,V.querySelectorAll("option[selected]"),true)}else{U=V.value}}return U};var w=function(j){return j.length?" "+j+" ":""};var i=function(Y,X,U,j){if(!X||!X.length){return""}var Z=[];for(var W=0;W<X.length;W++){var aa=e(X[W]);var V=!j||j.indexOf(aa)!==-1;if(V){Z.push(U?b(X[W]):k(X[W],true,false,[],false,{top:X[W]}))}}return Z.join(" ")};var z=function(U,j){var V={};for(var W in C){V[W]=document.defaultView.getComputedStyle(U,j).getPropertyValue(W)}V.content=document.defaultView.getComputedStyle(U,j).getPropertyValue("content").replace(/^\"|\\|\"$/g,"");return V};var b=function(V,j){if(!j&&V.nodeType===1){return V.innerText||V.textContent||""}var U=z(V,j);var W=U.content;if(!W||W==="none"){return""}if(f({},U)){if(j==":before"){W+=" "}else{if(j==":after"){W=" "+W}}}return W};var h=function(U,j){if(U&&U.nodeType!==1||U==j||["input","select","textarea","img","iframe"].indexOf(U.nodeName.toLowerCase())!==-1){return{before:"",after:""}}if(document.defaultView&&document.defaultView.getComputedStyle){return{before:d(U,b(U,":before")),after:d(U,b(U,":after"))}}else{return{before:"",after:""}}};var K=function(j,U){while(j){j=j.parentNode;if(j&&j.nodeName&&j.nodeName.toLowerCase()==U){return j}}return{}};var c=function(V,j,U,X){var W=[];while(V&&V!==U){if(V.id&&X&&X[V.id]&&X[V.id].node&&W.indexOf(V)===-1){W.push(V);V=X[V.id].node}else{V=V.parentNode}if(V&&V.getAttribute){if(!j&&V.getAttribute("aria-label")){return true}if(n(V,U)){return true}}}return false};var a=function(j){if(typeof j!=="string"){return""}return j.replace(/^\s+|\s+$/g,"")};if(n(A,document.body)||c(A,true,document.body)){return}var s=k(A,false,false,[],false,{top:A});var Q="";var B=a(A.getAttribute("title"));if(B){if(!a(s)){s=B}else{if(s.indexOf(B)===-1){Q=B}}}var D=A.getAttribute("aria-describedby")||"";if(D){var S=D.split(/\s+/);var R=[];for(var P=0;P<S.length;P++){var o=document.getElementById(S[P]);var p=k(o,true,false,[],false,{top:o});if(s.indexOf(p)===-1){R.push(p)}}var J=a(R.join(" "));if(J){Q=J}}s=a(s.replace(/\s+/g," "));Q=a(Q.replace(/\s+/g," "));if(s===Q){Q=""}var x={name:s,desc:Q};G=[];E=[];if(l&&typeof l=="function"){return l.apply(A,[A,x])}else{return x}};

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