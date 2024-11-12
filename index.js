const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;
let cors = require('cors');
app.use(cors());

app.use(express.static('static'));

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

function cartTotalPrice(newItemPrice, cartTotal) {
  let total = newItemPrice + cartTotal;
  return total.toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(cartTotalPrice(newItemPrice, cartTotal));
});

function memberDiscount(cartTotal, isMember) {
  if ((isMember = 'true')) {
    cartTotal = cartTotal - (cartTotal * discountPercentage) / 100;
  }

  return cartTotal.toString();
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(memberDiscount(cartTotal, isMember));
});

function taxCal(cartTotal) {
  cartTotal = (cartTotal * taxRate) / 100;
  return cartTotal.toString();
}
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);

  res.send(taxCal(cartTotal));
});

function deliveryT(shippingMethod, distance) {
  let day = distance;

  if (shippingMethod == 'standard') {
    day = distance / 50;
  }

  if (shippingMethod == 'express') {
    day = distance / 100;
    // res.send(distance.toString());
  }

  return day.toString();
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);

  res.send(deliveryT(shippingMethod, distance));
  // res.send(shippingMethod);
});

function shipCost(weight, distance) {
  let cost = (weight * distance) / 10;
  return cost.toString();
}

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(shipCost(weight, distance));
});

function points(purchaseAmount) {
  let points = purchaseAmount * loyaltyRate;
  return points.toString();
}
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(points(purchaseAmount));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
