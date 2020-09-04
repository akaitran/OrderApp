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

$query = "SELECT * FROM setting WHERE title = 'Kitchen Setup Printer IP'";

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

$printer -> setTextSize(2,2);

  $printer -> setJustification(Printer::JUSTIFY_LEFT);

function cmp($a, $b)
    {
        return strcmp($b->area, $a->area);
    }

    usort($order->dishes, "cmp");

  $newline = true;

  foreach ($order->dishes as $key => $dish) {
        for ($i = 1; $i <= $dish->amount; $i++) {
        $printer -> text($dish->description . $dish->size);
if ($dish->amount > 1)
     $printer -> text(" (". $i .")\n");

      foreach ($dish->options as $opt) {
        if ($opt->selected == 1)
          $printer -> text("  * " . $opt->name . "\n");
      }

      foreach ($dish->ingredient as $ing) {
        if ($ing->amount <= 0)
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
$printer -> text("\n");
$printer -> cut();
  }
}

  $printer -> close();

  echo "success";
} catch (Exception $e) {
  echo "failed";
}

$conn->close();
?>
