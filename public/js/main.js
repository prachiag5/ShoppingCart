
function handleAddToCart(productId, title, price) {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ productId, quantity: 1, title, price }),
  };
  //http://localhost:4000
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
    quantity += 1;
  }
  else if (action === "decrease" && quantity > 0) {
    quantity -= 1;
  }
  console.log("inside updateQuantity");
  fetch(`/cart/update`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, action })
  }).then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}
function updateHandler(productId) {
  console.log("inside update handler", productId);
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
function addItem() {
  const newItem = { productId: `product${cart.length + 1}`, quantity: 1 };
  cart.push(newItem);
  socket.emit('updateCart', { userId, cart }); // Emit cart update to server
}

// Listen for cart updates from the server
socket.on('cartUpdated', (data) => {
  if (data.userId === userId) { // Check if the update is for the current user
    cart = data.cart;
    displayCart();
    alert('Cart updated!');
  }
});

// Initial display
//displayCart();

