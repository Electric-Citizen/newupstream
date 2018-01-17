# EC8 Upstream

[![CircleCI](https://circleci.com/gh/electriccitizen/newupstream.svg?style=shield)](https://circleci.com/gh/electriccitizen/newupstream)
[![Dashboard newupstream](https://img.shields.io/badge/dashboard-newupstream-yellow.svg)](https://dashboard.pantheon.io/sites/cbc91b53-e053-4c27-8ad4-7502151a02ed#dev/code)
[![Dev Site newupstream](https://img.shields.io/badge/site-newupstream-blue.svg)](http://dev-newupstream.pantheonsite.io/)

Center for Inclusive Childcare is a Composer-based Drupal 8 application hosted on [Pantheon](http://dashboard.getpantheon.com). The application integrates with [Circle CI](https://circleci.com/dashboard) for continuous integration testing. All development and theming is done on a local virtual machine running [Drupal VM](http://drupalvm.com). Please review this README and be sure to understand the core concepts and workflow described below prior to beginning.

#### Onboarding and development

* [Getting started](#getting-started)
* [Requirements](#requirements)
* [Onboarding](#onboarding)
* [Workflow basics](#workflow-basics)
* [Local development and common tasks](#local-development-and-common-tasks)
  * [Making a simple change](#making-a-simple-change)
  * [Adding a new module](#adding-a-new-module)
  * [Theming basics](#theming-basics)
  * [Advanced theming](THEMING.md)

#### More information

* [Cheatsheet](#cheatsheet)
* [Available commands](#available-commands)
* [Suggested additions](#suggested-additions) (Performance, theming, Behat)
* [General tips](#general-tips)
* [Troubleshooting](#troubleshooting)
* [Linux/Windows](#linux-and-windows)
* [Support/Feedback](#support-and-feedback)

## Getting Started

This repository contains the project build files (composer.json, exported config, etc.), a custom theme, and any custom modules that have been added to the project. It does not contain Drupal core, vendor files, or contributed modules. This repository and its build files are used as the starting point for each build and deployment.

See the icon links at the top of this README for direct links to:

* ![Circle](https://circleci.com/gh/electriccitizen/newupstream.svg?style=shield) [Circle CI](https://circleci.com/gh/electriccitizen/newupstream) to diagnose builds (the build log usually indicates clearly why a build is failing.)
* ![Dashboard](https://img.shields.io/badge/dashboard-newupstream-yellow.svg) [Pantheon Dashboard](https://dashboard.pantheon.io/sites/4bf71429-83ad-4601-9cbc-b5e5b1b1c7a7#dev/code) to view or share the link to your ```multidev``` site.
* ![Dev](https://img.shields.io/badge/site-newupstream-blue.svg) [Development site](http://dev-newupstream.pantheonsite.io/): A quick link to the Pantheon development site.

Also see the [Drupal VM Dashboard](http://dashboard.newupstream.local) for error logs, MySQL/Adminer, and Mailhog.

[Back to top](#center-for-inclusive-childcare)

## Requirements

Make sure you have the basic skills necessary to effectively use this platform. You should have a solid understanding of the command line, configuration management for teams, git branching, pull requests, Composer/dependency management, and a CI-based deployment process. You will also need to have relatively up-to-date versions of the following components running on your local machine:

* [Git](https://git-scm.com/downloads)
* [Composer](https://getcomposer.org/doc/00-intro.md) ```composer self-update```
* PHP 5.6+ ```php --version```
* [Drush 8.1.1+](http://docs.drush.org/en/master/install/) ```drush version```
* [VirtualBox 5.1.x+](https://www.virtualbox.org/wiki/Downloads) ```vboxmanage --version```
* [Vagrant 1.8.6+](https://www.vagrantup.com/docs/installation/) ```vagrant --version```
* [Ansible 2.2+](http://docs.ansible.com/ansible/latest/intro_installation.html) ```ansible --version```

**Vagrant plugins**

Install following Vagrant plugins on your local machine:

```
vagrant plugin install vagrant-hostsupdater

vagrant plugin install vagrant-vbguest
```

See the Drupal VM [Quickstart Guide](https://github.com/geerlingguy/drupal-vm#quick-start-guide) for detailed instructions on installing any of the Drupal VM related requirements noted above. This build has been tested on Mac OS but others have reported success running Drupal VM on [Linux/Windows](#linux-and-windows) although you may need to do some additional steps to meet the requirements.

**Pantheon and Github accounts**

> You will also need both a Pantheon account and a Github account. Make sure both accounts have been added to the respective teams and that your public SSH key has been added to your profiles.

> * [Adding public key to Pantheon](https://pantheon.io/docs/ssh-keys/)
> * [Adding pubic key to Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)

> If you already have Pantheon and Github accounts with public keys in place (and they have been added to the appropriate teams for this project) you can skip this step.

[Back to top](#center-for-inclusive-childcare)

## Onboarding

Make sure your user account has been added to both the Github team and to the Pantheon team (with the proper roles/permissions) and that you have uploaded your public SSH key to your profile on both sites prior to beginning.

**Refresh your Pantheon alias file**

You can download and install the Pantheon alias files by clicking the ```Drush aliases``` link at the top of your Pantheon dashboard. Download the ```pantheon.aliases.drushrc.php```` file and place it your ```~/.drush``` folder. If you use Terminus you can do this automatically by authenticating and running:

```terminus aliases```

You can run ```drush @newupstream.dev status``` to verify you have the correct alias.


**Create a local alias:** The local ```@newupstream.local``` alias is generated automatically by the VM however we recommend creating your own copy so that you can run both aliases from anywhere within your ```<project-root>```. To use your own local alias, create a new alias file in your ```~/.drush``` folder called ```newupstream.local.aliases.drushrc.php``` and paste in the following code:

```
<?php

/**
* Drupal VM drush aliases.
*
* @see example.aliases.drushrc.php.
*/

$aliases['newupstream.local'] = array(
'uri' => 'newupstream.local',
'root' => '/var/www/newupstream/docroot',
'remote-host' => 'newupstream.local',
'remote-user' => 'vagrant',
'ssh-options' => '-o "SendEnv PHP_IDE_CONFIG PHP_OPTIONS XDEBUG_CONFIG" -o PasswordAuthentication=no -i "' . (getenv('VAGRANT_HOME') ?: drush_server_home() . '/.vagrant.d') . '/insecure_private_key"',
'path-aliases' => array(
  '%drush-script' => '/var/www/newupstream/vendor/drush/drush/drush',
),
);
```

The setup outlined above will allow you to run both aliases anywhere within your ```<project-root>``` instead of having to operate within your ```/docroot``` folder.


**On your local machine, clone the working repository:**

```
git clone git@github.com:electriccitizen/newupstream.git
```

**Install project dependencies:**

```
cd newupstream

composer install
```

**Build and start the virtual machine:**

```
vagrant up
```

This takes about 10 minutes but you only need to do it once. Sometimes the build will fail due to network errors or downtime at one of the external repositories. If your build fails you can try running:

```vagrant provision```

and it will often fix the build.

**Install the Drupal site:**

```
drush @newupstream.local site:install
```

You should now have a local environment in a 1:1 state with the development site including code, files, and database. The ```drush site:install``` command only needs to be run the first time you set up your local environment. When you need to refresh your local environment, you will run ```drush site:refresh``` instead (see below).

[Back to top](#center-for-inclusive-childcare)

## Workflow basics

* Primary development branch: ```master```
* Local drush alias: ```@newupstream.local```
* Local environment: DrupalVM
* Local URL: http://newupstream.local
* Local login: admin/admin
* Remote deploy branch: ```multidev``` (pull request into develop)
* Remote drush alias: ```@newupstream.dev```
* Remote URL: http://dev-newupstream.pantheonsite.io

Create a new ```working branch``` from ```master``` for each new task or issue. When you push your ```working branch``` to Github, the application builds itself on Circle CI and is automatically deployed to a Pantheon ```multidev``` environment. You will continue pushing to your ```working branch``` for additional QA, adjustments and fixes, or to diagnose any failing Circle CI tests.

Once everything is ready to deploy, submit a pull request on Github to merge your ```working branch``` into the ```master``` branch. A project maintainer will review your pull request and merge your changes into the upstream.

This triggers another build and the application is automatically deployed to the Pantheon development server if it passes all of the defined tests on Circle CI.

[Back to top](#center-for-inclusive-childcare)

## Local development and common tasks

Before beginning a new task, always make sure you are starting from a 1:1 state with the development server:

```
drush @newupstream.local site:refresh
```

You can run the ```site:refresh``` command at any time to reset your local environment. This command will automatically checkout the ```master``` branch but will not delete or alter any ```working branch``` you may have in place.

By default, ```site:refresh``` will sync both the database and files from ```development``` server. If you want to skip the database or file sync, you can pass arguments to ```site:refresh``` like so:

```
drush @newupstream.local site:refresh --nodb=1 --nofiles=1
```
[Back to top](#center-for-inclusive-childcare)

### Making a simple change

Always create and checkout a new ```working branch``` for your task on your local environment:

```
git branch <my_issue_or_fix>

git checkout <my_issue_or_fix>
```

Create a new ```working branch``` for each specific task or issue.  

**Make your changes in Drupal**

Change the site name, change the limit on a view, alter or create a content type, add a taxonomy, or make any other configuration change. If you are only changing theme files or custom modules files (and not altering any Drupal configuration), you should still use the deploy process outlined below.

**Export to your working branch**

When you are ready to push up your work for further QA or review, export the active configuration from your ```working branch``` and run a series of sanity checks to make sure your changes will still work against ```master```:

```
drush @newupstream.local site:export
```

The ```site:export``` command will export your active configuration to code (```drush cex sync```), merge the ```master``` branch into your ```working branch```, run a ```composer install```, and finally run a test import (```drush cim sync```) to verify that your changes will work against the latest ```master``` branch before checking out your ```working branch``` again to prepare for a git push.  

> The ```site:export``` command is designed to fail if there are problems. If you see any ```[error]``` output during the export, or your if it fails to merge ```master``` into your ```working branch```, you will need to manually fix merge conflicts or other errors prior to pushing them back to ```master```.

If you are working on a big task (or a branch that won’t be merged into ```master``` for a significant amount of time) you should run ```site:export``` often to ensure your ```working branch``` continues to work against ```master```.

**Commit and push your working branching**

If your ```site:export``` was successful with no errors, add any newly generated config files, commit your changes, and push your ```working branch``` to Github:

```
git add .

git commit -am "GW000: a descriptive message about your commit"

git push origin <your_working_branch>
```

Each time you push a new ```working branch```, it will automatically deploy a Pantheon ```multidev``` site for QA or further testing and review.

You can continue pushing changes to your ```working branch``` for as long as you need, and they will be deployed to your ```multidev``` site after each push to Github.

**Submit a Pull Request**

When your changes have been reviewed and have passed any additional QA steps, submit a new Github pull request to merge your ```working branch``` into the ```master``` branch.

A project maintainer will review your request and merge to trigger another Circle CI build; if the application continues to pass any defined tests it will deploy automatically to the Pantheon ```dev``` server.

**Start over and begin a new working branch**

Each time your work is successfully merged into ```master``` you should delete your local ```working branch``` and start fresh to get your local environment back into a 1:1 state with develop.

```
drush @newupstream.local site:refresh
```
[Back to top](#center-for-inclusive-childcare)

### Adding a new module

Remember to create and checkout a new working branch on your local environment:

```
git branch <add_contrib_module>

git checkout <add_contrib_module>
```

You create a new ```working branch``` for each specific task or issue and it will be merged into ```master``` via Github pull request when it is ready for deployment.

**Install your new module**

```
composer require drupal/<contrib_module>
```

**Enable and configure your module**

```
drush @newupstream.local en <contrib_module>
```
Configure your new module as needed via the Drupal UI.

**Export to your working branch**

When you are ready to push up your work for further QA or review, export your active config:

```
drush @newupstream.local site:export
```

**Commit and push your working branch**

If your ```site:export``` was successful with no errors, commit and push your ```working branch``` to Github:

```
git add .

git commit -am "GW000: a descriptive message about your commit"

git push origin <your_working_branch>
```
You can continue pushing changes to your ```working branch``` for as long as you need and they will be deployed to your ```multidev``` site after each push to Github.

**Submit a Pull Request**

When your changes have been reviewed and have passed any additional QA steps, submit a new Github pull request to merge your ```working branch``` into the ```master``` branch.

**Start over and begin a new working branch**

Each time your work is successfully merged into ```master``` you should delete your local ```working branch``` and start fresh to get your local environment back into a 1:1 state with develop.

```
drush @newupstream.local site:refresh
```
[Back to top](#center-for-inclusive-childcare)

## Theming basics

* We use npm and Pattern Lab to theme the site

* Make sure your version of node is at least 6.11.2 and your npm version is at least 5.5.1 (command can be run from anywhere):

```
node -v

npm -v
```

* To update node:

```
npm install -g n
```

* To update npm:

```
npm install npm@latest -g
```

**Install the node modules**
This command only needs to be run when you first install a local instance of the site.

```
cd /web/themes/oc_patterns
npm install
```

**Start Pattern Lab and Sass compilation**
This command is run from theme folder, and runs all theming Gulp tasks (Pattern Lab syncing, Sass Linting, Sass Compilation, SGV Sprite building and sprite mixins creation, and scss to YAML configuration for colors):
```
cd <your_project_root>/web/themes/oc_patterns

npm start
```

Once a change is saved in any Pattern Lab file, the change will be reflected in the local Pattern Lab instance (which will refresh automatically).  

If new files are added to the Pattern Lab components, or files are deleted, you must quit the start command in terminal and run it again for the new files structure to be detected.

```
<ctrl> + c

npm start
```

**Pattern Lab File locations**
All Pattern Lab files (twig, scss, and js) are located in oc_patterns/components. Most files used in both Pattern Lab and Drupal are located in the components/\_patterns file. Drupal specific js and some theme libraries can be found in components/js.

All Drupal templates are found in oc_patterns/templates. All custom templates are found in templates/zzz-custom.

We use an atomic approach to Pattern Lab file structure with Global elements for Pattern Lab and Drupal found in \_patterns/00-base. Small elements are found in \_patterns/00-atoms. Larger elements are found in \_patterns/02-molecules, \_patterns/03-organisms and \_patterns/04-pages. Drupal specifc high-level things and Pattern Lab specific styles are found in \_patterns/05-sitewide.

**Hiding files from Pattern Lab**
By default, any file in components/\_patterns is going to be shown in Pattern Lab. You can prevent files from being shown in Pattern Lab by preceding the file name with an underscore. The file will sitll be active, but it will not by displayed in the local Pattern Lab instance. This is handy for things like files that are extended straight into Drupal like \_html.twig.

[Back to top](#center-for-inclusive-childcare)

## Cheatsheet

Here are the basic commands to start and finish a new task:

```
drush @newupstream.local site:refresh

git branch <your_working_branch>

git checkout <your_working_branch>

[make some changes]

drush @newupstream.local site:export

git commit -am "description of your commit"

git push origin <your_working_branch>
```
As outlined above you can submit a pull request into ```master``` once your changes are approved and ready.

[Back to top](#center-for-inclusive-childcare)

## Available commands

The various build commands available for the project are simple wrappers that automatically issue a series of commands on the virtual machine and perform a series of sanity checks. For debugging or troubleshooting, you may need to run standard commands individually against the vm instead of relying on the wrappers.

```
drush site:install
```

The ```site:install``` command is typically only issued during onboarding. It makes sure you are on the current ```master``` branch, runs ```composer install```, and syncs your database and files from ```newupstream.dev``` to ```newupstream.local```.

```
drush site:refresh
```

The ```site:refresh``` command is used whenever you want to start a new ```working branch``` based on the current development server. It makes sure you are on the current ```master branch```, runs ```composer install```, and syncs your database and files from ```newupstream.dev``` to ```newupstream.local```. You can optionally choose to skip the file or database sync with ```--nofiles=1``` and ```--nodb=1```.

```
drush site:export
```

The ```site:export``` command is a fairly complex command used to export your active configuration to code and to perform a series of sanity checks against the ```master``` branch. It runs a ```drush cex sync``` to export your code, checks out and pulls the ```master``` branch, completes a merge of ```master``` back into your ```working branch```, runs a ```composer install``` to account for any new modules, and finally runs a ```drush cim sync``` as a final test. This command will generate errors (by design) when anything is amiss to prevent you from pushing bad changes to ```master```. Any errors or merge conflicts will need to be resolved prior to merging.

**Standard commands**

Note that you can run any standard drush command against your local environment for debugging and troubleshooting:

```
drush @newupstream.local cr all

drush sql-sync @newupstream.dev @newupstream.local

drush @newupstream.local cex sync

drush @newupstream.local cim sync

composer install

etc.
```
[Back to top](#center-for-inclusive-childcare)

## Suggested additions

**Prestissimo**

Install prestissimo globally in order to dramatically speed up Composer with parallel installs:

```
composer global require "hirak/prestissimo:^0.3"
```

**Local BEHAT testing**

If you want to run Behat tests on your local machine:

```
brew cask install java
brew install chromedriver
```

**Theme/Frontend**

To interact with the theme you will need NPM:

```
brew install npm nvm
```

[Back to top](#center-for-inclusive-childcare)

## General tips

* You can run individual commands at any time instead of using the ```site:[command]``` wrappers. This is often necessary for troubleshooting.

* If you are running into random issues, make sure to update to the latest versions of the requirements listed above unless otherwise noted in an issue queue.

* Keep your composer version up to date by running:

```
composer self-update
```
* If you run into random composer issues such as missing vendor files after running ```composer install``` try clearing your composer cache:

```
composer clear-cache
```
[Back to top](#center-for-inclusive-childcare)

## Troubleshooting

**Drush alias problems**

You should have a ```@newupstream.local``` and a ```@newupstream.dev``` alias available immediately after running ```vagrant up```. If your aliases are not working, first:

* Make sure you are in the ```web``` folder of your project root

* If still not working try the following:

  * Download and install a new alias file from your Pantheon dashboard into your ```~/.drush``` folder

  * Try the following aliases instead of ```@newupstream.dev```:

  ```@pantheon.newupstream.dev```

**PHP Memory Limit**

If you run into PHP memory errors during any of the build or deployment steps make sure your command line (CLI) version of PHP has sufficient memory. You can use the following command to up your memory limit:

```
open -a TextEdit $(php -i | grep "Loaded Configuration File" | cut -d" " -f 5)
```

And in your php.ini file change or set your memory limit to:

```
memory_limit = 2G
```

**Could not find the alias:**  Your local alias should be generated automatically but if you get an alias not found for your local VM you can regenerate with this command:ss

```
composer run-script blt-alias
```

**Could not find the alias:** Make sure you are running all local drush commands (e.g drush $my.local status) within the docroot folder:

```
cd your_project_root/web

drush <your-command>
```

**Can’t connect to local.yourproject.com:** Sometimes your /etc/hosts file can get messed up, especially if you have attempted multiple attempts on your VM build. Examine and fix your /etc/hosts file with any badly formed or extraneous entries.

This is often due to a missing vagrant-hostupdater plugin (see above for install) or a problem with your generated /etc/hosts file. Sometimes Drupal VM does not insert a proper line break between host entries, so you may see something similar to this in your system's /etc/hosts file:

```
127.0.0.1       anothersite.dd192.168.189.178newupstream.local # VAGRANT: 461be619b044d8d6d99ca1ea37fc68be
```

To fix this problem manually edit your system's /etc/hosts file and add a line break where your Drupal VM entries begin:

```
sudo nano /etc/hosts

127.0.0.1       anothersite.dd //fix the linebreak here!

192.168.189.178  newupstream.local  # VAGRANT: 461be619b044d8d6d99ca1ea37fc68be...

etc.
```

Examine your /etc/hosts file to make sure it looks sane and that there are not competing entries for your Drupal VM IP address or other obvious problems.

If you continue to have issues you can also destroy and rebuild the virtual machine in order to start fresh.

```
vagrant destroy
```

After running this command, also verify that any related /etc/hosts entries were deleted during the destory process. Manually remove any newupstream.local entries that might remain. You can now run:

```
vagrant up
```

This will create a fresh virtual machine. Again watch the build process closely for any errors (especially related to host entries.) If all goes good, the process should complete and you should be able to run ```drush @newupstream.local status``` and return a successful Drupal bootstrap.

## Linux and Windows

These instructions were tested and derived on Mac OS but others have had success running Drupal VM on Linux or Windows. More specific instructions are available below. Godspeed:

* Linux: http://docs.drupalvm.com/en/latest/getting-started/installation-linux/
* Windows: http://docs.drupalvm.com/en/latest/getting-started/installation-windows/

[Back to top](#center-for-inclusive-childcare)

## Support and feedback

If you need support or can contribute additional notes regarding Linux or Windows installs please contact <tim@electriccitizen.com>.

[Back to top](#center-for-inclusive-childcare)
