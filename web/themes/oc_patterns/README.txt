
ABOUT OC BASE THEME
------------

Open Citizen Base Theme (oc_base) is a starter theme by Electric Citizen, http://www.electriccitizen.com. 

For Drupal 8, oc_base uses Drupal's Stable as its base theme; Stable provides minimal markup and very few CSS classes. 

oc_base provides a bare minimum of sensible defaults for all themes. For each site, a subtheme (oc_patterns) should be used for any theming specific to the site you are working on (not global to every site).


GETTING STARTED
--------------------

Working with oc_base requires a few things: 
(a) working knowledge of Sass
(b) knowledge of Susy or Singularity (if working with grids and layout)
(c) use of the command line (e.g. Terminal) and a good IDE (e.g. Sublime Text)

To get started:
(a) git clone the theme to your local machine
(b) Install npm globally, https://docs.npmjs.com/getting-started/installing-node) 
(c) Install gulp globally, "sudo npm install -g gulp"
(c) navigate in the command line window to the folder for oc_base
(d) run the command, "npm install"

Working: 
(a) Locaate the sass files (inside the /src folder)
(b) navigate in the command line window to the folder for oc_base
(c) Type the command "gulp"

-- This will trigger many things. Sass files will be monitored for changes and compile to CSS files as needed. BrowserSync will open a window in Chrome and Firefox

Other notes:
-- for each site, syncConfig.json needs to edited to include the correct URL for your local site. The browsers that get auto opened can be altered (by default it is Chrome and Firefox), or disabled entirely. Add this file to your .gitignore and do not commit it back to the repo.



ABOUT OUR THEMING
--------------------

For more information, see Electric Citizen's theming guide for Drupal 8.
<insert link>
