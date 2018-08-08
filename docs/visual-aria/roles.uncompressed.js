/*!
Visual ARIA Bookmarklet (CSS: 08/06/2018), JS last modified 08/06/2018
Copyright 2018 Bryan Garaventa
https://github.com/accdc/visual-aria
Part of the ARIA Role Conformance Matrices, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function() {
  // Set useOffline=true to disable the dynamic loader,
  // or reference an https:// path to ensure that both secure and non-secure sites can be accessed by Visual ARIA when useOffline=false.
  // When useOffline=true, the roles.css file must be manually added to provide visual feedback within the same document where roles.js is being processed.
  var useOffline = false,
    // Base path for dynamic loading of individual CSS files.
    basePath = "https://accdc.github.io/visual-aria/visual-aria/public/",
    // Set millisecond interval for dynamically loading supporting CSS files and performing the naming calculation for widget roles
    msInterval = 2000;

  if (!document.getElementById("ws-bm-aria-matrices-lnk")) {
    var s = document.createElement("span");
    s.className = "WS-BM-Loading-Msg";
    s.innerHTML =
      '<span role="alert" style="position: fixed; z-index:10000; color: white; background-color: black; border: inset thick gray; top: 40%; left: 35%; padding: 20px; font-size: 18pt;">Loading Visual ARIA, please wait.<br /><i>(Hold down Ctrl+Shift then Left-click any role for more details.)</i></span>';
    window.VisualARIALoadingMsg = s;
    document.body.appendChild(window.VisualARIALoadingMsg);
  }

  window.top.IsVisualARIALoaded = true;

  window.toggleVisualARIA = function() {
    if (window.VisualARIALoadingMsg) {
      window.VisualARIALoadingMsg.parentNode.removeChild(
        window.VisualARIALoadingMsg
      );
      window.VisualARIALoadingMsg = null;
    }
    window.top.IsVisualARIALoaded = window.top.IsVisualARIALoaded
      ? false
      : true;
    window.VisualARIAToggle.setAttribute(
      "aria-label",
      window.top.IsVisualARIALoaded ? "Unload Visual ARIA" : "Load Visual ARIA"
    );
    window.VisualARIAToggle.innerHTML = getVisualARIAStatus()["long"];
  };

  window.getVisualARIAStatus = function() {
    return {
      long: window.top.IsVisualARIALoaded
        ? "Unload Visual ARIA"
        : "Load Visual ARIA",
      short: window.top.IsVisualARIALoaded ? "X" : "O"
    };
  };

  var WSBMInit = function(
    isTop,
    useOffline,
    basePath,
    msInterval,
    document,
    attrs,
    isNested,
    check,
    loaded
  ) {
    var loader = this;

    var bind = function(obj, type, fn) {
        if (obj.attachEvent) {
          obj["e" + type + fn] = fn;

          obj[type + fn] = function() {
            obj["e" + type + fn](window.event);
          };

          obj.attachEvent("on" + type, obj[type + fn]);
        } else if (obj.addEventListener) {
          obj.addEventListener(type, fn, false);
        }

        return obj;
      },
      trim = function(str) {
        if (typeof str !== "string") return "";

        return str.replace(/^\s+|\s+$/g, "");
      },
      activeObj = null,
      activeDObj = null;

    attrs = "aria-disabled,aria-readonly,aria-haspopup,aria-orientation,aria-label,aria-labelledby,aria-describedby,aria-pressed,aria-checked,aria-valuemin,aria-valuemax,aria-valuenow,aria-valuetext,aria-controls,aria-autocomplete,aria-expanded,aria-owns,aria-activedescendant,aria-posinset,aria-setsize,aria-level,role,alt".split(
      ","
    );
    isNested = function(start, role) {
      while (start) {
        start = start.parentNode;

        if (start.getAttribute("role") == role) return "true";
      }

      return "false";
    };

    check = function(
      nodes,
      obj,
      frames,
      focused,
      pNode,
      focusHidden,
      isSelfRef,
      isDefTerm
    ) {
      if (!window.top.IsVisualARIALoaded) {
        if (loader.cssLinks && loader.cssLinks.length) {
          for (var i = 0; i < loader.cssLinks.length; i++) {
            loader.cssLinks[i].parentNode.removeChild(loader.cssLinks[i]);
          }
          loader.cssLinks = [];
          loaded = {
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
        }
      } else {
        if (loaded && loaded.init) {
          if (
            !loaded.comboboxListbox &&
            !document.getElementById("ws-visual-aria-7") &&
            document.querySelectorAll(
              '*[role="combobox"], *[role="listbox"], *[role="option"]'
            ).length
          ) {
            loaded.comboboxListbox = true;
            loadCSS("7combobox-listbox.css", "7");
          }

          if (
            !loaded.menuMenubar &&
            !document.getElementById("ws-visual-aria-8") &&
            document.querySelectorAll(
              '*[role="menu"], *[role="menubar"], *[role="menuitem"], *[role="menuitemradio"], *[role="menuitemcheckbox"]'
            ).length
          ) {
            loaded.menuMenubar = true;
            loadCSS("8menu-menubar.css", "8");
          }

          if (
            !loaded.radiogroup &&
            !document.getElementById("ws-visual-aria-9") &&
            document.querySelectorAll('*[role="radiogroup"], *[role="radio"]')
              .length
          ) {
            loaded.radiogroup = true;
            loadCSS("9radiogroup.css", "9");
          }

          if (
            !loaded.tablist &&
            !document.getElementById("ws-visual-aria-10") &&
            document.querySelectorAll(
              '*[role="tablist"], *[role="tab"], *[role="tabpanel"]'
            ).length
          ) {
            loaded.tablist = true;
            loadCSS("10tablist.css", "10");
          }

          if (
            !loaded.tree &&
            !document.getElementById("ws-visual-aria-11") &&
            document.querySelectorAll('*[role="tree"], *[role="treeitem"]')
              .length
          ) {
            loaded.tree = true;
            loadCSS("11tree.css", "11");
          }

          if (
            !loaded.treegridGridTable &&
            !document.getElementById("ws-visual-aria-12") &&
            document.querySelectorAll(
              '*[role="treegrid"], *[role="grid"], *[role="table"], *[role="rowgroup"], *[role="row"], *[role="columnheader"], *[role="rowheader"], *[role="gridcell"], *[role="cell"]'
            ).length
          ) {
            loaded.treegridGridTable = true;
            loadCSS("12treegrid-grid-table.css", "12");
          }
        }

        if (loaded && !loaded.init) {
          loaded.init = true;
          loadCSS("1roles.css", "1");
          loaded.landmarks = true;
          loadCSS("2landmarks.css", "2");
          loaded.structural = true;
          loadCSS("3structural.css", "3");
          loaded.dialogs = true;
          loadCSS("4dialogs.css", "4");
          loaded.liveRegions = true;
          loadCSS("5live-regions.css", "5");
          loaded.simpleWidgets = true;
          loadCSS("6simple-widgets.css", "6");
        }

        // BG:12/18/2017: Added the AREA and HR elements to check for improper usage of aria-owns as well.
        nodes = document.querySelectorAll(
          "input[aria-owns], img[aria-owns], area[aria-owns], hr[aria-owns]"
        );

        for (var i = 0; i < nodes.length; i++) {
          nodes[i].setAttribute("data-ws-bm-aria-owns-invalid", "true");
          nodes[i].parentNode.setAttribute(
            "data-ws-bm-aria-owns-invalid",
            nodes[i].nodeName.toUpperCase()
          );
        }

        nodes = document.querySelectorAll("input, *[role], img, progress");

        obj = {};

        isSelfRef = function(node, role, ids) {
          if (
            !node ||
            node.nodeType !== 1 ||
            !trim(role) ||
            !trim(ids) ||
            " application banner complementary contentinfo form main navigation region search article directory document list note table toolbar feed log status combobox grid listbox menu menubar radiogroup tablist tabpanel tree group treegrid ".indexOf(
              " " + role + " "
            ) === -1
          )
            return false;

          var isF = false,
            a = ids.split(" ");

          for (var i = 0; i < a.length; i++) {
            if (document.getElementById(a[i]) == node) isF = true;
          }

          if (isF) node.setAttribute("data-ws-bm-self-ref", "true");
          return isF;
        };

        isDefTerm = function(ids) {
          var isT = true,
            a = ids.split(" ");

          for (var i = 0; i < a.length; i++) {
            var o = document.getElementById(a[i]);

            if (o && o.nodeType === 1 && o.getAttribute("role") != "term") {
              o.setAttribute("data-ws-bm-dtr-missing", "true");
              isT = false;
            }
          }
          return isT;
        };

        for (var i = 0; i < nodes.length; i++) {
          for (var j = 0; j < attrs.length; j++)
            obj[attrs[j]] = nodes[i].getAttribute(attrs[j]) || null;
          obj["node-name"] = nodes[i].nodeName.toLowerCase();
          obj.tabindex = nodes[i].getAttribute("tabindex");
          obj["input-type"] =
            obj["node-name"] == "input" ? nodes[i].getAttribute("type") : null;

          if (obj.role == "radio")
            obj["role-nested"] = isNested(nodes[i], "radiogroup");
          else if (obj.role == "tab")
            obj["role-nested"] = isNested(nodes[i], "tablist");
          else if (obj.role == "treeitem")
            obj["role-nested"] = isNested(nodes[i], "tree");

          isSelfRef(nodes[i], obj.role, obj["aria-labelledby"]);

          if (obj.role == "definition" && obj["aria-labelledby"])
            isDefTerm(obj["aria-labelledby"]);

          if (
            " input img progress ".indexOf(" " + obj["node-name"] + " ") !== -1
          ) {
            if (pNode != nodes[i].parentNode) {
              pNode = nodes[i].parentNode;

              for (var a in obj) {
                if (obj[a] || !isNaN(parseInt(obj[a])))
                  pNode.setAttribute("data-ws-bm-" + a, obj[a]);
                else pNode.removeAttribute("data-ws-bm-" + a);
              }
            }
          }
        }

        focused = document.querySelectorAll("*[aria-describedby]:focus");

        if (focused.length) {
          var dbs = focused[0].getAttribute("aria-describedby").split(" ");

          for (var d = 0; d < dbs.length; d++) {
            var t = document.getElementById(dbs[d]);

            if (t && t.nodeType === 1)
              t.setAttribute("data-ws-bm-db-match", dbs[d]);
          }
        }

        focused = document.querySelectorAll("*[aria-activedescendant]:focus");
        var fO = null;

        if (focused.length)
          fO = document.getElementById(
            focused[0].getAttribute("aria-activedescendant")
          );

        if (
          (!focused.length ||
            !fO ||
            focused[0] != activeObj ||
            fO != activeDObj) &&
          (activeDObj &&
            activeDObj.nodeType === 1 &&
            activeDObj.getAttribute("data-ws-bm-ad-match"))
        ) {
          activeDObj.removeAttribute("data-ws-bm-ad-match");
          activeDObj.removeAttribute("data-ws-bm-ad-invalid");
          activeDObj = null;
        }

        if (fO && fO.nodeType === 1) {
          activeObj = focused[0];
          activeDObj = fO;
          var nn = fO.nodeName.toLowerCase(),
            href = fO.getAttribute("href"),
            rl = fO.getAttribute("role");

          if (!rl && nn == "a" && href) rl = "link";
          else if (!rl && nn == "button") rl = "button";
          fO.setAttribute("data-ws-bm-ad-match", rl);

          if (!rl) fO.setAttribute("data-ws-bm-ad-invalid", "true");
        }

        focusHidden = document.querySelectorAll('*[hidefocus="true"]');

        for (var h = 0; h < focusHidden.length; h++)
          focusHidden[h].removeAttribute("hidefocus");

        frames = document.querySelectorAll("frame, iframe");

        for (var f = 0; f < frames.length; f++) {
          try {
            if (
              frames[f].contentDocument &&
              frames[f].contentDocument.head &&
              !frames[f].contentDocument.WSBMInit
            ) {
              frames[f].contentDocument.WSBMInit = WSBMInit;
              frames[f].contentDocument.WSBMInit(
                false,
                useOffline,
                basePath,
                msInterval,
                frames[f].contentDocument
              );
            }
          } catch (e) {}
        }

        var presentational = document.querySelectorAll(
          '*[role="presentation"], *[role="none"]'
        );

        for (var p = 0; p < presentational.length; p++) {
          var pO = presentational[p],
            oR = pO.getAttribute("role"),
            oN = pO.nodeName.toUpperCase(),
            aN =
              oR == "none" ? "data-ws-role-none" : "data-ws-role-presentation";

          if (
            " input textarea img progress ".indexOf(
              " " + oN.toLowerCase() + " "
            ) !== -1
          )
            pO.parentNode.setAttribute(aN, oN);
          else pO.setAttribute(aN, oN);
        }
      }

      setTimeout(check, msInterval);
    };

    var checkNames = function() {
      /*
AccName Prototype 2.14, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
      var calcNames = function(node, fnc, preventVisualARIASelfCSSRef) {
        var props = { name: "", desc: "" };
        if (!node || node.nodeType !== 1) {
          return props;
        }
        var topNode = node;

        // Track nodes to prevent duplicate node reference parsing.
        var nodes = [];
        // Track aria-owns references to prevent duplicate parsing.
        var owns = [];

        // Recursively process a DOM node to compute an accessible name in accordance with the spec
        var walk = function(
          refNode,
          stop,
          skip,
          nodesToIgnoreValues,
          skipAbort,
          ownedBy
        ) {
          var fullResult = {
            name: "",
            title: ""
          };

          /*
ARIA Role Exception Rule Set 1.1
The following Role Exception Rule Set is based on the following ARIA Working Group discussion involving all relevant browser venders.
https://lists.w3.org/Archives/Public/public-aria/2017Jun/0057.html
*/
          var isException = function(node, refNode) {
            if (
              !refNode ||
              !node ||
              refNode.nodeType !== 1 ||
              node.nodeType !== 1
            ) {
              return false;
            }

            var inList = function(node, list) {
              var role = getRole(node);
              var tag = node.nodeName.toLowerCase();
              return (
                (role && list.roles.indexOf(role) >= 0) ||
                (!role && list.tags.indexOf(tag) >= 0)
              );
            };

            // The list3 overrides must be checked first.
            if (inList(node, list3)) {
              if (
                node === refNode &&
                !(node.id && ownedBy[node.id] && ownedBy[node.id].node)
              ) {
                return !isFocusable(node);
              } else {
                // Note: the inParent checker needs to be present to allow for embedded roles matching list3 when the referenced parent is referenced using aria-labelledby, aria-describedby, or aria-owns.
                return !(
                  (inParent(node, ownedBy.top) &&
                    node.nodeName.toLowerCase() != "select") ||
                  inList(refNode, list1)
                );
              }
            }
            // Otherwise process list2 to identify roles to ignore processing name from content.
            else if (
              inList(node, list2) ||
              (node === topNode && !inList(node, list1))
            ) {
              return true;
            } else {
              return false;
            }
          };

          var inParent = function(node, parent) {
            var trackNodes = [];
            while (node) {
              if (
                node.id &&
                ownedBy[node.id] &&
                ownedBy[node.id].node &&
                trackNodes.indexOf(node) === -1
              ) {
                trackNodes.push(node);
                node = ownedBy[node.id].node;
              } else {
                node = node.parentNode;
              }
              if (node && node === parent) {
                return true;
              } else if (
                !node ||
                node === ownedBy.top ||
                node === document.body
              ) {
                return false;
              }
            }
            return false;
          };

          // Placeholder for storing CSS before and after pseudo element text values for the top level node
          var cssOP = {
            before: "",
            after: ""
          };

          if (ownedBy.ref) {
            if (isParentHidden(refNode, document.body, true, true)) {
              // If referenced via aria-labelledby or aria-describedby, do not return a name or description if a parent node is hidden.
              return fullResult;
            } else if (isHidden(refNode, document.body)) {
              // Otherwise, if aria-labelledby or aria-describedby reference a node that is explicitly hidden, then process all children regardless of their individual hidden states.
              var ignoreHidden = true;
            }
          }

          if (nodes.indexOf(refNode) === -1) {
            // Store the before and after pseudo element 'content' values for the top level DOM node
            // Note: If the pseudo element includes block level styling, a space will be added, otherwise inline is asumed and no spacing is added.
            cssOP = getCSSText(refNode, null);

            // Enabled in Visual ARIA to prevent self referencing by Visual ARIA tooltips
            if (preventVisualARIASelfCSSRef) {
              if (
                cssOP.before.indexOf(" [ARIA] ") !== -1 ||
                cssOP.before.indexOf(" aria-") !== -1 ||
                cssOP.before.indexOf(" accName: ") !== -1
              )
                cssOP.before = "";
              if (
                cssOP.after.indexOf(" [ARIA] ") !== -1 ||
                cssOP.after.indexOf(" aria-") !== -1 ||
                cssOP.after.indexOf(" accDescription: ") !== -1
              )
                cssOP.after = "";
            }
          }

          // Recursively apply the same naming computation to all nodes within the referenced structure
          var walkDOM = function(node, fn, refNode) {
            var res = {
              name: "",
              title: ""
            };
            if (!node) {
              return res;
            }
            var nodeIsBlock =
              node && node.nodeType === 1 && isBlockLevelElement(node)
                ? true
                : false;
            var fResult = fn(node) || {};
            if (fResult.name && fResult.name.length) {
              res.name += fResult.name;
            }
            if (!isException(node, ownedBy.top, ownedBy)) {
              node = node.firstChild;
              while (node) {
                res.name += walkDOM(node, fn, refNode).name;
                node = node.nextSibling;
              }
            }
            res.name += fResult.owns || "";
            if (!trim(res.name) && trim(fResult.title)) {
              res.name = addSpacing(fResult.title);
            } else {
              res.title = addSpacing(fResult.title);
            }
            if (trim(fResult.desc)) {
              res.title = addSpacing(fResult.desc);
            }
            if (nodeIsBlock || fResult.isWidget) {
              res.name = addSpacing(res.name);
            }
            return res;
          };

          fullResult = walkDOM(
            refNode,
            function(node) {
              var result = {
                name: "",
                title: "",
                owns: ""
              };
              var isEmbeddedNode =
                node &&
                node.nodeType === 1 &&
                nodesToIgnoreValues &&
                nodesToIgnoreValues.length &&
                nodesToIgnoreValues.indexOf(node) !== -1 &&
                node === topNode &&
                node !== refNode
                  ? true
                  : false;

              if (
                (skip ||
                  !node ||
                  nodes.indexOf(node) !== -1 ||
                  (!ignoreHidden && isHidden(node, ownedBy.top))) &&
                !skipAbort &&
                !isEmbeddedNode
              ) {
                // Abort if algorithm step is already completed, or if node is a hidden child of refNode, or if this node has already been processed, or skip abort if aria-labelledby self references same node.
                return result;
              }

              if (nodes.indexOf(node) === -1) {
                nodes.push(node);
              }

              // Store name for the current node.
              var name = "";
              // Store name from aria-owns references if detected.
              var ariaO = "";
              // Placeholder for storing CSS before and after pseudo element text values for the current node container element
              var cssO = {
                before: "",
                after: ""
              };

              var parent = refNode === node ? node : node.parentNode;
              if (nodes.indexOf(parent) === -1) {
                nodes.push(parent);
                // Store the before and after pseudo element 'content' values for the current node container element
                // Note: If the pseudo element includes block level styling, a space will be added, otherwise inline is asumed and no spacing is added.
                cssO = getCSSText(parent, refNode);

                // Enabled in Visual ARIA to prevent self referencing by Visual ARIA tooltips
                if (preventVisualARIASelfCSSRef) {
                  if (
                    cssO.before.indexOf(" [ARIA] ") !== -1 ||
                    cssO.before.indexOf(" aria-") !== -1 ||
                    cssO.before.indexOf(" accName: ") !== -1
                  )
                    cssO.before = "";
                  if (
                    cssO.after.indexOf(" [ARIA] ") !== -1 ||
                    cssO.after.indexOf(" aria-") !== -1 ||
                    cssO.after.indexOf(" accDescription: ") !== -1
                  )
                    cssO.after = "";
                }
              }

              // Process standard DOM element node
              if (node.nodeType === 1) {
                var aLabelledby = node.getAttribute("aria-labelledby") || "";
                var aDescribedby = node.getAttribute("aria-describedby") || "";
                var aLabel = node.getAttribute("aria-label") || "";
                var nTitle = node.getAttribute("title") || "";
                var nTag = node.nodeName.toLowerCase();
                var nRole = getRole(node);

                var isNativeFormField = nativeFormFields.indexOf(nTag) !== -1;
                var isRangeWidgetRole = rangeWidgetRoles.indexOf(nRole) !== -1;
                var isEditWidgetRole = editWidgetRoles.indexOf(nRole) !== -1;
                var isSelectWidgetRole =
                  selectWidgetRoles.indexOf(nRole) !== -1;
                var isSimulatedFormField =
                  isRangeWidgetRole ||
                  isEditWidgetRole ||
                  isSelectWidgetRole ||
                  nRole == "combobox";
                var isWidgetRole =
                  (isSimulatedFormField ||
                    otherWidgetRoles.indexOf(nRole) !== -1) &&
                  nRole != "link";
                result.isWidget = isNativeFormField || isWidgetRole;

                var hasName = false;
                var aOwns = node.getAttribute("aria-owns") || "";
                var isSeparatChildFormField =
                  !isEmbeddedNode &&
                  ((node !== refNode &&
                    (isNativeFormField || isSimulatedFormField)) ||
                    (node.id &&
                      ownedBy[node.id] &&
                      ownedBy[node.id].target &&
                      ownedBy[node.id].target === node))
                    ? true
                    : false;

                if (!stop && node === refNode) {
                  // Check for non-empty value of aria-labelledby if current node equals reference node, follow each ID ref, then stop and process no deeper.
                  if (aLabelledby) {
                    var ids = aLabelledby.split(/\s+/);
                    var parts = [];
                    for (var i = 0; i < ids.length; i++) {
                      var element = document.getElementById(ids[i]);
                      // Also prevent the current form field from having its value included in the naming computation if nested as a child of label
                      parts.push(
                        walk(element, true, skip, [node], element === refNode, {
                          ref: ownedBy,
                          top: element
                        }).name
                      );
                    }
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(parts.join(" "));

                    if (trim(name)) {
                      hasName = true;
                      // Abort further recursion if name is valid.
                      skip = true;
                    }
                  }

                  // Check for non-empty value of aria-describedby if current node equals reference node, follow each ID ref, then stop and process no deeper.
                  if (aDescribedby) {
                    var desc = "";
                    ids = aDescribedby.split(/\s+/);
                    var parts = [];
                    for (var i = 0; i < ids.length; i++) {
                      var element = document.getElementById(ids[i]);
                      // Also prevent the current form field from having its value included in the naming computation if nested as a child of label
                      parts.push(
                        walk(element, true, false, [node], false, {
                          ref: ownedBy,
                          top: element
                        }).name
                      );
                    }
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    desc = trim(parts.join(" "));

                    if (trim(desc)) {
                      result.desc = desc;
                    }
                  }
                }

                // Otherwise, if the current node is a nested widget control within the parent ref obj, then add only its value and process no deeper within the branch.
                if (isSeparatChildFormField) {
                  // Prevent the referencing node from having its value included in the case of form control labels that contain the element with focus.
                  if (
                    !(
                      nodesToIgnoreValues &&
                      nodesToIgnoreValues.length &&
                      nodesToIgnoreValues.indexOf(node) !== -1
                    )
                  ) {
                    if (isRangeWidgetRole) {
                      // For range widgets, append aria-valuetext if non-empty, or aria-valuenow if non-empty, or node.value if applicable.
                      name = getObjectValue(nRole, node, true);
                    } else if (
                      isEditWidgetRole ||
                      (nRole == "combobox" && isNativeFormField)
                    ) {
                      // For simulated edit widgets, append text from content if applicable, or node.value if applicable.
                      name = getObjectValue(nRole, node, false, true);
                    } else if (isSelectWidgetRole) {
                      // For simulated select widgets, append same naming computation algorithm for all child nodes including aria-selected="true" separated by a space when multiple.
                      // Also filter nodes so that only valid child roles of relevant parent role that include aria-selected="true" are included.
                      name = getObjectValue(nRole, node, false, false, true);
                    } else if (
                      isNativeFormField &&
                      ["input", "textarea"].indexOf(nTag) !== -1 &&
                      (!isWidgetRole || isEditWidgetRole)
                    ) {
                      // For native edit fields, append node.value when applicable.
                      name = getObjectValue(
                        nRole,
                        node,
                        false,
                        false,
                        false,
                        true
                      );
                    } else if (
                      isNativeFormField &&
                      nTag === "select" &&
                      (!isWidgetRole || nRole == "combobox")
                    ) {
                      // For native select fields, get text from content for all options with selected attribute separated by a space when multiple, but don't process if another widget role is present unless it matches role="combobox".
                      // Reference: https://github.com/WhatSock/w3c-alternative-text-computation/issues/7
                      name = getObjectValue(
                        nRole,
                        node,
                        false,
                        false,
                        true,
                        true
                      );
                    }

                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(name);
                  }

                  if (trim(name)) {
                    hasName = true;
                  }
                }

                // Otherwise, if current node has a non-empty aria-label then set as name and process no deeper within the branch.
                if (!hasName && trim(aLabel) && !isSeparatChildFormField) {
                  name = aLabel;

                  // Check for blank value, since whitespace chars alone are not valid as a name
                  if (trim(name)) {
                    hasName = true;
                    if (node === refNode) {
                      // If name is non-empty and both the current and refObject nodes match, then don't process any deeper within the branch.
                      skip = true;
                    }
                  }
                }

                // Otherwise, if name is still empty and the current node matches the ref node and is a standard form field with a non-empty associated label element, process label with same naming computation algorithm.
                if (!hasName && node === refNode && isNativeFormField) {
                  // Logic modified to match issue
                  // https://github.com/WhatSock/w3c-alternative-text-computation/issues/12 */
                  var labels = document.querySelectorAll("label");
                  var implicitLabel = getParent(node, "label") || false;
                  var explicitLabel =
                    node.id &&
                    document.querySelectorAll('label[for="' + node.id + '"]')
                      .length
                      ? document.querySelector('label[for="' + node.id + '"]')
                      : false;
                  var implicitI = 0;
                  var explicitI = 0;
                  for (var i = 0; i < labels.length; i++) {
                    if (labels[i] === implicitLabel) {
                      implicitI = i;
                    } else if (labels[i] === explicitLabel) {
                      explicitI = i;
                    }
                  }
                  var isImplicitFirst =
                    implicitLabel &&
                    implicitLabel.nodeType === 1 &&
                    explicitLabel &&
                    explicitLabel.nodeType === 1 &&
                    implicitI < explicitI
                      ? true
                      : false;

                  if (implicitLabel && explicitLabel && isImplicitFirst) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(implicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: implicitLabel
                      }).name +
                        " " +
                        walk(explicitLabel, true, skip, [node], false, {
                          ref: ownedBy,
                          top: explicitLabel
                        }).name
                    );
                  } else if (explicitLabel && implicitLabel) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(explicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: explicitLabel
                      }).name +
                        " " +
                        walk(implicitLabel, true, skip, [node], false, {
                          ref: ownedBy,
                          top: implicitLabel
                        }).name
                    );
                  } else if (explicitLabel) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(explicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: explicitLabel
                      }).name
                    );
                  } else if (implicitLabel) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(implicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: implicitLabel
                      }).name
                    );
                  }

                  if (trim(name)) {
                    hasName = true;
                  }
                }

                var rolePresentation =
                  !hasName &&
                  nRole &&
                  presentationRoles.indexOf(nRole) !== -1 &&
                  !isFocusable(node) &&
                  !hasGlobalAttr(node)
                    ? true
                    : false;
                var nAlt = rolePresentation
                  ? ""
                  : trim(node.getAttribute("alt"));

                // Otherwise, if name is still empty and current node is a standard non-presentational img or image button with a non-empty alt attribute, set alt attribute value as the accessible name.
                if (
                  !hasName &&
                  !rolePresentation &&
                  (nTag == "img" ||
                    (nTag == "input" &&
                      node.getAttribute("type") == "image")) &&
                  nAlt
                ) {
                  // Check for blank value, since whitespace chars alone are not valid as a name
                  name = trim(nAlt);
                  if (trim(name)) {
                    hasName = true;
                  }
                }

                // Otherwise, if current node is non-presentational and includes a non-empty title attribute and is not a separate embedded form field, store title attribute value as the accessible name if name is still empty, or the description if not.
                if (
                  !rolePresentation &&
                  trim(nTitle) &&
                  !isSeparatChildFormField
                ) {
                  // Check for blank value, since whitespace chars alone are not valid as a name
                  result.title = trim(nTitle);
                }

                // Check for non-empty value of aria-owns, follow each ID ref, then process with same naming computation.
                // Also abort aria-owns processing if contained on an element that does not support child elements.
                if (aOwns && !isNativeFormField && nTag != "img") {
                  var ids = aOwns.split(/\s+/);
                  var parts = [];
                  for (var i = 0; i < ids.length; i++) {
                    var element = document.getElementById(ids[i]);
                    // Abort processing if the referenced node has already been traversed
                    if (element && owns.indexOf(ids[i]) === -1) {
                      owns.push(ids[i]);
                      var oBy = { ref: ownedBy, top: ownedBy.top };
                      oBy[ids[i]] = {
                        refNode: refNode,
                        node: node,
                        target: element
                      };
                      if (!isParentHidden(element, document.body, true)) {
                        parts.push(
                          walk(element, true, skip, [], false, oBy).name
                        );
                      }
                    }
                  }
                  // Join without adding whitespace since this is already handled by parsing individual nodes within the algorithm steps.
                  ariaO = parts.join("");
                }
              }

              // Otherwise, process text node
              else if (node.nodeType === 3) {
                name = node.data;
              }

              // Prepend and append the current CSS pseudo element text, plus normalize all whitespace such as newline characters and others into flat spaces.
              name = cssO.before + name.replace(/\s+/g, " ") + cssO.after;

              if (
                name.length &&
                !hasParentLabelOrHidden(
                  node,
                  ownedBy.top,
                  ownedBy,
                  ignoreHidden
                )
              ) {
                result.name = name;
              }

              result.owns = ariaO;

              return result;
            },
            refNode
          );

          // Prepend and append the refObj CSS pseudo element text, plus normalize whitespace chars into flat spaces.
          fullResult.name =
            cssOP.before + fullResult.name.replace(/\s+/g, " ") + cssOP.after;

          return fullResult;
        };

        var getRole = function(node) {
          var role = node && node.getAttribute ? node.getAttribute("role") : "";
          if (!trim(role)) {
            return "";
          }
          var inList = function(list) {
            return trim(role).length > 0 && list.roles.indexOf(role) >= 0;
          };
          var roles = role.split(/\s+/);
          for (var i = 0; i < roles.length; i++) {
            role = roles[i];
            if (
              inList(list1) ||
              inList(list2) ||
              inList(list3) ||
              presentationRoles.indexOf(role) !== -1
            ) {
              return role;
            }
          }
          return "";
        };

        var isFocusable = function(node) {
          var nodeName = node.nodeName.toLowerCase();
          if (node.getAttribute("tabindex")) {
            return true;
          }
          if (nodeName === "a" && node.getAttribute("href")) {
            return true;
          }
          if (
            ["button", "input", "select", "textarea"].indexOf(nodeName) !==
              -1 &&
            node.getAttribute("type") !== "hidden"
          ) {
            return true;
          }
          return false;
        };

        // ARIA Role Exception Rule Set 1.1
        // The following Role Exception Rule Set is based on the following ARIA Working Group discussion involving all relevant browser venders.
        // https://lists.w3.org/Archives/Public/public-aria/2017Jun/0057.html

        // Always include name from content when the referenced node matches list1, as well as when child nodes match those within list3
        // Note: gridcell was added to list1 to account for focusable gridcells that match the ARIA 1.0 paradigm for interactive grids.
        var list1 = {
          roles: [
            "button",
            "checkbox",
            "link",
            "option",
            "radio",
            "switch",
            "tab",
            "treeitem",
            "menuitem",
            "menuitemcheckbox",
            "menuitemradio",
            "cell",
            "gridcell",
            "columnheader",
            "rowheader",
            "tooltip",
            "heading"
          ],
          tags: [
            "a",
            "button",
            "summary",
            "input",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "menuitem",
            "option",
            "td",
            "th"
          ]
        };
        // Never include name from content when current node matches list2
        var list2 = {
          roles: [
            "application",
            "alert",
            "log",
            "marquee",
            "timer",
            "alertdialog",
            "dialog",
            "banner",
            "complementary",
            "form",
            "main",
            "navigation",
            "region",
            "search",
            "article",
            "document",
            "feed",
            "figure",
            "img",
            "math",
            "toolbar",
            "menu",
            "menubar",
            "grid",
            "listbox",
            "radiogroup",
            "textbox",
            "searchbox",
            "spinbutton",
            "scrollbar",
            "slider",
            "tablist",
            "tabpanel",
            "tree",
            "treegrid",
            "separator"
          ],
          tags: [
            "article",
            "aside",
            "body",
            "select",
            "datalist",
            "optgroup",
            "dialog",
            "figure",
            "footer",
            "form",
            "header",
            "hr",
            "img",
            "textarea",
            "input",
            "main",
            "math",
            "menu",
            "nav",
            "section"
          ]
        };
        // As an override of list2, conditionally include name from content if current node is focusable, or if the current node matches list3 while the referenced parent node matches list1.
        var list3 = {
          roles: [
            "term",
            "definition",
            "directory",
            "list",
            "group",
            "note",
            "status",
            "table",
            "rowgroup",
            "row",
            "contentinfo"
          ],
          tags: [
            "dl",
            "ul",
            "ol",
            "dd",
            "details",
            "output",
            "table",
            "thead",
            "tbody",
            "tfoot",
            "tr"
          ]
        };

        var nativeFormFields = ["button", "input", "select", "textarea"];
        var rangeWidgetRoles = ["scrollbar", "slider", "spinbutton"];
        var editWidgetRoles = ["searchbox", "textbox"];
        var selectWidgetRoles = [
          "grid",
          "listbox",
          "tablist",
          "tree",
          "treegrid"
        ];
        var otherWidgetRoles = [
          "button",
          "checkbox",
          "link",
          "switch",
          "option",
          "menu",
          "menubar",
          "menuitem",
          "menuitemcheckbox",
          "menuitemradio",
          "radio",
          "tab",
          "treeitem",
          "gridcell"
        ];
        var presentationRoles = ["presentation", "none"];

        var hasGlobalAttr = function(node) {
          var globalPropsAndStates = [
            "busy",
            "controls",
            "current",
            "describedby",
            "details",
            "disabled",
            "dropeffect",
            "errormessage",
            "flowto",
            "grabbed",
            "haspopup",
            "invalid",
            "keyshortcuts",
            "live",
            "owns",
            "roledescription"
          ];
          for (var i = 0; i < globalPropsAndStates.length; i++) {
            var a = trim(node.getAttribute("aria-" + globalPropsAndStates[i]));
            if (a) {
              return true;
            }
          }
          return false;
        };

        var isHidden = function(node, refNode) {
          var hidden = function(node) {
            if (node.nodeType !== 1 || node == refNode) {
              return false;
            }
            if (node.getAttribute("aria-hidden") === "true") {
              return true;
            }
            if (node.getAttribute("hidden")) {
              return true;
            }
            var style = getStyleObject(node);
            if (
              style["display"] === "none" ||
              style["visibility"] === "hidden"
            ) {
              return true;
            }
            return false;
          };
          return hidden(node);
        };

        var isParentHidden = function(node, refNode, skipOwned, skipCurrent) {
          var trackNodes = [];
          while (node && node !== refNode) {
            if (
              !skipCurrent &&
              node.nodeType === 1 &&
              isHidden(node, refNode)
            ) {
              return true;
            } else skipCurrent = false;
            node = node.parentNode;
          }
          return false;
        };

        var getStyleObject = function(node) {
          var style = {};
          if (document.defaultView && document.defaultView.getComputedStyle) {
            style = document.defaultView.getComputedStyle(node, "");
          } else if (node.currentStyle) {
            style = node.currentStyle;
          }
          return style;
        };

        var cleanCSSText = function(node, text) {
          var s = text;
          if (s.indexOf("attr(") !== -1) {
            var m = s.match(/attr\((.|\n|\r\n)*?\)/g);
            for (var i = 0; i < m.length; i++) {
              var b = m[i].slice(5, -1);
              b = node.getAttribute(b) || "";
              s = s.replace(m[i], b);
            }
          }
          return s || text;
        };

        var isBlockLevelElement = function(node, cssObj) {
          var styleObject = cssObj || getStyleObject(node);
          for (var prop in blockStyles) {
            var values = blockStyles[prop];
            for (var i = 0; i < values.length; i++) {
              if (
                styleObject[prop] &&
                ((values[i].indexOf("!") === 0 &&
                  [values[i].slice(1), "inherit", "initial", "unset"].indexOf(
                    styleObject[prop]
                  ) === -1) ||
                  styleObject[prop].indexOf(values[i]) !== -1)
              ) {
                return true;
              }
            }
          }
          if (
            !cssObj &&
            node.nodeName &&
            blockElements.indexOf(node.nodeName.toLowerCase()) !== -1
          ) {
            return true;
          }
          return false;
        };

        // CSS Block Styles indexed from:
        // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
        var blockStyles = {
          display: ["block", "grid", "table", "flow-root", "flex"],
          position: ["absolute", "fixed"],
          float: ["left", "right", "inline"],
          clear: ["left", "right", "both", "inline"],
          overflow: ["hidden", "scroll", "auto"],
          "column-count": ["!auto"],
          "column-width": ["!auto"],
          "column-span": ["all"],
          contain: ["layout", "content", "strict"]
        };

        // HTML5 Block Elements indexed from:
        // https://github.com/webmodules/block-elements
        // Note: 'br' was added to this array because it impacts visual display and should thus add a space .
        // Reference issue: https://github.com/w3c/accname/issues/4
        // Note: Added in 1.13, td, th, tr, and legend
        var blockElements = [
          "address",
          "article",
          "aside",
          "blockquote",
          "br",
          "canvas",
          "dd",
          "div",
          "dl",
          "dt",
          "fieldset",
          "figcaption",
          "figure",
          "footer",
          "form",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "header",
          "hgroup",
          "hr",
          "legend",
          "li",
          "main",
          "nav",
          "noscript",
          "ol",
          "output",
          "p",
          "pre",
          "section",
          "table",
          "td",
          "tfoot",
          "th",
          "tr",
          "ul",
          "video"
        ];

        var getObjectValue = function(
          role,
          node,
          isRange,
          isEdit,
          isSelect,
          isNative
        ) {
          var val = "";
          var bypass = false;

          if (isRange && !isNative) {
            val =
              node.getAttribute("aria-valuetext") ||
              node.getAttribute("aria-valuenow") ||
              "";
          } else if (isEdit && !isNative) {
            val = getText(node) || "";
          } else if (isSelect && !isNative) {
            var childRoles = [];
            if (role == "grid" || role == "treegrid") {
              childRoles = ["gridcell", "rowheader", "columnheader"];
            } else if (role == "listbox") {
              childRoles = ["option"];
            } else if (role == "tablist") {
              childRoles = ["tab"];
            } else if (role == "tree") {
              childRoles = ["treeitem"];
            }
            val = joinSelectedParts(
              node,
              node.querySelectorAll('*[aria-selected="true"]'),
              false,
              childRoles
            );
            bypass = true;
          }
          val = trim(val);
          if (!val && (isRange || isEdit) && node.value) {
            val = node.value;
          }
          if (!bypass && !val && isNative) {
            if (isSelect) {
              val = joinSelectedParts(
                node,
                node.querySelectorAll("option[selected]"),
                true
              );
            } else {
              val = node.value;
            }
          }

          return val;
        };

        var addSpacing = function(s) {
          return trim(s).length ? " " + s + " " : " ";
        };

        var joinSelectedParts = function(node, nOA, isNative, childRoles) {
          if (!nOA || !nOA.length) {
            return "";
          }
          var parts = [];
          for (var i = 0; i < nOA.length; i++) {
            var role = getRole(nOA[i]);
            var isValidChildRole =
              !childRoles || childRoles.indexOf(role) !== -1;
            if (isValidChildRole) {
              parts.push(
                isNative
                  ? getText(nOA[i])
                  : walk(nOA[i], true, false, [], false, { top: nOA[i] }).name
              );
            }
          }
          return parts.join(" ");
        };

        var getPseudoElStyleObj = function(node, position) {
          var styleObj = {};
          for (var prop in blockStyles) {
            styleObj[prop] = document.defaultView
              .getComputedStyle(node, position)
              .getPropertyValue(prop);
          }
          styleObj["content"] = document.defaultView
            .getComputedStyle(node, position)
            .getPropertyValue("content")
            .replace(/^\"|\\|\"$/g, "");
          return styleObj;
        };

        var getText = function(node, position) {
          if (!position && node.nodeType === 1) {
            return node.innerText || node.textContent || "";
          }
          var styles = getPseudoElStyleObj(node, position);
          var text = styles["content"];
          if (!text || text === "none") {
            return "";
          }
          if (isBlockLevelElement({}, styles)) {
            if (position == ":before") {
              text += " ";
            } else if (position == ":after") {
              text = " " + text;
            }
          }
          return text;
        };

        var getCSSText = function(node, refNode) {
          if (
            (node && node.nodeType !== 1) ||
            node == refNode ||
            ["input", "select", "textarea", "img", "iframe"].indexOf(
              node.nodeName.toLowerCase()
            ) !== -1
          ) {
            return { before: "", after: "" };
          }
          if (document.defaultView && document.defaultView.getComputedStyle) {
            return {
              before: cleanCSSText(node, getText(node, ":before")),
              after: cleanCSSText(node, getText(node, ":after"))
            };
          } else {
            return { before: "", after: "" };
          }
        };

        var getParent = function(node, nTag) {
          while (node) {
            node = node.parentNode;
            if (node && node.nodeName && node.nodeName.toLowerCase() == nTag) {
              return node;
            }
          }
          return {};
        };

        var hasParentLabelOrHidden = function(
          node,
          refNode,
          ownedBy,
          ignoreHidden
        ) {
          var trackNodes = [];
          while (node && node !== refNode) {
            if (
              node.id &&
              ownedBy &&
              ownedBy[node.id] &&
              ownedBy[node.id].node &&
              trackNodes.indexOf(node) === -1
            ) {
              trackNodes.push(node);
              node = ownedBy[node.id].node;
            } else {
              node = node.parentNode;
            }
            if (node && node.getAttribute) {
              if (
                trim(node.getAttribute("aria-label")) ||
                (!ignoreHidden && isHidden(node, refNode))
              ) {
                return true;
              }
            }
          }
          return false;
        };

        var trim = function(str) {
          if (typeof str !== "string") {
            return "";
          }
          return str.replace(/^\s+|\s+$/g, "");
        };

        if (isParentHidden(node, document.body, true)) {
          return props;
        }

        // Compute accessible Name and Description properties value for node
        var accProps = walk(node, false, false, [], false, { top: node });

        var accName = trim(accProps.name.replace(/\s+/g, " "));
        var accDesc = trim(accProps.title.replace(/\s+/g, " "));

        if (accName === accDesc) {
          // If both Name and Description properties match, then clear the Description property value.
          accDesc = "";
        }

        props.name = accName;
        props.desc = accDesc;

        // Clear track variables
        nodes = [];
        owns = [];

        if (fnc && typeof fnc == "function") {
          return fnc.apply(node, [node, props]);
        } else {
          return props;
        }
      };

      var accNames = document.querySelectorAll(
        'textarea, input, select, button, a[href], progress, *[role="button"], *[role="checkbox"], *[role="link"], *[role="searchbox"], *[role="scrollbar"], *[role="slider"], *[role="spinbutton"], *[role="switch"], *[role="textbox"], *[role="combobox"], *[role="option"], *[role="menuitem"], *[role="menuitemcheckbox"], *[role="menuitemradio"], *[role="radio"], *[role="tab"], *[role="treeitem"], h1, h2, h3, h4, h5, h6, *[role="heading"], ul[aria-labelledby], ol[aria-labelledby], *[role="list"][aria-labelledby], *[role="directory"][aria-labelledby], ul[aria-label], ol[aria-label], *[role="list"][aria-label], *[role="directory"][aria-label], table[aria-labelledby], *[role="table"][aria-labelledby], *[role="grid"][aria-labelledby], *[role="treegrid"][aria-labelledby], table[aria-label], *[role="table"][aria-label], *[role="grid"][aria-label], *[role="treegrid"][aria-label], *[role="row"][aria-labelledby], *[role="row"][aria-label], *[role="cell"], *[role="gridcell"], th, *[role="columnheader"], *[role="rowheader"], *[role="alertdialog"][aria-labelledby], dialog[aria-labelledby], *[role="dialog"][aria-labelledby], *[role="alertdialog"][aria-label], dialog[aria-label], *[role="dialog"][aria-label], header[aria-labelledby], *[role="banner"][aria-labelledby], aside[aria-labelledby], *[role="complementary"][aria-labelledby], footer[aria-labelledby], *[role="contentinfo"][aria-labelledby], header[aria-label], *[role="banner"][aria-label], aside[aria-label], *[role="complementary"][aria-label], footer[aria-label], *[role="contentinfo"][aria-label], form[aria-labelledby], *[role="form"][aria-labelledby], form[aria-label], *[role="form"][aria-label], main[aria-labelledby], *[role="main"][aria-labelledby], nav[aria-labelledby], *[role="navigation"][aria-labelledby], main[aria-label], *[role="main"][aria-label], nav[aria-label], *[role="navigation"][aria-label], section[aria-labelledby], section[aria-label], *[role="region"][aria-labelledby], *[role="search"][aria-labelledby], *[role="article"][aria-labelledby], *[role="definition"][aria-labelledby], *[role="document"][aria-labelledby], *[role="feed"][aria-labelledby], *[role="figure"][aria-labelledby], *[role="img"][aria-labelledby], *[role="math"][aria-labelledby], *[role="note"][aria-labelledby], *[role="application"][aria-labelledby], *[role="region"][aria-label], *[role="search"][aria-label], *[role="article"][aria-label], *[role="definition"][aria-label], *[role="document"][aria-label], *[role="feed"][aria-label], *[role="figure"][aria-label], *[role="img"][aria-label], *[role="math"][aria-label], *[role="note"][aria-label], *[role="application"][aria-label], *[role="log"][aria-labelledby], *[role="marquee"][aria-labelledby], *[role="status"][aria-labelledby], *[role="timer"][aria-labelledby], *[role="log"][aria-label], *[role="marquee"][aria-label], *[role="status"][aria-label], *[role="timer"][aria-label], *[role="toolbar"][aria-labelledby], *[role="group"][aria-labelledby], *[role="listbox"][aria-labelledby], *[role="menu"][aria-labelledby], *[role="menubar"][aria-labelledby], *[role="toolbar"][aria-label], *[role="group"][aria-label], *[role="listbox"][aria-label], *[role="menu"][aria-label], *[role="menubar"][aria-label], *[role="radiogroup"][aria-labelledby], *[role="tree"][aria-labelledby], *[role="tablist"][aria-labelledby], *[role="tabpanel"][aria-labelledby], *[role="radiogroup"][aria-label], *[role="tree"][aria-label], *[role="tablist"][aria-label], *[role="tabpanel"][aria-label]'
      );

      for (var aN = 0; aN < accNames.length; aN++) {
        calcNames(
          accNames[aN],
          function(node, props) {
            if (
              " input textarea img progress ".indexOf(
                " " + node.nodeName.toLowerCase() + " "
              ) !== -1
            ) {
              node.parentNode.setAttribute("data-ws-bm-name-prop", props.name);

              node.parentNode.setAttribute("data-ws-bm-desc-prop", props.desc);
            } else {
              node.setAttribute("data-ws-bm-name-prop", props.name);

              node.setAttribute("data-ws-bm-desc-prop", props.desc);
            }
          },
          true
        );
      }

      setTimeout(checkNames, 5000);
    };

    setTimeout(checkNames, 5000);

    if (!useOffline) {
      loaded = {
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

      var loadCSS = function(file, i) {
        if (!loader.cssLinks) loader.cssLinks = [];
        var l = document.createElement("link");
        l.type = "text/css";
        l.rel = "stylesheet";
        l.href = basePath + file;
        l.id = "ws-visual-aria-" + i;
        loader.cssLinks.push(l);
        document.head.appendChild(l);
      };
    }

    check();

    bind(document.body, "mousedown", function(ev) {
      if (ev.shiftKey && ev.ctrlKey) {
        var targ = null;

        if (!ev) ev = window.event;

        if (ev.target) targ = ev.target;
        else if (ev.srcElement) targ = ev.srcElement;

        if (targ.nodeType == 3) targ = targ.parentNode;
        var getClosestRole = function(o) {
          while (o) {
            var r = o.getAttribute("role");

            if (
              r &&
              " rowgroup row columnheader rowheader menuitem menuitemcheckbox menuitemradio group ".indexOf(
                " " + r + " "
              ) === -1
            ) {
              if (r == "option") r = "listbox";
              else if (r == "radio") r = "radiogroup";
              else if (r == "tab" || r == "tabpanel") r = "tablist";
              else if (r == "treeitem") r = "tree";
              return r;
            }
            o = o.parentNode;
          }
          return null;
        };
        var role = getClosestRole(targ),
          rmo = window.VisualARIAMatrices;

        if (role && rmo.nodeType === 1)
          rmo.href = "http://whatsock.com/training/matrices/#" + role;

        if (rmo.nodeType === 1) rmo.click();
      }
    });
  };

  setTimeout(function() {
    WSBMInit(true, useOffline, basePath, msInterval, document);
  }, 3000);

  if (!document.getElementById("ws-bm-aria-matrices-lnk")) {
    var m = document.createElement("span");
    m.innerHTML =
      '<span id="ws-bm-aria-matrices-lnk" style="text-align: center; position: fixed; top: 0; right: 0;padding: 3px; border: 1px solid #dedede; background: #f5f5f5; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#f9f9f9\', endColorstr=\'#f0f0f0\'); background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0)); background: -moz-linear-gradient(top,  #f9f9f9, #f0f0f0); border-color: #000; -webkit-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; -moz-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb;" onmouseenter="window.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIAToggle.innerHTML=getVisualARIAStatus().long;" onmouseleave="window.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIAToggle.innerHTML=getVisualARIAStatus().short;"><a id="ws-bm-aria-matrices-lnk-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" target="ws_aria_role_matrices" onmouseover="this.href=\'http://whatsock.com/training/matrices/\';" onclick="this.href=\'http://whatsock.com/training/matrices/\';" onfocus="window.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIAToggle.innerHTML=getVisualARIAStatus().long;" onblur="window.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIAToggle.innerHTML=getVisualARIAStatus().short;" href="http://whatsock.com/training/matrices/" aria-label="ARIA Role Matrices">?</a><br /><a id="ws-bm-aria-matrices-toggle-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" onclick="toggleVisualARIA(); return false;" onfocus="window.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIAToggle.innerHTML=getVisualARIAStatus().long;" onblur="window.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIAToggle.innerHTML=getVisualARIAStatus().short;" href="#" aria-label="Unload Visual ARIA">X</a> </span>';
    document.body.appendChild(m);
    window.VisualARIAMatrices = document.getElementById(
      "ws-bm-aria-matrices-lnk-a"
    );
    window.VisualARIAToggle = document.getElementById(
      "ws-bm-aria-matrices-toggle-a"
    );
  }
})();
