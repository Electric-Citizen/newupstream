<?php

/**
 * Implements hook_drush_command().
 */
function ec_drush_command() {

  // site:insall
  $commands['ec_install'] = [
    'description' => 'Install a new copy of the site',
    'aliases' => ['site:install'],
    'examples' => [
      'drush site:install' => 'Do a fresh site install from the primary development branch',
    ],
  ];

  // site:refresh
  $commands['ec_refresh'] = [
    'description' => 'Refresh the site and code for a new round of development',
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
    'description' => 'This is my example command.',
    'aliases' => ['site:export'],
    'examples' => [
      'drush site:refresh' => 'Refresh site from remote server.',
     ],
  ];

  return $commands;
}

/**
 * Drush command logic.
 * drush_[MODULE_NAME]_[COMMAND_NAME]().
 */

function drush_ec_install() {

  $break = '------------------------------------------------------------------------';

  // get site config for vm
  $site = yaml_parse_file('/var/www/drupalvm/drupalvm/config.yml');

  // change to web root
  chdir('/var/www/drupalvm/web');

  //update source branch
  drush_print($break);
  drush_print('Pull fresh '.$site['branch'].' branch');
  drush_print($break);

  exec('git checkout '.$site['branch']);
  exec('git pull origin '.$site['branch']);

  // run composer install again
  drush_print($break);
  drush_print('Install  on '.$site['alias_local'].' branch');
  drush_print($break);

  exec('composer install');

  // sync db
  drush_print($break);
  drush_print('Sync database from '.$site['alias_remote']);
  drush_print($break);

  if (!$status = drush_invoke_process('@self', 'sql-sync -y', array($site['alias_remote'], '@self'), array())) {
    drush_log(dt('Unable to sync db !alias', array('!alias' => $site['alias_remote'])), 'warning');
  }

  // sync files
  drush_print($break);
  drush_print('Sync files from '.$site['alias_remote']);
  drush_print($break);
  exec('rsync -rlvz --size-only --ipv4 --progress -e \'ssh -p 2222\' '.$site['env'].'.'.$site['site'].'@appserver.'.$site['env'].'.'.$site['site'].'.drush.in:files/ sites/default/files');

  // export config
  drush_print($break);
  drush_print('Export active config to '.$site['alias_local']);
  drush_print($break);

  if (!$status = drush_invoke_process('@self', 'cex', array(), array())) {
    drush_log(dt('Unable to export config to !alias', array('!alias' => '$self')), 'warning');
  }

  // import config (test)
  drush_print($break);
  drush_print('Import config to '.$site['alias_local'].' [TEST]');
  drush_print($break);

  exec('drush '.$site['local_alias'].' cim sync');

  // clear cache
  drush_print($break);
  drush_print('Clear caches on '.$site['alias_local']);
  drush_print($break);
  if (!$status = drush_invoke_process('@self', 'cr all', array(), array())) {
    drush_log(dt('Unable to display status !alias', array('!alias' => '@self')), 'warning');
  }

  // return a status
  drush_print($break);
  drush_print('Ready to rock.');
  drush_print($break);

}



