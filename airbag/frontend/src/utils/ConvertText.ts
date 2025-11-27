// function ConvertText($Data){
//     $Data = str_replace("''","\"",$Data);
//     $val=trim($Data);
//     $val=str_replace("\\'","'",$val);
//     $val=stripslashes($val);
//     $val=htmlspecialchars($val,ENT_NOQUOTES); 		
//     $Data=htmlspecialchars($val,ENT_QUOTES); 
//     $Data=str_replace("@","&#64;",$Data);	
//     return $Data;
// }

// function Chk_S($text){
//     $text = str_replace("&amp;","&",$text);
//     $text = str_replace("amp;","",$text);
//     $text = str_replace("&quot;","''",$text);
//     $text = str_replace("&lt;","<",$text);
//     $text = str_replace("&gt;",">",$text);
//     $text = str_replace("&#39;","'",$text);
//     $text = str_replace("&#039;","'",$text);
//     return $text;
// }