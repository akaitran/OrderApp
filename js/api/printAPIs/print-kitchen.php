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

$query = "SELECT * FROM setting WHERE title = 'Kitchen Printer IP'";

$result = mysqli_query($conn, $query );

$row = mysqli_fetch_assoc($result);
$ip = $row['value'];

$connector = new NetworkPrintConnector($ip, 9100);
$printer = new Printer($connector);

$printer -> text("\n");
$printer -> text("\n");
$printer -> text("\n");

$printer -> setTextSize(3,3);
$printer -> setJustification(Printer::JUSTIFY_CENTER);

if ($order->type !== "dine in") {
  $printer -> text($order->type . "\n");
  $printer -> setTextSize(2,2); 
} else {
  $printer -> text($order->orderno);
  $printer -> setTextSize(2,2);
 
  $printer -> text($order->orderside . "\n");
}

$printer -> text($order->description . "\n");
$printer -> text("\n");

$printer -> setJustification(Printer::JUSTIFY_LEFT);

function cmp($a, $b)
{
    return strcmp($b->area, $a->area);
}

usort($order->dishes, "cmp");

$listSize = sizeof($order->dishes);

foreach ($order->dishes as $key => $dish) {
  if ($order->type !== "dine in" || $dish->area !== "quầy bar") {
    if ($dish->type === "entree") 
      $printer -> setUnderline(Printer::UNDERLINE_DOUBLE);
    
    if ($dish->type === "TA") {
      $printer -> text($dish->amount . " x " . $dish->name . $dish->size);
      $printer -> text(" (TA)" . "\n");
    } else {
      $printer -> text($dish->amount . " x " . $dish->name . $dish->size . "\n");
    }

    $printer -> setUnderline(Printer::UNDERLINE_NONE);
    
    foreach ($dish->options as $opt) {
      if ($opt->selected == 1)
        $printer -> text("  * " . strtolower($opt->name) . "\n");
    }

    foreach ($dish->ingredient as $ing) {
      if ($ing->amount == 0)
        $printer -> text("  ko " . strtolower($ing->name) . "\n");
      if ($ing->amount > 1)
        $printer -> text("  + " . strtolower($ing->name) . "\n");
    }

    $printer -> setTextSize(1,1);
    $printer -> text("\n");
    $printer -> setTextSize(2,2);
  }

  if ($order->type === "dine in") {
    if ($key < $listSize - 1) {
      $nextDish = $order->dishes[$key + 1];

      if ($nextDish->area !== $dish->area && $nextDish->area !== "quầy bar") {
        $printer -> text("\n");
        $printer -> text("\n");

        $printer -> cut();

        $printer -> text("\n");
        $printer -> text("\n");
        $printer -> text("\n");
        
        $printer -> setTextSize(3,3);
        $printer -> setJustification(Printer::JUSTIFY_CENTER);

        $printer -> text($order->orderno);

        $printer -> setTextSize(2,2);
        $printer -> text($order->orderside . "\n");

        $printer -> setJustification(Printer::JUSTIFY_LEFT);
      }
    }
  }
}

$printer -> text("\n");
$printer -> text("\n");
$printer -> text("\n");

$printer -> cut();

$printer -> text("\n");
$printer -> text("\n");
$printer -> text("\n");
$printer -> text("\n");

$printer -> setTextSize(3,3);
$printer -> setJustification(Printer::JUSTIFY_CENTER);

if ($order->type !== "dine in") {
  $printer -> text($order->orderno);
  $printer -> setTextSize(2,2);
  $printer -> text($order->orderside . "\n");
  $printer -> setTextSize(3,3);
  $printer -> text($order->type . "\n");
  $printer -> setTextSize(2,2);
} else {
  $printer -> text($order->orderno);
  $printer -> setTextSize(2,2);
 
  $printer -> text($order->orderside . "\n");
}

$printer -> text($order->description . "\n");
$printer -> text("\n");

$printer -> setJustification(Printer::JUSTIFY_LEFT);

$newline = true;

foreach ($order->dishes as $key => $dish) {
  if ($dish->area === "quầy bar" && $newline == true) {
    $newline = false;
    $printer -> text("\n");
  }

  if ($dish->type === "entree") 
    $printer -> setUnderline(Printer::UNDERLINE_DOUBLE);

  if ($dish->type === "TA") {
    $printer -> text($dish->amount . " x " . $dish->name . $dish->size);
    $printer -> text(" (TA)" . "\n");
  } else {
    $printer -> text($dish->amount . " x " . $dish->name . $dish->size . "\n");
  }

  $printer -> setUnderline(Printer::UNDERLINE_NONE);

  foreach ($dish->options as $opt) {
    if ($opt->selected == 1)
      $printer -> text("  * " . strtolower($opt->name) . "\n");
  }

  foreach ($dish->ingredient as $ing) {
    if ($ing->amount == 0)
      $printer -> text("  ko " . strtolower($ing->name) . "\n");
    if ($ing->amount > 1)
      $printer -> text("  + " . strtolower($ing->name) . "\n");
  }
  
  $printer -> setTextSize(1,1);
  $printer -> text("\n");
  $printer -> setTextSize(2,2);
}

$printer -> setJustification(Printer::JUSTIFY_RIGHT);
$printer -> text("TOTAL: $" . $order->total . "\n");
$printer -> setTextSize(1,1);
$printer -> text($order->staffname . "\n");
$printer -> setTextSize(2,2);

$printer -> text("\n");
$printer -> text("\n");
$printer -> text("\n");

$printer -> cut();

$printer -> close();
echo $ip;
$conn->close();
?>
