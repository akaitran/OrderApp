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

$query = "SELECT * FROM orders ORDER BY id DESC LIMIT 1";

$result = mysqli_query($conn, $query );

$row = mysqli_fetch_assoc($result);
$lastId = $row['id'] % 100;

try {
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
  
    $printer -> text($order->orderside);
    if ($order->addition != -1)
      $printer -> text( "+\n");
    else
      $printer -> text( "\n");
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
    if ($dish->status === "new") {
      if ($dish->area === "quầy bar") {
        if ($dish->type === "entree") 
          $printer -> setUnderline(Printer::UNDERLINE_DOUBLE);
        else if ($dish->type === "TA") {
          $printer -> text($dish->amount . " " . $dish->name . $dish->size);
          $printer -> text(" (TA)" . "\n");
        } else if ($dish->type === "later") {
          $printer -> text($dish->amount . " " . $dish->name . $dish->size);
          $printer -> text(" (Later)" . "\n");
        } else {
          $printer -> text($dish->amount . " " . $dish->name . $dish->size . "\n");
        }

        $printer -> setUnderline(Printer::UNDERLINE_NONE);
        
        foreach ($dish->options as $opt) {
          if ($opt->selected == 1)
            $printer -> text("  * " . $opt->name . "\n");
        }

        foreach ($dish->ingredient as $ing) {
          if ($ing->amount == 0)
            $printer -> text("  ko " . $ing->name . "\n");
          if ($ing->amount > 1) {
            if ($ing->unit === "cost")
              $printer -> text("  +$" . ($ing->amount-1) * $ing->price . " " . $ing->name . "\n");
            else if ($ing->unit === "amount")
              $printer -> text("  +" . ($ing->amount-1) . " " . $ing->name . "\n");
            else
              $printer -> text("  + " . $ing->name . "\n");
          }
        }

        $printer -> setTextSize(1,1);
        $printer -> text("\n");
        $printer -> setTextSize(2,2);
      }
    }
  }

  $printer -> text("\n");
  $printer -> text("\n");
  $printer -> text($lastId + 1 ."\n");

  $printer -> cut();

  $printer -> close();
  echo "success";
} catch (Exception $e) {
  echo "failed";
}

$conn->close();
?>