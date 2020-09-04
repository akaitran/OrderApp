<?php
require '../../services/escpos/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;

//include the connection page
include('../../dbconfig.php');

//get an instance
$db = new Connection();

$conn = $db->connect();

$request = json_decode( file_get_contents('php://input'));
$order = $request->data;

$query = "SELECT * FROM orders ORDER BY id DESC LIMIT 1";

$result = mysqli_query($conn, $query );

$row = mysqli_fetch_assoc($result);
$lastId = $row['id'] % 100;

// NEED TO BE ADDED
$onlyDrink = true;
$onlySoup = true;
$onlyFried = true;
$onlyStir = true;

$haveSoup = false;
$haveFried = false;
$haveStir = false;

$haveEntree = false;

try {
  $connector = new FilePrintConnector("/dev/usb/lp0", 5);
  $printer = new Printer($connector);

  foreach ($order->dishes as $dish) {
    if ($dish->area !== "quầy bar") 
      $onlyDrink = false;

    if ($dish->area === "đồ nước" || $dish->area === "đặc biệt") {
      $onlyFried = false;
      $onlyStir = false;
      $haveSoup = true;
    }
    if ($dish->area === "đồ chiên") {
      $onlyStir = false;
      $onlySoup = false;
      $haveFried = true;
    }
    if ($dish->area === "đồ xào") {
      $onlySoup = false;
      $onlyFried = false;
      $haveStir = true;
    }
    if ($dish->type === "entree") {
      $haveEntree = true;
    }
  }

  if ($onlyDrink == false) {
    $printer -> text("\n");
    $printer -> text("\n");
    $printer -> text("\n");

    $printer -> setTextSize(3,3);
    $printer -> setJustification(Printer::JUSTIFY_CENTER);

    if ($order->type !== "dine in") {
      if ($order->type === "TA")
        $printer -> text(ucwords($order->type) . "-" . $lastId . "\n");
      else
        $printer -> text(ucwords($order->type) . "\n");
      $printer -> setTextSize(2,2); 
    } else {
      $printer -> text($order->orderno);

      if (strlen($order->orderside) > 0) 
        $printer -> text("-");

      $printer -> text($order->orderside[0]);
      $printer -> setTextSize(2,2);
    
      if ($order->addition != -1)
        $printer -> text( "+\n");
      else
        $printer -> text( "\n");
    }

    $printer -> text($order->description . "\n");

    if ($order->cutlery == 1)
      $printer -> text("+Cutlery \n");

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
          $printer -> text($dish->amount . " " . $dish->name . $dish->size);
          $printer -> text(" (TA)" . "\n");
        } else if ($dish->type === "later") {
          $printer -> text($dish->amount . " " . $dish->name . $dish->size);
          $printer -> text(" (Lên sau)" . "\n");
        } else {
          $printer -> text($dish->amount . " " . $dish->name . $dish->size . "\n");
        }

        $printer -> setUnderline(Printer::UNDERLINE_NONE);
        
        foreach ($dish->options as $opt) {
          if ($opt->selected == 1)
            $printer -> text("  *" . $opt->name . "\n");
        }

        foreach ($dish->ingredient as $ing) {
          if ($ing->amount <= 0)
            $printer -> text("  ko " . $ing->name . "\n");
          if ($ing->amount > 1) {
            if ($ing->unit === "cost") {
              if ($dish->amount >1)
                  $printer -> text("  +$" . ($ing->amount-1) * $ing->price / $dish->amount . " " . $ing->name . "/each\n");
              else
                  $printer -> text("  +$" . ($ing->amount-1) * $ing->price . " " . $ing->name . "\n");
            } else if ($ing->unit === "amount")
              $printer -> text("  +" . ($ing->amount-1) . " " . $ing->name . "\n");
              else if ($ing->unit === "change")
              $printer -> text("  *" .  $ing->name . "\n");
            else
              $printer -> text("  +" . $ing->name . "\n");
          }
        }
        $printer -> setTextSize(1,1);
        $printer -> text("\n");
        $printer -> setTextSize(2,2);
      }

      if ($order->type === "dine in") {
        if ($key < $listSize - 1) {
          $nextDish = $order->dishes[$key + 1];

          if ($nextDish->area !== $dish->area && $nextDish->area !== "quầy bar") {
            $printer -> setJustification(Printer::JUSTIFY_RIGHT);

            $printer -> setTextSize(1,1);
            $printer->text(strtoupper(date("d/m/Y D")) . " " . date("H:i") . "\n");
            $printer -> text($order->staffname . "\n");
            $printer -> setTextSize(2,2);

            $printer -> text("\n");
            $printer -> text("\n");

            $printer -> cut();

            $printer -> text("\n");
            $printer -> text("\n");
            $printer -> text("\n");
            
            $printer -> setTextSize(3,3);
            $printer -> setJustification(Printer::JUSTIFY_CENTER);

            $printer -> text($order->orderno);

            if (strlen($order->orderside) > 0) 
              $printer -> text("-");

            $printer -> text($order->orderside[0]);
            $printer -> setTextSize(2,2);

            if ($order->addition != -1)
              $printer -> text( "+\n");
            else
              $printer -> text( "\n");

            $printer -> text($order->description . "\n");

            if ($order->cutlery == 1)
              $printer -> text("+Cutlery \n");

            $printer -> setJustification(Printer::JUSTIFY_LEFT);
          }
        }
      }
    }

    $printer -> setJustification(Printer::JUSTIFY_RIGHT);
    
    $printer -> setTextSize(1,1);
    $printer->text(strtoupper(date("d/m/Y D")) . " " . date("H:i") . "\n");
    $printer -> text($order->staffname . "\n");
    $printer -> setTextSize(2,2);

    $printer -> text("\n");
    $printer -> text("\n");
    $printer -> text("\n");

    $printer -> cut();

    $printer -> text("\n");
    $printer -> text("\n");
    $printer -> text("\n");

    $printer -> setTextSize(3,3);
    $printer -> setJustification(Printer::JUSTIFY_CENTER);

    $tux = EscposImage::load("../../images/codologo.png", false);
    $printer->bitImage($tux);

    if ($order->type !== "dine in") {
      $printer -> setTextSize(2,2);
      $printer -> text($order->orderside . "\n");
      $printer -> setTextSize(3,3);

      if ($order->type === "TA")
        $printer -> text(ucwords($order->type) . "-" . $lastId . "\n");
      else
        $printer -> text(ucwords($order->type) . "\n");

      $printer -> setTextSize(2,2);
    } else {
      $printer -> text($order->orderno);

      if (strlen($order->orderside) > 0) 
          $printer -> text("-");

      $printer -> text($order->orderside[0]);
      $printer -> setTextSize(2,2);

      if ($order->addition != -1)
        $printer -> text( "+\n");
      else
        $printer -> text( "\n");
    }

    $printer -> text($order->description . "\n");

    if ($order->cutlery == 1)
        $printer -> text("+Cutlery \n");
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
        $printer -> text($dish->amount . " " . $dish->name . $dish->size);
        $printer -> text(" (TA)" . "\n");
      } else if ($dish->type === "later") {
        $printer -> text($dish->amount . " " . $dish->name . $dish->size);
        $printer -> text(" (Lên sau)" . "\n");
      } else {
        $printer -> text($dish->amount . " " . $dish->name . $dish->size . "\n");
      }

      $printer -> setUnderline(Printer::UNDERLINE_NONE);

      foreach ($dish->options as $opt) {
        if ($opt->selected == 1)
          $printer -> text("  *" . $opt->name . "\n");
      }

      foreach ($dish->ingredient as $ing) {
        if ($ing->amount <= 0)
          $printer -> text("  ko " . $ing->name . "\n");
        if ($ing->amount > 1) {
          if ($ing->unit === "cost") {
              if ($dish->amount >1)
                  $printer -> text("  +$" . ($ing->amount-1) * $ing->price / $dish->amount . " " . $ing->name . "/each\n");
              else
                  $printer -> text("  +$" . ($ing->amount-1) * $ing->price . " " . $ing->name . "\n");
            } else if ($ing->unit === "amount")
            $printer -> text("  +" . ($ing->amount-1) . " " . $ing->name . "\n");
              else if ($ing->unit === "change")
              $printer -> text("  *" . $ing->name . "\n");
          else
            $printer -> text("  +" . $ing->name . "\n");
        }
      }

      $printer -> setTextSize(1,1);
      $printer -> text("\n");
      $printer -> setTextSize(2,2);
    }

    $printer -> setJustification(Printer::JUSTIFY_RIGHT);
      
    $printer -> setTextSize(1,1);
    $printer->text(strtoupper(date("d/m/Y D")) . " " . date("H:i") . "\n");
    $printer -> text("Bill setup\n");
    $printer -> text($order->staffname . "\n");
    $printer -> setTextSize(2,2);

    $printer -> text("\n");
    $printer -> text("\n");
    $printer -> text("\n");

    $printer -> cut();
  }
  
  $printer -> close();
  echo "success";

} catch (Exception $e) {
  echo "failed";
}

$conn->close();
?>
