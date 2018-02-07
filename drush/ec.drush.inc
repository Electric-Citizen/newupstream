<?php

/**
 * Implements hook_drush_command().
 */
function ec_drush_command() {

  // site:refresh
  $commands['ec_refresh'] = [
    'description' => 'Refresh the site and code from the target environment',
    'aliases' => ['site:refresh'],
    'options' => [
      'nodb' => 'Skip the database refresh',
      'nofiles' => 'Skip the files refresh',
    ],
    'examples' => [
      'drush site:refresh' => 'Refresh the site',
    ],
  ];

  // site:export
  $commands['ec-export'] = [
    'description' => 'Export your changes to config and run a series of sanity checks before pushing a branch',
    'aliases' => ['site:export'],
    'examples' => [
      'drush site:refresh' => 'Export your changes to config and run a series of sanity checks',
    ],
  ];

  return $commands;
}

function drush_ec_refresh($nodb=NULL, $nofiles=NULL) {

  // change to project root
  chdir('/var/www/drupalvm');

  // load vm config
  $site = yaml_parse_file('/var/www/drupalvm/drupalvm/config.yml');

  // verify a git pull from development branch
  drush_print('checkout and pull from '.$site['branch'].' branch');
  exec('git checkout '.$site['branch']);
  exec('git pull origin '.$site['branch']);

  // run composer install
  drush_print('composer install on '.$site['alias_local']);
  exec('composer install');

  // change to web root
  chdir('/var/www/drupalvm/web');

  // get db and files arguments
  $nodb = drush_get_option('nodb', NULL);
  $nofiles = drush_get_option('nofiles', NULL);

  // sync db
  drush_print('Sync database from '.$site['alias_remote']);
  if ($nodb == NULL) {
    if (!$status = drush_invoke_process($site['alias_local'], 'sql-sync -y', array($site['alias_remote'], $site['alias_local']), array())) {
      drush_log(dt('Unable to sync db !alias', array('!alias' => $site['alias_remote'])), 'warning');
    }
  } elseif ($nodb == 1) {
    drush_print('Skipping database sync from '.$site['alias_remote']);
  } else {
    drush_print('--nodb can only be set to 1: file sync failed');

  }

  // drush updb
  drush_print('Run database updates on '.$site['alias_local']);

  if (!$status = drush_invoke_process($site['alias_local'], 'updb -y', array(), array())) {
    drush_log(dt('Unable to run drush updb on !alias', array('!alias' => $site['alias_local'])), 'warning');
  }

  // sync files
  drush_print('Sync files from '.$site['alias_remote']);
  if ($nofiles == NULL) {
    exec('rsync -rlvz --size-only --ipv4 --progress -e \'ssh -p 2222\' '.$site['env'].'.'.$site['site'].'@appserver.'.$site['env'].'.'.$site['site'].'.drush.in:files/ sites/default/files');
    drush_print('syncing...');
  } elseif ($nodb == 1) {
    drush_print('Skipping file sync from '.$site['alias_remote']);
  } else {
    drush_print('--nofiles can only be set to 1: file sync failed');
  }

  // export active config
  drush_print('Export active config to '.$site['alias_local']);

  if (!$status = drush_invoke_process($site['alias_local'], 'cex sync', array(), array())) {
    drush_log(dt('Unable to export !alias', array('!alias' => $site['alias_local'])), 'warning');
  }

  // import config (test)
  drush_print('Import config to '.$site['alias_local']);
  if (!$status = drush_invoke_process($site['alias_local'], 'cim sync', array(), array())) {
    drush_log(dt('Unable to import config to !alias', array('!alias' => $site['alias_local'])), 'warning');
  }

  // change admin pwd
  drush_print('Change user 1 password to admin');
  if (!$status = drush_invoke_process($site['alias_local'], 'upwd admin --password="admin"', array(), array())) {
    drush_log(dt('Unable to change password user 1 pwd on !alias', array('!alias' => $site['alias_local'])), 'warning');
  }

  // clear cache
  drush_print('Clear caches on '.$site['alias_local']);
  if (!$status = drush_invoke_process($site['alias_local'], 'cr all', array(), array())) {
    drush_log(dt('Unable to display status !alias', array('!alias' => $site['alias_local'])), 'warning');
  }

  // ready
  drush_print('Ready: please review the output for any error messages that may need to be resolved.');

}

function drush_ec_export() {

  // get site config for vm
  $site = yaml_parse_file('/var/www/drupalvm/drupalvm/config.yml');

  // get the active/working git branch
  $branch = getGitBranch();

  // make sure we are not on master
  if ($branch == $site['branch']) {
    drush_print('You are attempting to export from the ['.$site['branch'].'] branch instead of a working branch. You');
    drush_print('are not allowed to push directly to '.$site['branch'].' using the site:export command but if necessary you can complete the same steps manually.');
    die;
  }


  // change to project root
  chdir('/var/www/drupalvm');

  // export active config in working branch
  drush_print('Export active configuration from '.$site['alias_local']);
  exec('drush '.$site['alias_local'].' cex sync -y');

  // add any new config files to git in the case the user forgets
  drush_print('Adding new config files to git');
  drush_print('adding files...');
  exec('git add config/*');

  // attempt to merge source branch
  drush_print('Merge code from '.$site['alias_remote']);

  exec('git checkout '.$site['branch']);
  exec('git pull origin '.$site['branch']);

  // checkout working branch and merge master
  exec('git checkout '.$branch);
  exec('git merge master');

  // run a test import
  drush_print('Run a test config import');
  exec('drush '.$site['alias_local'].' cim sync -y');

  // change to project root
  chdir('/var/www/drupalvm');

  // clear cache
  drush_print('Clear caches on '.$site['alias_local']);
  if (!$status = drush_invoke_process($site['alias_local'], 'cr all', array(), array())) {
    drush_log(dt('Unable to display status !alias', array('!alias' => $site['alias_local'])), 'warning');
  }

  // send deploy message
  drush_print('If your [site:export] command completed with no errors your are');
  drush_print('to commit and push your branch to Github. If you see any errors');
  drush_print('above (merge conflicts or other errors) please resolve before');
  drush_print('attempting to push your working branch to Github');

}

function getGitBranch()
{
  $shellOutput = [];
  exec("git branch | grep '\*'", $shellOutput);
  foreach ($shellOutput as $line) {
    if (strpos($line, '* ') !== false) {
      return trim(strtolower(str_replace('* ', '', $line)));
    }
  }
  return null;
}