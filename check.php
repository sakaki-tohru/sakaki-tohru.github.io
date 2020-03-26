<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Submit Check</title>
    <link rel="stylesheet" type="text/css" href="example.css">
</head>
<body>

<?php
$text_name = $_POST['name'];
stripslashes($_POST["mail"]);
$mail_address = $_POST['mail'];
$text_name = htmlspecialchars($text_name,ENT_QUOTES,'utf-8');
$mail_address = htmlspecialchars($mail_address,ENT_QUOTES,'utf-8');
if ($text_name == ''){
    print'<h3>File Name Not Input!</h3><br />';
}
else {
    print '<h3>FILE NAME:';
    print $text_name;
    print'</h3>';
}
if ($mail_address==''){
    print'<h3>Code Not Input!</h3><br />';
}
else { 
    print '';
}
?>
<?php if($mail_address != ''):  ?>
<h3>Submit:
<?php if( isset( $_POST[ 'A' ] ) ){
	$cbx_values = $_POST[ 'A' ];
	for( $i = 0; $i < count( $cbx_values ); $i ++ ){
		print "{$cbx_values[$i]}<br/>";
	}
}?></h3>

<?php
 print '<h3>SubmitCode:';
 print '<br /></h3>';
 print nl2br($mail_address); ?>
<form method="post" action="input.php">
    <input type="hidden" name="name" value="<?php print $text_name; ?>"><br/> 
    <input type="hidden" name="mail" value="<?php print $mail_address; ?>"><br/>
    <input type="hidden" name="key" value="<?php print $keyword; ?>"><br/>
    <a href ="input.php"><input type="submit" id="size" value="OK"></a>
<input type="hidden" name="A" value="<?php if( isset( $_POST[ 'A' ] ) ){$cbx_values = $_POST[ 'A' ];for( $i = 0; $i < count( $cbx_values ); $i ++ ){print "{$cbx_values[$i]}";}}?>"/>
    <?php endif ?>
<a href ="index.html"><input type="button" id="inch" value="Back at Problem"></a> 
</form>
</body>
</html>