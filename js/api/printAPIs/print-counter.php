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

$printer -> setJustification(Printer::JUSTIFY_CENTER);

if ($order->type !== "dine in") {
  $printer -> text($order->type . "\n");
  if ($order->type === "Uber")
    $printer -> text($order->orderNo . "\n");
} else
  $printer -> text($order->orderNo . $order->orderSide . "\n");

$printer -> setJustification(Printer::JUSTIFY_LEFT);

function cmp($a, $b)
{
    return strcmp($a->area, $b->area);
}

usort($order->dishList, "cmp");

$listSize = sizeof($order->dishList);

$count = 0;

foreach ($order->dishList as $key => $dish) {
  $count++;

  $printer -> text($count . ". " . $dish->description . $dish->size . " x " . $dish->amount . "  $" . $dish->cost . "\n");

  /*foreach ($dish->options as $opt) {
    if ($opt->selected == 1)
      $printer -> text(" " . " * " . strtolower($opt->description) . "\n");
  }

  foreach ($dish->ingredient as $ing) {
    if ($ing->amount == 0)
      $printer -> text(" " . " 0 " . strtolower($ing->description) . "\n");
    if ($ing->amount > 1)
      $printer -> text(" " . " + " . strtolower($ing->description) . "\n");
  }*/

  /*if ($order->type === "dine in") {
    if ($key < $listSize - 1) {
      $nextDish = $order->dishList[$key + 1];

      if ($nextDish->area !== $dish->area) {
        $printer -> cut();
        
        $printer -> setTextSize(3,3);
        $printer -> setJustification(Printer::JUSTIFY_CENTER);

        $printer -> text($order->orderNo . $order->orderSide . "\n");

        $printer -> setTextSize(2,2);
        $printer -> setJustification(Printer::JUSTIFY_LEFT);
      }
    }
  } else if ($order->type === "Uber") {
      $printer -> text($order->orderNo . "\n");
  }*/
}

$printer -> cut();

$printer -> close();
echo $ip;
$conn->close();
?>