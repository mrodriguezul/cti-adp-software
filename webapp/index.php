<?PHP

  $authChk = true;
  require('app-lib.php');
  build_header($displayName);
?>
  <?PHP build_navBlock(); ?>
  <div id="content">

    <h3>Welcome back </h3><span style="font-weight: bold"><?PHP echo $displayName; ?></span>

  </div>
<?PHP
build_footer();
?>
