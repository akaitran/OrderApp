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

try {
  $connector = new FilePrintConnector("/dev/usb/lp0");
  $printer = new Printer($connector);

  $printer -> text("\n");
  $printer -> text("\n");
  $printer -> text("\n");

  $printer -> setTextSize(3,3);
  $printer -> setJustification(Printer::JUSTIFY_CENTER);

  if ($order->type !== "dine in") {
    $printer -> setTextSize(2,2);
    $printer -> text($order->orderside . "\n");
    $printer -> setTextSize(3,3);
    $printer -> text($order->type . "\n");
    $printer -> setTextSize(2,2);
  } else {
    $printer -> text($order->orderno . $order->orderside[0]);
    $printer -> setTextSize(2,2);
    
    if ($order->addition != -1)
      $printer -> text( "+\n");
    else
      $printer -> text( "\n");
  }

  $printer -> text($order->description . "\n");
  $printer -> text("\n");

  $printer -> setJustification(Printer::JUSTIFY_LEFT);

  $newline = true;

  foreach ($order->dishes as $key => $dish) {
    if ($dish->status === "new") {
      if ($dish->area === "quầy bar" && $newline == true) {
        $newline = false;
        $printer -> text("\n");
      }

      if ($dish->type === "entree") 
        $printer -> setUnderline(Printer::UNDERLINE_DOUBLE);

      if ($dish->type === "TA") {
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

  echo "success";
} catch (Exception $e) {
  echo "failed";
}

$conn->close();
?>