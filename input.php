<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Submit AC!</title>
    <link rel="stylesheet" type="text/css" href="example.css"> 
</head>
<body>

<?php
$text_name = $_POST['name'];
$mail_address = $_POST['mail'];
$cbx_values = $_POST['A'];
$text = '.txt';
$tmp = scandir('./2s3e8nbwu');
$file_count = count($tmp)-1;

$text_addition = $file_count.'-'.$text_name.'-'.$cbx_values.$text;
file_put_contents('./2s3e8nbwu/'.$text_addition,"$mail_address");

$text_name = htmlspecialchars($text_name,ENT_QUOTES,'utf-8');
$mail_address = htmlspecialchars($mail_address,ENT_QUOTES,'utf-8');
print'<h3>FileName:';
print $text_name;
print '<br>';
print 'Submit Accepted';
//print '<br>';
//print 'keyword is'.$keyword;
print'</h3>';
print'<br />';

//print'<br/>';
//print '<h3>SubmitCode:<br /></h3>'.nl2br($mail_address);
//print'<br/>';
?>
<br />
<a href ="index.html"><input type="submit" id="inch" value="Back"></a>
</body>
</html>