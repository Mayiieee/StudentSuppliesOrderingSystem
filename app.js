/* =========================================================
   app.js  —  shared data, money helpers, cart storage
   Loaded by every page BEFORE the page-specific script.
   ========================================================= */

/* ---- 1. THE PRODUCT CATALOG (fixed prices) ---- */
const PRODUCTS = [
  { id: 1, name: "Ballpen",   price: 12.00,
    img: "images/ballpen.webp" },
  { id: 2, name: "Pencil",    price: 10.00,
    img: "images/pencil" },
  { id: 3, name: "Notebook",  price: 35.00,
    img: "images/notebook.jpg" },
  { id: 4, name: "Yellow Pad", price: 45.00,
    img: "images/yellow pad.webp" },
  { id: 5, name: "Eraser",    price: 8.00,
    img: "images/eraser.jpg" },
  { id: 6, name: "Ruler",     price: 15.00,
    img: "images/ruler.jpg" }
];

/* ---- 2. MONEY HELPERS -----------------------------------
   Rule: keep everything in CENTAVOS (integers) so no
   floating-point rounding error appears. ₱12.00 -> 1200
   --------------------------------------------------------- */
function toCentavos(pesos) {
  // round to 2 decimals before converting
  return Math.round(Number(pesos) * 100);
}
function fromCentavos(cent) {
  return cent / 100;
}
function formatPeso(centOrPesos, isCentavos) {
  const pesos = isCentavos ? fromCentavos(centOrPesos) : Number(centOrPesos);
  return "₱" + pesos.toFixed(2);
}

/* ---- 3. CART STORAGE (localStorage = our "database") ---- */
const CART_KEY = "studentSuppliesCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

/* Cart line shape: { id, name, price (in centavos), qty } */

function addToCart(id, qty) {
  qty = Number(qty) || 1;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const cart = getCart();
  const line = cart.find(item => item.id === id);
  if (line) {
    line.qty += qty;                       // same item -> add quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: toCentavos(product.price),    // store centavos
      qty: qty
    });
  }
  saveCart(cart);
}

function setQty(id, qty) {
  const cart = getCart();
  const line = cart.find(i => i.id === id);
  if (!line) return;
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  line.qty = qty;
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

/* ---- 4. TOTALS (all in centavos) ---- */
function cartTotalCentavos() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

/* ---- 5. Small UI helper: flashing "Added!" feedback ---- */
function flashAdded(button) {
  const original = button.textContent;
  button.textContent = "✔ Added!";
  button.classList.add("added");
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("added");
    button.disabled = false;
  }, 700);
}

/* ---- 6. Header cart badge ---- */
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = cartCount();
}
document.addEventListener("DOMContentLoaded", updateCartBadge);