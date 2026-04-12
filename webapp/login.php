<?PHP 
  require('app-lib.php');
  isset($_POST['a'])? $action = $_POST['a'] : $action = "";
  $msg = null;
  if($action == "doLogin") {
    $chkLogin = false;
    isset($_POST['fldUsername'])?
      $uName = $_POST['fldUsername'] : $uName = "";
    isset($_POST['fldPassword'])?
      $uPassword = $_POST['fldPassword'] : $uPassword = "";

    openDB();
    $query =
      "
      SELECT
        id,
        username,
        password,
		role
      FROM
        lpa_users
      WHERE
        username = '$uName'
      LIMIT 1
      ";
    $result = pg_query($db, $query);
    $row = pg_fetch_assoc($result);
    if($result) pg_free_result($result);
    print_r($row);
    if(isset($row['username']) && $row['username'] == $uName) {
      if(password_verify($uPassword, $row['password']) || $uPassword === $row['password']) {
        $_SESSION['authUser'] = $row['id'];
        $_SESSION['isAdmin'] = (($row['role']=="administrator")?true:false);
        lpa_log("User $uName successfully logged in.");
        header("Location: index.php");
        exit;
      }
    }

    if($chkLogin == false) {
      $msg = "Login failed! Please try again.";
      lpa_log("User $uName failed to log in.");
    }

  }
 build_header();
 $_SESSION['message'] = "";
?>
<?= $_SESSION['message']?>
  <div id="contentLogin">
    <form name="frmLogin" id="frmLogin" method="post" action="login.php">
      <div class="titleBar">User Login</div>
      <div id="loginFrame">
        <div class="msgTitle">Please supply your login details:</div>
        <label for="fldUsername" class="form-label">Username:</label>
        <input type="text" class="form-control" name="fldUsername" id="fldUsername">
        <label for="fldPassword" class="form-label">Password:</label>
        <input type="password" class="form-control" name="fldPassword" id="fldPassword">
        <div class="buttonBar">
          <button type="button" class="btn btn-primary" onclick="do_login()">Login</button>
        </div>
      </div>
      <input type="hidden" name="a" value="doLogin">
    </form>

 </div>
<script>
  var msg = "<?PHP echo $msg; ?>";
  if(msg) {
    alert(msg);
  }

  $("#frmLogin").keypress(function(e) {
    if(e.which == 13) {
      $(this).submit();
    }
  });

</script>
<?PHP
build_footer();
?>
