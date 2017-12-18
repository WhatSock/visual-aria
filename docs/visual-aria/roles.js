/*!
Visual ARIA Bookmarklet (12/15/2017)
Copyright 2017 Bryan Garaventa (http://whatsock.com/training/matrices/visual-aria.htm)
Part of the ARIA Role Conformance Matrices, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	// For this implementation, a local relative copy of roles.css is loaded instead, so useOffline is still false.
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

			// BG:12/15/2017: Added logic to check for improper uses of aria-owns that break the accessibility tree
			nodes = document.querySelectorAll('input[aria-owns], img[aria-owns]');

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

			var calcNames = function(node){
				if (!node || node.nodeType !== 1)
					return;

				var trim = function(str){
					if (typeof str !== 'string')
						return '';

					return str.replace(/^\s+|\s+$/g, '');
				}, walkDOM = function(node, fn, refObj){
					if (!node)
						return;
					fn(node, refObj);

					if (!isException(node, refObj)){
						node = node.firstChild;

						while (node){
							walkDOM(node, fn, refObj);
							node = node.nextSibling;
						}
					}
				}, isException = function(o, refObj){
					if (!refObj || !o || refObj.nodeType !== 1 || o.nodeType !== 1)
						return false;
					var pNode =
									{
									role: refObj.getAttribute('role'),
									name: refObj.nodeName.toLowerCase()
									}, node =
									{
									role: o.getAttribute('role'),
									name: o.nodeName.toLowerCase()
									};

					node.focusable = (o.getAttribute('tabindex') || (node.name == 'a' && o.getAttribute('href'))
						|| ('input,select,button'.indexOf(node.name) !== -1 && o.getAttribute('type') != 'hidden')) ? true : false;

// Always include name from content when the referenced node matches list1, as well as when child nodes match those within list3
					var lst1 =
									{
									roles:
										',link,button,checkbox,option,radio,switch,tab,treeitem,menuitem,menuitemcheckbox,menuitemradio,cell,columnheader,rowheader,tooltip,heading,',
									names: ',a,button,summary,input,h1,h2,h3,h4,h5,h6,menuitem,option,td,th,'
									},

					// Never include name from content when current node matches list2
					lst2 =
									{
									roles:
										',application,alert,log,marquee,status,timer,alertdialog,dialog,banner,complementary,contentinfo,form,main,navigation,region,search,term,definition,article,directory,list,document,feed,figure,group,img,math,note,table,toolbar,menu,menubar,combobox,grid,listbox,radiogroup,textbox,searchbox,spinbutton,scrollbar,slider,tablist,tabpanel,tree,treegrid,separator,rowgroup,row,',
									names:
										',article,aside,body,select,datalist,dd,details,optgroup,dialog,dl,ul,ol,figure,footer,form,header,hr,img,textarea,input,main,math,menu,nav,output,section,table,thead,tbody,tfoot,tr,'
									},

// As an override of list2, conditionally include name from content if current node is focusable, or if the current node matches list3 while the referenced parent node matches list1.
					lst3 =
									{
									roles: ',combobox,term,definition,directory,list,group,note,status,table,rowgroup,row,contentinfo,',
									names: ',dl,ul,ol,dd,details,output,table,thead,tbody,tfoot,tr,'
									};

					// Prevent calculating name from content if the current node matches list2
					if (lst2.roles.indexOf(',' + node.role + ',') >= 0 || lst2.names.indexOf(',' + node.name + ',') >= 0){

						// Override condition so name from content is sometimes included when the current node matches list3
						if ((lst3.roles.indexOf(',' + node.role + ',') >= 0 || lst3.names.indexOf(',' + node.name + ',') >= 0) &&
// Include name from content if the referenced node is the same as the current node, or if the current node is focusable, or if the referencing parent node matches those within list1
						(refObj == o || node.focusable
							|| (lst1.roles.indexOf(',' + pNode.role + ',') >= 0 || lst1.names.indexOf(',' + pNode.name + ',') >= 0))){
							return false;
						}

						return true;
					}

					return false;
				}, isHidden = function(o, refObj){
					if (o.nodeType !== 1 || o == refObj)
						return false;

					if (o != refObj && ((o.getAttribute && o.getAttribute('aria-hidden') == 'true')
						|| (o.currentStyle && (o.currentStyle['display'] == 'none' || o.currentStyle['visibility'] == 'hidden'))
							|| (document.defaultView && document.defaultView.getComputedStyle && (document.defaultView.getComputedStyle(o,
								'')['display'] == 'none' || document.defaultView.getComputedStyle(o, '')['visibility'] == 'hidden'))
							|| (o.style && (o.style['display'] == 'none' || o.style['visibility'] == 'hidden'))))
						return true;
					return false;
				}, inArray = function(search, stack){
					for (var i = 0; i < stack.length; i++){
						if (stack[i] === search){
							return i;
						}
					}

					return -1;
				}, getCSSText = function(o, refObj){
					if (o.nodeType !== 1 || o == refObj
						|| ' input select textarea img iframe '.indexOf(' ' + o.nodeName.toLowerCase() + ' ') !== -1)
						return false;
					var css =
									{
									before: '',
									after: ''
									};

					if ((document.defaultView && document.defaultView.getComputedStyle
						&& (document.defaultView.getComputedStyle(o, ':before').getPropertyValue('content')
							|| document.defaultView.getComputedStyle(o, ':after').getPropertyValue('content')))){
						css.before = trim(document.defaultView.getComputedStyle(o, ':before').getPropertyValue('content'));
						css.after = trim(document.defaultView.getComputedStyle(o, ':after').getPropertyValue('content'));

						if (css.before == 'none')
							css.before = '';

						if (css.after == 'none')
							css.after = '';
					}
					return css;
				}, hasParentLabel = function(start, targ, noLabel, refObj){
					if (!start || !targ || start == targ)
						return false;

					while (start){
						start = start.parentNode;

						var rP = start.getAttribute ? start.getAttribute('role') : '';
						rP = (rP != 'presentation' && rP != 'none') ? false : true;

						if (!rP && start.getAttribute
							&& ((!noLabel && trim(start.getAttribute('aria-label'))) || isHidden(start, refObj))){
							return true;
						}

						else if (start == targ)
							return false;
					}

					return false;
				};

				if (isHidden(node, document.body) || hasParentLabel(node, document.body, true, document.body))
					return;

				var accName = '', accDesc = '', desc = '', aDescribedby = node.getAttribute('aria-describedby') || '',
					title = node.getAttribute('title') || '', skip = false, rPresentation = node.getAttribute('role');
				rPresentation = (rPresentation != 'presentation' && rPresentation != 'none') ? false : true;

				var walk = function(obj, stop, refObj, isIdRef){
					var nm = '', nds = [], cssOP = {}, idRefNode = null;

					if (inArray(obj, nds) === -1){
						nds.push(obj);

						if (isIdRef || obj == refObj){
							idRefNode = obj;
						}

					// Disabled in Visual ARIA to prevent self referencing by Visual ARIA tooltips
					// cssOP = getCSSText(obj, null);
					}

					walkDOM(obj, function(o, refObj){
						if (skip || !o || (o.nodeType === 1 && isHidden(o, refObj)))
							return;

						var name = '', cssO = {};

						if (inArray(idRefNode && idRefNode == o ? o : o.parentNode, nds) === -1){
							nds.push(idRefNode && idRefNode == o ? o : o.parentNode);
							cssO = getCSSText(idRefNode && idRefNode == o ? o : o.parentNode, refObj);
						}

						if (o.nodeType === 1){
							var aLabelledby = o.getAttribute('aria-labelledby') || '', aLabel = o.getAttribute('aria-label') || '',
								nTitle = o.getAttribute('title') || '', rolePresentation = o.getAttribute('role');
							rolePresentation = (rolePresentation != 'presentation' && rolePresentation != 'none') ? false : true;
						}

						if (o.nodeType === 1
							&& ((!o.firstChild || (o == refObj && (aLabelledby || aLabel))) || (o.firstChild && o != refObj && aLabel))){
							if (!stop && o == refObj && aLabelledby){
								if (!rolePresentation){
									var a = aLabelledby.split(' ');

									for (var i = 0; i < a.length; i++){
										var rO = document.getElementById(a[i]);
										name += ' ' + walk(rO, true, rO, true) + ' ';
									}
								}

								if (trim(name) || rolePresentation)
									skip = true;
							}

							if (!trim(name) && aLabel && !rolePresentation){
								name = ' ' + trim(aLabel) + ' ';

								if (trim(name) && o == refObj)
									skip = true;
							}

							if (!trim(name)
								&& !rolePresentation && ' input select textarea '.indexOf(' ' + o.nodeName.toLowerCase() + ' ') !== -1 && o.id
									&& document.querySelectorAll('label[for="' + o.id + '"]').length){
								var rO = document.querySelectorAll('label[for="' + o.id + '"]')[0];
								name = ' ' + trim(walk(rO, true, rO, true)) + ' ';
							}

							if (!trim(name) && !rolePresentation && (o.nodeName.toLowerCase() == 'img') && (trim(o.getAttribute('alt')))){
								name = ' ' + trim(o.getAttribute('alt')) + ' ';
							}

							if (!trim(name) && !rolePresentation && nTitle){
								name = ' ' + trim(nTitle) + ' ';
							}
						}

						else if (o.nodeType === 3){
							name = o.data;
						}

						if (cssO.before)
							name = cssO.before + ' ' + name;

						if (cssO.after)
							name += ' ' + cssO.after;
						name = ' ' + trim(name) + ' ';

						if (trim(name) && !hasParentLabel(o, refObj, false, refObj)){
							nm += name;
						}
					}, refObj);

					if (cssOP.before)
						nm = cssOP.before + ' ' + nm;

					if (cssOP.after)
						nm += ' ' + cssOP.after;
					nm = trim(nm);

					return nm;
				};

				accName = walk(node, false, node);
				skip = false;

				if (title && !rPresentation){
					if (!trim(accName))
						accName = trim(title);

					else
						desc = trim(title);
				}

				if (aDescribedby && !rPresentation){
					var s = '', d = aDescribedby.split(' ');

					for (var j = 0; j < d.length; j++){
						var rO = document.getElementById(d[j]);
						s += ' ' + walk(rO, true, rO, true) + ' ';
					}

					if (trim(s))
						desc = s;
				}

				if (trim(desc) && !rPresentation)
					accDesc = desc;

				accName = trim(accName.replace(/\s/g, ' ').replace(/\s\s+/g, ' '));
				accDesc = trim(accDesc.replace(/\s/g, ' ').replace(/\s\s+/g, ' '));

				if (accName == accDesc)
					accDesc = '';

				if (' input textarea img progress '.indexOf(' ' + node.nodeName.toLowerCase() + ' ') !== -1){
					node.parentNode.setAttribute('data-ws-bm-name-prop', accName);

					node.parentNode.setAttribute('data-ws-bm-desc-prop', accDesc);
				}

				else{
					node.setAttribute('data-ws-bm-name-prop', accName);

					node.setAttribute('data-ws-bm-desc-prop', accDesc);
				}
			};

			var accNames =
				document.querySelectorAll(
					'textarea, input, select, button, a[href], progress, *[role="button"], *[role="checkbox"], *[role="link"], *[role="searchbox"], *[role="scrollbar"], *[role="slider"], *[role="spinbutton"], *[role="switch"], *[role="textbox"], *[role="combobox"], *[role="option"], *[role="menuitem"], *[role="menuitemcheckbox"], *[role="menuitemradio"], *[role="radio"], *[role="tab"], *[role="treeitem"]');

			for (var aN = 0; aN < accNames.length; aN++){
				calcNames(accNames[aN]);
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