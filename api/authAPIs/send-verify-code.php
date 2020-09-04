<?php
 include '../../services/APIClient2.php';
 
 $request = json_decode(file_get_contents('php://input'));
 $sms = $request -> data;

 $api = new transmitsmsAPI('b51d1d9f750c35778dc6fcf517f63b7b', '414U21k2@@!@');
 
 // sending to a set of numbers
 $result = $api->sendSms($sms->message, $sms->number, 'BepLink');
 
 // sending to a list
 //$result = $api->sendSms('test', null, 'callerid', null, 6151);
 
 if ($result->error->code == 'SUCCESS') {
   echo "Message to {$result->recipients} recipients sent with ID 
     {$result->message_id}, cost {$result->cost}";

 } else {
     echo "Error: {$result->error->description}";
 }
 ?>