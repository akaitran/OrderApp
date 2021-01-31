<?php
require '../../services/escpos/autoload.php';

use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;

//include the connection page
include('../../dbconfig.php');

//get an instance
$db = new Connection();

$conn = $db->connect();

$request = json_decode( file_get_contents('php://input'));

$query = "SELECT * FROM setting";

$result = mysqli_query($conn, $query );

while ($row = mysqli_fetch_assoc($result)) {

  if ($row['title'] === "Business Name")
    $business = $row['value'];

  if ($row['title'] === "Business Address 1")
    $add1 = $row['value'];

  if ($row['title'] === "Business Address 2")
    $add2 = $row['value'];

  if ($row['title'] === "Business Phone")
    $phone = $row['value'];

  if ($row['title'] === "Business ABN")
    $abn = $row['value'];
}

$query = "SELECT * FROM orders ORDER BY id DESC LIMIT 1";

$result = mysqli_query($conn, $query );

$row = mysqli_fetch_assoc($result);
$lastId = $row['id'] % 100;

$query = "SELECT SUM(total) FROM orders WHERE time >= CURDATE()";

$result = mysqli_query($conn, $query );

$row = mysqli_fetch_assoc($result);
$daily_total = $row['SUM(total)'];

try {
  $connector = new FilePrintConnector("/dev/usb/lp0");
  $printer = new Printer($connector);

  function addSpaces($string = '', $valid_string_length = 0) {
    if (strlen($string) < $valid_string_length) {
        $spaces = $valid_string_length - strlen($string);
        for ($index1 = 1; $index1 <= $spaces; $index1++) {
            $string = $string . ' ';
        }
    }

    return $string;
  }

  $printer->setJustification(Printer::JUSTIFY_CENTER);

  /*$printer->setEmphasis(true);
  $printer -> setTextSize(3,2);
  $printer -> setUnderline(Printer::UNDERLINE_DOUBLE);
  $printer->text("TA-" . ($lastId + 1) . "\n");
  $printer->setEmphasis(false);*/
  $printer -> setTextSize(1,1);
  $printer -> setUnderline(Printer::UNDERLINE_NONE);

  $tux = EscposImage::load("../../assets/images/anhtuk.png", false);
  $printer->bitImage($tux);

  //$printer->text(strtoupper($business) . "\n");
  $printer->text(strtoupper($add1) . "\n");
  $printer->text(strtoupper($add2) . "\n");
  $printer->text(strtoupper($phone) . "\n");
  $printer->text("ABN: " . strtoupper($abn) . "\n\n");

  $printer -> setTextSize(2,2);

  $printer->text("DAILY SUMMARY\n");
  $printer -> setTextSize(1,1);

  $printer->text(strtoupper(date("D d/m/Y")) . "\n");
  $printer->text("\n");

  $printer -> setTextSize(2,2);

  $printer->setEmphasis(true);
  $printer->setPrintLeftMargin(0);
  $printer->setJustification(Printer::JUSTIFY_RIGHT);

  $printer->text("TOTAL: $" . $daily_total);
  
  $printer -> feed();
  $printer -> feed();
  $printer -> cut();

  //$printer -> pulse();

  $printer -> close();
  echo "success";
} catch (Exception $e) {
  echo "failed";
}

$conn->close();
?>
