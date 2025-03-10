$(document).ready(function () {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartUI();
  let allProducts = [];

  $.ajax({
    url: 'https://fakestoreapi.com/products',
    method: 'GET',
    success: function (products) {
      allProducts = products; //
      products.forEach((product, index) => {
        const productCard = `
          <div class="product-card" data-id="${product.id}" data-title="${
          product.title
        }" data-price="${product.price}" data-image="${product.image}">
            <img src="${product.image}" alt="${
          product.title
        }" class="product-image">
            <h3>${product.title.substring(0, 20)}...</h3>
            <p><strong>${product.price}$</strong></p>
            <button class="details-btn" data-id="${
              product.id
            }">Show Detail</button>
            <button class="add-to-cart-btn" data-id="${
              product.id
            }">Add To Cart</button>
          </div>
        `;
        $('#products').append(productCard);

        $('.product-card').eq(index).hide().fadeIn(500);
      });
    },
  });

  $(document).on('mouseenter', '.product-card', function () {
    $(this).css('background-color', '#ffffff');
    $(this).css('color', '#333');
  });

  $(document).on('mouseleave', '.product-card', function () {
    $(this).css('background-color', '#1e1e1e');
    $(this).css('color', '#ffffff');
  });

  $(document).on('click', '.add-to-cart-btn', function () {
    const parent = $(this).closest('.product-card');
    const product = {
      id: parent.data('id'),
      title: parent.data('title'),
      price: parent.data('price'),
      image: parent.data('image'),
    };

    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      alert('This item already in the card!');
      return;
    }

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    const clonedCard = parent.clone(true);
    clonedCard.append('<button class="remove-btn">Remove</button>');
    $('#cart').append(clonedCard);
    updateCartUI();
  });

  $(document).on('click', '.details-btn', function () {
    const button = $(this);
    button.effect('shake', { distance: 5, times: 2 }, 300);

    const productId = parseInt(button.data('id'));
    showProductDetail(productId);
  });

  function showProductDetail(productId) {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    $('#detail-title').text(product.title);
    $('#detail-description').text(product.description);
    $('#detail-price').text(`Price: ${product.price} $`);
    $('#carousel-img').attr('src', product.image);

    $('#prev-product')
      .off('click')
      .on('click', function () {
        let prevProductId = productId - 1;
        if (prevProductId < 1) prevProductId = allProducts.length;
        showProductDetail(prevProductId);
      });

    $('#next-product')
      .off('click')
      .on('click', function () {
        let nextProductId = productId + 1;
        if (nextProductId > allProducts.length) nextProductId = 1;
        showProductDetail(nextProductId);
      });

    $('#overlay').fadeIn();
    $('#product-detail').slideDown();
  }

  $(document).on('click', '#close', function () {
    $('#overlay').fadeOut();
    $('#product-detail').slideUp();
  });

  $(document).on('click', '.remove-btn', function () {
    const cardToRemove = $(this).closest('.product-card');
    const productId = cardToRemove.data('id');

    cart = cart.filter((product) => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));

    cardToRemove.fadeOut(300, function () {
      $(this).remove();
    });

    updateCartUI();
  });

  function updateCartUI() {
    $('#cart').empty();
    $('#cart-count').text(cart.length);

    cart.forEach((product) => {
      $('#cart').append(`
        <div class="cart-item product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title.substring(0, 15)}...</h3>
          <p>${product.price}$</p>
          <button class="remove-btn">Remove</button>
        </div>
      `);
    });
  }
  $('#clear-cart').click(function () {
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
  });
});

$('#search-input').on('input', function () {
  const searchTerm = $(this).val().toLowerCase();
  $('.product-card').each(function () {
    const productTitle = $(this).find('h3').text().toLowerCase();
    if (productTitle.includes(searchTerm)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});
