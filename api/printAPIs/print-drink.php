<?php
require '../../services/escpos/autoload.php';

use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\Printer;

//include the connection page
include('../../dbconfig.php');

//get an instance
$db = new Connection();

$conn = $db->connect();

$request = json_decode( file_get_contents('php://input'));
$order = $request->data;

$query = "SELECT * FROM setting WHERE title = 'Counter Printer IP'";

$result = mysqli_query($conn, $query );

$row = mysqli_fetch_assoc($result);
$ip = $row['value'];

$connector = new NetworkPrintConnector($ip, 9100);
$printer = new Printer($connector);

$printer -> setTextSize(3,3);
$printer -> setJustification(Printer::JUSTIFY_CENTER);

if ($order->type !== "dine in") {
  $printer -> text($order->type . "\n");
  if ($order->type === "Uber")
    $printer -> text($order->orderNo . "\n");
} else
  $printer -> text($order->orderNo . $order->orderSide . "\n");

$printer -> setTextSize(2,2);
$printer -> setJustification(Printer::JUSTIFY_LEFT);

function cmp($a, $b)
{
    return strcmp($a->area, $b->area);
}

usort($order->dishList, "cmp");

$listSize = sizeof($order->dishList);

foreach ($order->dishList as $key => $dish) {
  if ($dish->area === "quầy bar") {
    $printer -> text($dish->amount . " " . $dish->name . "\n");
    
    foreach ($dish->options as $opt) {
      if ($opt->selected == 1)
        $printer -> text(" " . " * " . strtolower($opt->name) . "\n");
    }

    foreach ($dish->ingredient as $ing) {
      if ($ing->amount == 0)
        $printer -> text(" " . " 0 " . strtolower($ing->name) . "\n");
      if ($ing->amount > 1)
        $printer -> text(" " . " + " . strtolower($ing->name) . "\n");
    }
  }
}

$printer -> cut();

$printer -> close();
echo $ip;
$conn->close();
?>