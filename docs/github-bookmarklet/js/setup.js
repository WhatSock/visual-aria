(function() {
  $A.bind(window, "load", function() {
    $A.bind("p.topLink > a", "click", function(ev) {
      $A.setFocus($A.query("h1")[0]);
      ev.preventDefault();
    });

    $A.bind("#mlto", {
      click: function(ev) {
        this.href = "mailto:bryan.garaventa@whatsock.com";
      },
      blur: function(ev) {
        this.href = "#";
      }
    });

    // Generate permalinks
    $A.query("h2, h3, h4, h5, h6", function(i, o) {
      if (!$A.hasClass(o, "nopermalink")) {
        var d = o.parentNode,
          a = $A.createEl(
            "a",
            {
              href:
                (isVisualARIA
                  ? "http://whatsock.com/training/matrices/visual-aria.htm#"
                  : "http://whatsock.com/training/matrices/#") + d.id,
              title:
                "Permalink: " +
                (isVisualARIA
                  ? "http://whatsock.com/training/matrices/visual-aria.htm#"
                  : "http://whatsock.com/training/matrices/#") +
                d.id,
              "aria-label":
                "Permalink: " +
                (isVisualARIA
                  ? "http://whatsock.com/training/matrices/visual-aria.htm#"
                  : "http://whatsock.com/training/matrices/#") +
                d.id
            },
            null,
            "permalink"
          );

        a.innerHTML = '<span aria-hidden="true">#</span>';
        d.appendChild(a);
        $A.css(a, "left", -a.offsetWidth);
      }
    });

    if ($A.getEl("ph")) createHeaderNav();

    if ($A.getEl("tocBtn")) generateTOC();
  });

  if (top != window)
    top.location.href = "http://whatsock.com/training/matrices/";

  var hds = {},
    createHeaderNav = function() {
      var ph = $A.getEl("ph"),
        hs = $A.query("div.hd > h2");
      hds = {};

      for (var i = 0; i < hs.length; i++) {
        var h = hs[i];

        if (ph && h.className !== "skip") {
          h.id = "H" + $A.genId();
          var a = $A.createEl(
            "a",
            {
              href: "#"
            },
            null,
            h.id,
            document.createTextNode($A.getText(h))
          );

          ph.appendChild(a);
          $A.setAttr(h, "tabindex", -1);
          hds[h.id] = h;
          $A.bind(a, "click", function(ev) {
            hds[this.className].focus();
            ev.preventDefault();
          });

          /*if (i < (hs.length - 1))
				ph.appendChild($A.createEl('span', null, null, null, document.createTextNode(' | ')));*/
        }
      }
    },
    generateTOC = function() {
      var links = [],
        pLevel = 0,
        map = {};

      $A.query("div.hd", document, function(i, o) {
        var heading = $A.query("h1, h2, h3, h4, h5, h6", o)[0],
          level = parseInt(heading.nodeName.substring(1)),
          a = $A.createEl("a", {
            href: "#" + o.id
          }),
          props = {
            hd: o,
            heading: heading,
            headingText: $A.getText(heading),
            level: level,
            map: {},
            a: a,
            li: $A.createEl("li")
          };

        if (level > 1) props.pSibling = map[level];

        if (!props.pSibling) props.ul = $A.createEl("ul");
        else if (props.pSibling) props.ul = props.pSibling.ul;

        if (level === 1) {
          map[1] = props;
          map[2] = map[3] = map[4] = map[5] = map[6] = null;
        } else if (level === 2) {
          map[2] = props;
          map[3] = map[4] = map[5] = map[6] = null;
        } else if (level === 3) {
          map[3] = props;
          map[4] = map[5] = map[6] = null;
        } else if (level === 4) {
          map[4] = props;
          map[5] = map[6] = null;
        } else if (level === 5) {
          map[5] = props;
          map[6] = null;
        } else if (level === 6) {
          map[6] = props;
        }

        for (var x = 1; x <= 6; x++) props.map[x] = map[x];
        a.innerHTML = props.headingText;
        props.li.appendChild(a);

        if (level > 1 && !props.pSibling)
          $A.setAttr(
            props.ul,
            "aria-label",
            props.map[level - 1].headingText.substring(
              props.level > 2
                ? props.map[level - 1].headingText.indexOf(": ") + 2
                : 1
            )
          );
        $A.internal.data(a, "props", props);
        links.push(a);
        pLevel = level;
      });

      var list = $A.createEl(
        "ul",
        {
          "aria-label": "Table of Contents"
        },
        {
          display: "none"
        }
      );

      $A.query(links, function(i, a) {
        var props = $A.internal.data(a, "props");

        if (props.level === 1) list.appendChild(props.li);
        else if (props.level > 1 && !props.pSibling && props.ul) {
          props.map[props.level - 1].li.appendChild(props.ul);
          props.ul.appendChild(props.li);
        } else if (props.level > 1 && props.pSibling && props.ul)
          props.ul.appendChild(props.li);
      });

      $A.getEl("tocDD").appendChild(list);

      $A.bind("#tocDD a", "click", function(ev) {
        $A.internal.data(this, "props").hd.focus();
        ev.preventDefault();
      });

      var isVisible = false;

      $A.bind("#tocBtn", "click", function(ev) {
        if (isVisible) isVisible = false;
        else isVisible = true;
        $A.setAttr(this, "aria-expanded", isVisible ? "true" : "false");
        $A[isVisible ? "addClass" : "remClass"](this, "pressed");
        $A.css(list, "display", isVisible ? "block" : "none");
        ev.preventDefault();
      });
    };
})();
