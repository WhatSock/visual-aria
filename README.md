# visual-aria - Revision 01/03/2018
Visual ARIA allows engineers, testers, educators, and students to physically observe ARIA usage within web technologies, including ARIA 1.1 structural, live region, and widget roles, proper nesting and focus management, plus requisite and optional supporting attributes to aid in development.

Visual ARIA
========

ARIA stands for Accessible Rich Internet Applications, and is a technical specification published by the World Wide Web Consortium (W3C) Web Accessibility Initiative (WAI).

One of the greatest challenges regarding ARIA and how to reliably learn to use it, is that ARIA is an invisible technology. Mainstream observers literally cannot see where ARIA is applied, nor when issues are caused as a result of its use. As a result, the process of ARIA education is solely dictated by individuals, their singular understanding of assistive technologies, which browser they are using, which operating system they are using, and the current level of combined support between the operating system, the browser, and the assistive technology, all of which differ significantly when combined in different variations. Thus all ARIA education is skewed by personal subjectivity, perpetually propagating misinformation when key concepts are misunderstood. This makes ARIA education impossible to scale equally across all businesses, agencies, and academic institutions, because all such education is subjective (qualitative) and not objective (quantitative) as it must be.

To solve this, there needs to be a scientifically precise methodology for learning ARIA that is not based on individual subjectivity, but rather, on that of role usage conformance according to the spec in order to achieve scalable objectivity for universal education. Visual ARIA solves this problem by reliably teaching the accessible use of ARIA through experimentation and experiential learning. Thus all mainstream observers can physically see the effects of ARIA usage equally, while also learning ARIA role usage conformance based on consistent testable mapping algorithms.

Visual ARIA allows engineers, testers, educators, and students to physically observe ARIA usage within web technologies, including ARIA 1.1 structural, live region, and widget roles, proper nesting and focus management, plus requisite and optional supporting attributes to aid in development.

Distributed under the terms of the Open Source Initiative OSI - MIT License.

Developed and maintained by: Bryan Garaventa https://www.linkedin.com/in/bgaraventa
Or on Twitter at https://twitter.com/bryanegaraventa

Visual ARIA Browser Extensions
-----

The Visual ARIA browser extensions can be used to run Visual ARIA offline for local file access during agile development, or from within private intranets that don't allow public internet access.

* Mozilla: https://addons.mozilla.org/en-US/firefox/addon/visual-aria/
* Chrome: https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-GB

Note: Visual ARIA browser extensions are developed by Laurence Lewis: https://www.linkedin.com/in/laurence-lewis-77520365/ 
Or on Twitter at https://twitter.com/Laurence_Lewis 
Visual ARIA browser extension support or bug reports should be sent to extensions@a11ycats.com.au 

Project home:
-----

http://whatsock.com/training/matrices/visual-aria.htm

Download File and Folder Descriptions
-----

* Using Visual ARIA to Physically See and Learn How ARIA Works.pdf : CSUN presentation printout.
* docs\* : Example and exercise materials for illustrating Visual ARIA functionality, plus the complete source code for Visual ARIA within the folder 'docs\visual-aria' for use within offline projects or internal server hosting behind corporate firewalls.
* Additional ARIA Resources : Useful resources for learning how ARIA works, how it impacts the accessibility tree within browsers, which ARIA roles are safe to use within specific circumstances, etc.

How Visual ARIA Works
-----

The JavaScript for Visual ARIA is first loaded using roles.js, which then dynamically loads all relevant CSS files that comprise the cascading logic for Visual ARIA.

Configuration settings can be modified at the top of roles.js to set the base local or remote folder path, plus the millisecond delay for evaluating the text alternative computation and role monitoring sequence for the dynamic loader. Visual ARIA will recursively load itself into nested iframe documents when permitted by the browser's same-origin policy.

Instructions
-----

1. Open the files within the Files folder in sequence using the numbered HTM files.

2. Load Visual ARIA using either the local copy or the public bookmarklet.
http://whatsock.com/training/matrices/visual-aria.htm

An alternate public bookmarklet script is also available within this archive, which provides direct GitHub repository referencing which will always reflect the most recent Visual ARIA updates.
https://accdc.github.io/visual-aria/github-bookmarklet/visual-aria.htm

3. Observe the new information displayed that conveys where ARIA is being used.

4. Hover the mouse over various elements and observe the Name and Description computation that is displayed for interactive widget roles. This matches the naming computation described at
https://www.levelaccess.com/how-the-w3c-text-alternative-computation-works/

5. Use the keyboard to set focus to interactive widgets and observe how Visual ARIA conveys additional information for the element that has focus, especially when focus is set on the same elements that include ARIA roles.

How to Interpret Visual ARIA Feedback
-----

When observing interactive widget roles, the colors for Visual ARIA will change depending on the circumstances of interaction. For example, When adding the attribute role="button" to an element, it will convey an orange color on black background, but when focus is set on the same element, it will turn green on a white background to convey that the correct element has focus. Additionally, if the wrong element has focus, such as setting focus to an element inside of an element with role="button", a red color on yellow background will be used to convey an incorrect use of ARIA that may result in accessibility issues for assistive technology users.

Moreover, when interactive widget roles are used and focus is set to one such element, Visual ARIA will suggest keyboard interactions that match the design paradigm for that widget type. In the case of role="button" for example, Visual ARIA will suggest that Space and Enter should activate, and in the case of single tab stop widget roles such as role="radio", role="tab", role="menuitem", role="option", and so on, Visual ARIA will then suggest that the arrow keys should be used to move focus.

This is meant to guide education and development regarding the accompanying scripting behaviors that should be used when building interactive widgets, thus matching all of the ARIA 1.1 role usage algorithms documented at http://whatsock.com/training/matrices/ .

The files within this archive may be modified and changed to try out different ARIA roles, which is an encapsulated testing environment for experimenting with ARIA role usage.

Additional instructions and color combination details are available at
http://whatsock.com/training/matrices/visual-aria.htm#instructions-for-use

Related projects:
-----

The ARIA Role Conformance Matrices: https://github.com/accdc/aria-matrices

The Accessibility Tree - A Training Guide for Advanced Web Development: https://github.com/accdc/training

AccDC API
Standalone: https://github.com/accdc/accdc
For jQuery: https://github.com/accdc/accdc-jquery
For Dojo: https://github.com/accdc/accdc-dojo
For MooTools: https://github.com/accdc/accdc-mootools

AccDC Bootstrap
Standalone: https://github.com/accdc/bootstrap
For jQuery: https://github.com/accdc/bootstrap-jquery
For Dojo: https://github.com/accdc/bootstrap-dojo
For MooTools: https://github.com/accdc/bootstrap-mootools

AccDC Technical Style Guide and Coding Arena
For AccDC Standalone and jQuery: https://github.com/accdc/tsg
For Dojo: https://github.com/accdc/tsg-dojo
For MooTools: https://github.com/accdc/tsg-mootools
