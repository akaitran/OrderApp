<?php
\Stripe\Stripe::setApiKey('sk_test_MLXLOzRGuxr4t4U33jSzGpSR00f2XdBh7r');

$session = \Stripe\Checkout\Session::create([
  'payment_method_types' => ['card'],
  'line_items' => [[
    'name' => 'T-shirt',
    'description' => 'Comfortable cotton t-shirt',
    'images' => ['https://example.com/t-shirt.png'],
    'amount' => 500,
    'currency' => 'aud',
    'quantity' => 1,
  ]],
  'success_url' => 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
  'cancel_url' => 'https://example.com/cancel',
]);
?>