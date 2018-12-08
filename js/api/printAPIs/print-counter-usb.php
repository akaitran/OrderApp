<?php
require '../../services/escpos/autoload.php';

use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\Printer;

//include the connection page
include('../../dbconfig.php');

//get an instance
$db = new Connection();

$conn = $db->connect();

$request = json_decode( file_get_contents('php://input'));
$order = $request->data;

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

$printer->text(strtoupper($business) . "\n");
$printer->text(strtoupper($add1) . "\n");
$printer->text(strtoupper($add2) . "\n");
$printer->text(strtoupper($phone) . "\n");
$printer->text(strtoupper($abn) . "\n");

$printer->text("DATE " . strtoupper(date("d/m/Y D")) . "  TIME " . date("h:i") . "\n");
$printer->text("\n");

$printer->setPrintLeftMargin(0);
$printer->setJustification(Printer::JUSTIFY_LEFT);
$printer->setEmphasis(true);
$printer->text(addSpaces('No Item', 35) . addSpaces('  Qty', 5) . addSpaces('   Cost', 9) . "\n");
$printer->setEmphasis(false);
$items = [];
$count = 0;

foreach ($order->dishes as $key => $dish) {
  $items[] = [
    'name' => $dish->description . $dish->size,
    'qty'  => $dish->amount,
    'cost' => "$".$dish->cost
  ];
}

foreach ($items as $item) {
    $count++;
    $name_lines = str_split($item['name'], 30);
    foreach ($name_lines as $k => $l) {
        $l = trim($l);
        $name_lines[$k] = addSpaces($l, 35);
    }

    $qty_lines = str_split($item['qty'], 5);
    foreach ($qty_lines as $k => $l) {
        $l = trim($l);
        $qty_lines[$k] = addSpaces($l, 5);
    }

    $cost_lines = str_split($item['cost'], 9);
    foreach ($cost_lines as $k => $l) {
        $l = trim($l);
        $cost_lines[$k] = addSpaces($l, 9);
    }

    $counter = 0;
    $temp = [];
    $temp[] = count($name_lines);
    $temp[] = count($qty_lines);
    $temp[] = count($cost_lines);
    $counter = max($temp);
    if ($count < 10)
      $printer->text($count . ". ");
    else
      $printer->text($count . ".");
    
    for ($i = 0; $i < $counter; $i++) {
        $line = '';
        if (isset($name_lines[$i])) {
            $line .= ($name_lines[$i]);
        }
        if (isset($qty_lines[$i])) {
            $line .= ($qty_lines[$i]);
        }
        if (isset($cost_lines[$i])) {
            $line .= ($cost_lines[$i]);
        }
        $printer->text($line);
    }
  $printer -> feed();
}

$printer -> setJustification(Printer::JUSTIFY_RIGHT);
$printer -> setTextSize(2,1);
$printer->setEmphasis(true);
$printer -> text("TOTAL: $" . $order->total . "\n");

$printer -> feed();
$printer -> feed();
$printer -> cut();

$printer -> close();
echo $ip;
$conn->close();
?>