function drush_ec_refresh($nodb=NULL, $nofiles=NULL) {

  $break = '------------------------------------------------------------------------';

  // get site config for vm
  $site = yaml_parse_file('/var/www/drupalvm/drupalvm/config.yml');

  // change to web root
  chdir('/var/www/drupalvm/web');

  // pull from source branch
  drush_print($break);
  drush_print('Update '.$site['branch'].' branch');
  drush_print($break);

  exec('git checkout '.$site['branch']);
  exec('git pull origin '.$site['branch']);

  // get arguments
  $nodb = drush_get_option('nodb', NULL);
  $nofiles = drush_get_option('nofiles', NULL);

  // sync db
  drush_print($break);
  drush_print('Sync database from '.$site['alias_remote']);
  drush_print($break);

  if ($nodb == NULL) {
    if (!$status = drush_invoke_process($site['alias_local'], 'sql-sync -y', array($site['alias_remote'], $site['alias_local']), array())) {
      drush_log(dt('Unable to sync db !alias', array('!alias' => $site['alias_remote'])), 'warning');
    }
  } elseif ($nodb == 1) {
    drush_print('Skipping database sync from '.$site['alias_remote']);
  } else {
    drush_print('--nodb can only be set to 1: file sync failed');

  }
  // sync files
  drush_print($break);
  drush_print('Sync files from '.$site['alias_remote']);
  drush_print($break);

  if ($nofiles == NULL) {
    exec('rsync -rlvz --size-only --ipv4 --progress -e \'ssh -p 2222\' '.$site['env'].'.'.$site['site'].'@appserver.'.$site['env'].'.'.$site['site'].'.drush.in:files/ sites/default/files');
    drush_print('syncing...');
  } elseif ($nodb == 1) {
    drush_print('Skipping file sync from '.$site['alias_remote']);
  } else {
    drush_print('--nofiles can only be set to 1: file sync failed');
  }

  // export active config
  drush_print($break);
  drush_print('Export active config to '.$site['alias_local']);
  drush_print($break);

  if (!$status = drush_invoke_process('@self', 'cex sync', array(), array())) {
    drush_log(dt('Unable to export !alias', array('!alias' => '$self')), 'warning');
  }

  // import config (test)
  drush_print($break);
  drush_print('Import config to '.$site['alias_local'].' [test]');
  drush_print($break);

  if (!$status = drush_invoke_process('@self', 'cim sync', array(), array())) {
    drush_log(dt('Unable to import config to !alias', array('!alias' => '$self')), 'warning');
  }


  // change admin pwd
  drush_print($break);
  drush_print('Change user 1 password to admin');
  drush_print($break);

  if (!$status = drush_invoke_process('@self', 'upwd admin --password="admin"', array(), array())) {
    drush_log(dt('Unable to import config to !alias', array('!alias' => '$self')), 'warning');
  }

  // clear cache
  drush_print($break);
  drush_print('Clear caches on '.$site['alias_local']);
  drush_print($break);
  if (!$status = drush_invoke_process('@self', 'cr all', array(), array())) {
    drush_log(dt('Unable to display status !alias', array('!alias' => '@self')), 'warning');
  }

  // STATUS
  drush_print($break);
  drush_print('Ready to rock.');
  drush_print($break);

}

function drush_ec_export() {

  $break = '------------------------------------------------------------------------';

  // get site config for vm
  $site = yaml_parse_file('/var/www/drupalvm/drupalvm/config.yml');

    // get active git branch
    $branch = getGitBranch();

    // make sure we are not on master
    if ($branch == $site['branch']) {
      drush_print($break);
      drush_print('OH NO YOU DIDN\'T');
      drush_print($break);
      drush_print('You are attempting to export from the ['.$site['branch'].'] branch instead of a working branch. You');
      drush_print('are not allowed to simply push directly to '.$site['branch'].'.');
      drush_print('');
      drush_print('If you are a SUPER NINJA, and if you have your reasons, you can export and push your');
      drush_print('changes manually to ['. $site['branch'].'] instead of using [site:export].');
      drush_print('');
      drush_print('Please understand the necessary commands you will need to run and the implications of');
      drush_print('doing so before proceeding. Good luck and godpseed.');
      drush_print($break);
      die;
    }


  // change to project root
  chdir('/var/www/drupalvm');

  // export active config in working branch
  drush_print($break);
  drush_print('Export active configuration from '.$site['alias_local']);
  drush_print($break);
  exec('drush '.$site['alias_local'].' cex sync -y');

  // add any new config files to git in the case the user forgets
  drush_print($break);
  drush_print('Adding new config files to git');
  drush_print($break);
  drush_print('adding files...');

  exec('git add config/*');

  // attempt to merge source branch
  drush_print($break);
  drush_print('Merge code from '.$site['alias_remote']);
  drush_print($break);

  exec('git checkout '.$site['branch']);
  exec('git pull origin '.$site['branch']);
  exec('git checkout '.$branch);
  exec('git merge master');

  // run a test import
  drush_print($break);
  drush_print('Run a test config import');
  drush_print($break);
  exec('drush '.$site['alias_local'].' cim sync -y');

  // change to project root
  chdir('/var/www/drupalvm');

  // send deploy message
  drush_print($break);
  drush_print('COMPLETE:');
  drush_print($break);
  drush_print('If your [site:export] command completed with no errors your are');
  drush_print('to commit and push your branch to Github. If you see any errors');
  drush_print('above (merge conflicts or other errors) please resolve before');
  drush_print('attempting to push your working branch to Github');
  drush_print($break);

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