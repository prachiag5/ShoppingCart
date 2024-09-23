
// Establish a connection to the server using Socket.IO
const socket = io(); // This will automatically connect to the server
function handleAddToCart(productId, title, price, userId) {
  console.log("userId", userId);
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ productId, quantity: 1, title, price }),
  };
  fetch(`/cart/add`, options)
    .then((response) => {
      if (!response.ok) {
        // Error
      }
      console.log("Product added into cart");
    })
    .finally(() => {});
}

function handleSearchClick(event) {
  if (event.key === "Enter") {
    window.location.href = `/search?key=${event.target.value}`;
  }
}

function updateQuantity(productId, quantity, action) {
  if (action === "increase") {
    quantity = Number(quantity) + 1;
  }
  else if (action === "decrease" && quantity > 0) {
    quantity -= 1;
  }
  if (quantity === 0) {
    deleteItem(productId);
    return;
  }
  fetch(`/cart/update`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
  }).then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function deleteItem(productId) {
  console.log("delete item", productId);
  fetch(`/cart/delete`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
  }).then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

// Function to display the cart
function displayCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = JSON.stringify(cart, null, 2);
}

// Function to add an item to the cart
function addItem(productId, title, price, userId) {
  socket.emit('addToCart', { productId, title, price, userId });
}
function updateItem(productId, action, userId) {
  socket.emit('updateCart', { productId, action, userId });
}
function deleteProductItem(productId, userId) {
  socket.emit('deleteCart', { productId, userId });
}

// Listen for cart updates from the server
socket.on('cartUpdated', ({ userId, cart }) => {
  // if (data.userId === userId) { // Check if the update is for the current user
  //   cart = data.cart;
  //   displayCart();
  //   alert('Cart updated!');
  // }
  console.log("cart updated event");
});

// Initial display
//displayCart();

