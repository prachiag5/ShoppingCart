
function handleAddToCart(productId, title, price) {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ productId, quantity: 1, title, price }),
  };
  fetch("http://localhost:4000/cart/add", options)
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

function updateQuantity(productId, action) {
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

