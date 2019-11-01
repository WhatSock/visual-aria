(call prettier --write "./docs/visual-aria/roles.uncompressed.js")
(call uglifyjs "./docs/visual-aria/roles.uncompressed.js" --comments /^!/ --compress --mangle --output "./docs/visual-aria/roles.js")
(call prettier --write "./**/{setup.js,radios.js}")
(call js-beautify -r --type="html" "./**/*.{htm,html}")