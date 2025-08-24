
//SLIDER 
const track = document.getElementById('slider-track');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = 5;
let currentIndex = 1;
let interval;

function updateSlide(withTransition = true) {
  if (!track) return;

  if (withTransition) {
    track.style.transition = 'transform 0.5s ease-in-out';
  } else {
    track.style.transition = 'none';
  }
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  indicators.forEach(dot => dot.classList.remove('active-indicator'));
  if (currentIndex >= 1 && currentIndex <= totalSlides && indicators[currentIndex - 1]) {
    indicators[currentIndex - 1].classList.add('active-indicator');
  }
}

function startAutoSlide() {
  if (!track) return;
  stopAutoSlide(); 
  interval = setInterval(() => {
    currentIndex++;
    updateSlide();

    track.addEventListener('transitionend', () => {
      if (currentIndex === totalSlides + 1) {
        currentIndex = 1;
        updateSlide(false);
      }
    }, { once: true });

  }, 5000);
}

function stopAutoSlide() {
  if (interval) clearInterval(interval);
}

if (track) {
  updateSlide();
  startAutoSlide();

  indicators.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      currentIndex = parseInt(dot.getAttribute('data-index'));
      updateSlide();
      setTimeout(startAutoSlide, 6000);
    });
  });

  
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
  });
}

// FLASH SALE TIMER 
const daysE1 = document.getElementById('days')
const hoursE1 = document.getElementById('hours')
const minutesE1 = document.getElementById('minutes')
const secondsE1 = document.getElementById('seconds')

let endTime
if (daysE1 && hoursE1 && minutesE1 && secondsE1) {
  if (localStorage.getItem('flashSaleEnd')) {
    endTime = new Date(localStorage.getItem('flashSaleEnd'))
  } else {
    endTime = new Date()
    endTime.setDate(endTime.getDate() + 3)
    localStorage.setItem("flashSaleEnd", endTime)
  }

  function updateTimer() {
    const now = new Date()
    const diff = endTime - now

    if (diff <= 0) {
      clearInterval(timerInterval)
      localStorage.removeItem('flashSaleEnd')
      alert("Discount finished")
      daysE1.textContent = '00'
      hoursE1.textContent = '00'
      minutesE1.textContent = '00'
      secondsE1.textContent = '00'
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)

    daysE1.textContent = days.toString().padStart(2, '0')
    hoursE1.textContent = hours.toString().padStart(2, '0')
    minutesE1.textContent = minutes.toString().padStart(2, '0')
    secondsE1.textContent = seconds.toString().padStart(2, '0')
  }

  const timerInterval = setInterval(updateTimer, 1000)
  updateTimer()
}


// Modal 
const STAR_FULL = "./assets/icons/star-icon.svg"
const STAR_EMPTY = "./assets/icons/gray-star.svg"

function renderStars(rating, max = 5) {
  const container = document.createElement("div")
  container.className = "stars-row"

  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75
  const empty = max - full - (hasHalf ? 1 : 0)

  // Full stars
  for (let i = 0; i < full; i++) {
    const img = document.createElement("img")
    img.src = STAR_FULL
    img.alt = "star"
    container.appendChild(img)
  }

  
  if (hasHalf) {
    const img = document.createElement("img")
    img.src = STAR_FULL
    container.appendChild(img)
  }

  // Empty stars
  for (let i = 0; i < empty; i++) {
    const img = document.createElement("img")
    img.src = STAR_EMPTY
    container.appendChild(img)
  }
  return container
}

const modal = document.getElementById("productModal")
if (modal) {
  const modalName = document.getElementById("modalName")
  const modalPrice = document.getElementById("modalPrice")
  const modalCurrentPrice = document.getElementById("modalCurrentPrice")
  const modalStarsWrap = document.getElementById("modalStars")
  const modalImage = document.getElementById("modalImage")
  const modalRatingCount = document.getElementById("modalRatingCount")
  const closeBtn = document.querySelector("#productModal .close")

  
  document.querySelectorAll(".view__btn, .suggestion-view__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      
      const card = btn.closest(".card__item, .product__item, .our-products__item, .suggestion__item")
      if (!card) return

      modalName.textContent = card.dataset.name || ""
      modalPrice.textContent = card.dataset.price || ""
      modalCurrentPrice.textContent = card.dataset.currentPrice || ""
      modalImage.src = card.dataset.image || ""
      modalStarsWrap.innerHTML = ""
      modalStarsWrap.appendChild(renderStars(parseFloat(card.dataset.rating || "0")))
      modalRatingCount.textContent = `(${card.dataset.ratingCount || 0})`

      modal.style.display = "flex"
    })
  })

  closeBtn.onclick = () => (modal.style.display = "none")
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none" }
}






document.addEventListener("DOMContentLoaded", () => {
  const wishlistBtns = document.querySelectorAll(".wishlist__btn");
  const wishlistConatiner = document.querySelector(".wishlist__items");
  const emptyMessage = document.querySelector(".wishlist-empty");
  const wishlistTitle = document.querySelector(".wishlist-top h1");

  
  if (wishlistBtns.length > 0) {
    wishlistBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const product = btn.closest(".product__item, .our-products__item, .card__item");
        if (!product) return;

        const productData = {
          name: product.dataset.name,
          price: product.dataset.price,
          currentPrice: product.dataset.currentPrice || "",
          image: product.dataset.image,
          
          discount: (product.dataset.currentPrice && parseFloat(product.dataset.currentPrice.replace("$","")) < parseFloat(product.dataset.price.replace("$",""))) 
                    ? Math.round((1 - parseFloat(product.dataset.currentPrice.replace("$","")) / parseFloat(product.dataset.price.replace("$",""))) * 100) + "% OFF"
                    : ""
        };

        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const exists = wishlist.find(item => item.name === productData.name);

        if (exists) {
          wishlist = wishlist.filter(item => item.name !== productData.name);
          btn.classList.remove("active");
        } else {
          wishlist.push(productData);
          btn.classList.add("active");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlist();
        updateWishlistCount();
      });
    });

    
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistBtns.forEach(btn => {
      const product = btn.closest(".product__item, .our-products__item, .card__item");
      if (product && wishlist.some(item => item.name === product.dataset.name)) {
        btn.classList.add("active");
      }
    });
  }

  
  function renderWishlist() {
    if (!wishlistConatiner) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistConatiner.querySelectorAll(".wishlist__item").forEach(el => el.remove());

    if (wishlist.length === 0) {
      emptyMessage && (emptyMessage.style.display = "block");
      return;
    } else {
      emptyMessage && (emptyMessage.style.display = "none");
    }

    wishlist.forEach((product, index) => {
      const item = document.createElement("div");
      item.classList.add("wishlist__item");

      item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="wishlist__item-img">
        ${product.discount ? `<p class="product__discount">${product.discount}</p>` : ""}
        <button class="product__delete">
          <img src="./assets/icons/icon-delete.svg" alt="icon-delete">
        </button>
        <button class="add-to-cart-btns"><img src="./assets/icons/cart-icon.svg" alt="cart-icon">Add To Cart</button>
        <p class="product__name">${product.name}</p>
        <div class="product__price">
          <span class="orginal__price">${product.price}</span>
          ${product.currentPrice ? `<span class="current__price">${product.currentPrice}</span>` : ""}
        </div>
      `;

      
      item.querySelector(".product__delete").addEventListener("click", () => {
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlist();
        updateWishlistCount();
      });

    
      item.querySelector(".add-to-cart-btns").addEventListener("click", () => {
        const productForCart = {
          name: product.name,
          price: product.price,
          currentPrice: product.currentPrice,
          image: product.image
        };
        addToCart(productForCart);
      });

      wishlistConatiner.appendChild(item);
    });
  }


  function updateWishlistCount() {
    if (!wishlistTitle) return;
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistTitle.textContent = `Wishlist  ( ${wishlist.length}  )`;
  }

  
  renderWishlist();
  updateWishlistCount();
});




// ADD TO CART BTNS 
function getCart() {
    let cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Mahsulotni savatga qoshish
function addToCart(product) {
    let cart = getCart();
    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    saveCart(cart);
}

// Mahsulotni ochirish
function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
}

// Quantity yangilash
function updateQuantity(name, quantity) {
    let cart = getCart();
    let product = cart.find(item => item.name === name);
    if (product) {
        product.quantity = quantity;
    }
    saveCart(cart);
}

// Subtotal hisoblash
function subtotal(item) {
    const priceNum = parseFloat(item.price.replace("$", ""));
    return priceNum * item.quantity;
}

// Total hisoblash
function calculateTotal() {
    let cart = getCart();
    return cart.reduce((total, item) => total + subtotal(item), 0);
}

function setupAddToCartBtns() {
    const addToCartBtns = document.querySelectorAll(".product__item .add-to-cart-btn, .our-products__item .add-to-cart-btn ");

    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const productEl = btn.closest(".product__item, .our-products__item");

            const product = {
                name: productEl.dataset.name,
                price: productEl.dataset.price,
                currentPrice: productEl.dataset.currentPrice,
                image: productEl.dataset.image,
                rating: productEl.dataset.rating,
                ratingCount: productEl.dataset.ratingCount
            };

            addToCart(product);
            btn.textContent = "Added";
            btn.disabled = true;
            renderCart();
        });
    });
}


function restoreCartButtons() {
    let cart = getCart();
    cart.forEach(item => {
        const productEl = document.querySelector(`.product__item[data-name="${item.name}"]`);
        if (productEl) {
            const btn = productEl.querySelector(".add-to-cart-btn");
            if (btn) {
                btn.textContent = "Added";
                btn.disabled = true;
            }
        }
    });
}


function renderCart() {
    const cart = getCart();
    const cartContainer = document.querySelector(".cartpage");

    if (!cartContainer) return; 

  
    const header = cartContainer.querySelector(".cartpage__item");
    cartContainer.innerHTML = "";
    cartContainer.appendChild(header);

    if (cart.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Your cart is empty!";
        emptyMsg.style.margin = "20px";
        cartContainer.appendChild(emptyMsg);
        updateCartTotal();
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cartpage__item2");

        cartItem.innerHTML = `
            <div class="cartpage_img">
                <img src="${item.image}" alt="${item.name}">
                <button class="product__remove">
                    <img src="./assets/icons/icon-x.svg" alt="remove">
                </button>
                <p>${item.name}</p>
            </div>

            <p style="margin-left: 177px;" class="cartpage__price">${item.price}</p>
            <input style="margin-left: 282px;" type="number" min="1" max="100" value="${item.quantity}">
            <p style="margin-left: 281px;" class="subtotal">$${subtotal(item)}</p>
        `;

       
        cartItem.querySelector(".product__remove").addEventListener("click", () => {
            removeFromCart(item.name);
            renderCart();
        });

        
        const qtyInput = cartItem.querySelector("input");
        qtyInput.addEventListener("change", (e) => {
            let newQty = parseInt(e.target.value);
            if (newQty < 1) newQty = 1;
            updateQuantity(item.name, newQty);
            renderCart();
        });

        cartContainer.appendChild(cartItem);
    });

    
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("cartpage__buttons");
    buttonsDiv.innerHTML = `
        <button class="return-shop-button">Return To Shop</button>
        <button class="update-cart-button">Update Cart</button>
    `;
    cartContainer.appendChild(buttonsDiv);

    
    buttonsDiv.querySelector(".return-shop-button").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    
    buttonsDiv.querySelector(".update-cart-button").addEventListener("click", () => {
        renderCart();
    });

    updateCartTotal();
}


function updateCartTotal() {
    const cart = getCart();
    const subtotalElement = document.querySelector(".cart-subtotal + p");
    const totalElement = document.querySelector(".cart__total + p");

    const total = calculateTotal();

    if (subtotalElement) subtotalElement.textContent = `$${total}`;
    if (totalElement) totalElement.textContent = `$${total}`;
}


document.addEventListener("DOMContentLoaded", () => {
    setupAddToCartBtns();
    restoreCartButtons();
    renderCart();
});








function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}


function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
    const cart = getCart();
    const count = cart.length; 
    const badge = document.querySelector(".cart-count");

    if (!badge) return;

    if (count > 0) {
        badge.textContent = count;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const product = btn.closest(".product__item");

            const productData = {
                name: product.dataset.name,
                price: product.dataset.price,
                image: product.dataset.image,
                quantity: 1
            };

            let cart = getCart();

            
            const existing = cart.find(item => item.name === productData.name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(productData);
            }

            saveCart(cart);
            updateCartBadge(); 
        });
    });

    
    updateCartBadge();
});



// up button 

document.addEventListener("DOMContentLoaded", () => {
    const upButton = document.querySelector(".up-button");

    if (upButton) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 500) {
                upButton.classList.add("visible");
            } else {
                upButton.classList.remove("visible");
            }
        });

        upButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});



// Rozmatov Sardor 

// Form section 

document.addEventListener("DOMContentLoaded", () => {
    // Notification container
    const notification = document.createElement("div");
    notification.classList.add("profile-notification");
    document.body.appendChild(notification);

    function showNotification(message, type = "success") {
        notification.textContent = message;
        notification.className = "profile-notification " + type + " show";

        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }

    // --- Profil formasi elementlari ---
    const fnameInput = document.getElementById("fname");
    const lnameInput = document.getElementById("lname");
    const emailInput = document.getElementById("email");
    const addressInput = document.getElementById("address");

    const currentPasswordInput = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    const saveBtn = document.querySelector(".save_btn");
    const cancelBtn = document.querySelector(".cancel_btn");

    // LocalStorage'dan ma'lumot olish
    let userData = JSON.parse(localStorage.getItem("userData")) || {
        fname: "Md",
        lname: "Rimel",
        email: "rimel1111@gmail.com",
        address: "Kingston, 5236, United State",
        password: "123456"
    };

    // Formani to'ldirish
    function populateForm() {
        if (!fnameInput) return;
        fnameInput.value = userData.fname;
        lnameInput.value = userData.lname;
        emailInput.value = userData.email;
        addressInput.value = userData.address;

        if (currentPasswordInput) currentPasswordInput.value = "";
        if (newPasswordInput) newPasswordInput.value = "";
        if (confirmPasswordInput) confirmPasswordInput.value = "";
    }
    populateForm();

    // Save qilish
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const isPasswordChanging =
                (currentPasswordInput && currentPasswordInput.value) ||
                (newPasswordInput && newPasswordInput.value) ||
                (confirmPasswordInput && confirmPasswordInput.value);

            if (isPasswordChanging) {
                if (currentPasswordInput.value !== userData.password) {
                    showNotification("Current password is incorrect!", "error");
                    return;
                }
                if (newPasswordInput.value !== confirmPasswordInput.value) {
                    showNotification("New password and confirmation do not match!", "error");
                    return;
                }
                userData.password = newPasswordInput.value;
            }

            userData.fname = fnameInput.value;
            userData.lname = lnameInput.value;
            userData.email = emailInput.value;
            userData.address = addressInput.value;

            localStorage.setItem("userData", JSON.stringify(userData));
            showNotification("Profile updated successfully!", "success");
            populateForm();
        });
    }

    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            populateForm();
        });
    }
});



// Rozmatov Sardor  

document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = document.querySelectorAll(".thumbnails-image img")
  const mainImage = document.querySelector(".main-image img")

  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {

      const tempSrc = mainImage.src
      const tempAlt = mainImage.alt

      mainImage.src = thumb.src
      mainImage.alt = thumb.alt
      thumb.src = tempSrc
      thumb.alt = tempAlt
    })
  })
})




// Rozmatov Sardor 

document.addEventListener("DOMContentLoaded", () => {
  const colorInputs = document.querySelectorAll(".colors-input input")
  let selectedColor = null

  colorInputs.forEach(input => {
    input.addEventListener("change", () => {
      selectedColor = input.value
      console.log("Selected color:", selectedColor)
    })
  })

  const sizeButtons = document.querySelectorAll(".size_btns button")
  let selectedSize = document.querySelector(".size_btns .active")?.textContent || null

  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach(b => b.classList.remove("active"))
      btn.classList.add("active")
      selectedSize = btn.textContent
      console.log("Selected size:", selectedSize)
    })
  })

  const minusBtn = document.querySelector(".count .minus")
  const plusBtn = document.querySelector(".count .plus")
  const numberEl = document.querySelector(".count .numbers")

  let quantity = parseInt(numberEl.textContent)

  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--
      numberEl.textContent = quantity
    }
  })

  plusBtn.addEventListener("click", () => {
    quantity++
    numberEl.textContent = quantity
  })

  const buyNowBtn = document.querySelector(".quantitiy__btn")

  buyNowBtn.addEventListener("click", () => {
    const productName = document.querySelector(".product-info h1").textContent
    const price = document.querySelector(".product-info .price").textContent

    if (!selectedColor) {
      alert("Please, select color!")
      return
    }
    if (!selectedSize) {
      alert("Please, select sizee!")
      return
    }

    const orderData = {
      product:productName,
      price: price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      total:`$${(parseFloat(price.replace("$", "")) * quantity).toFixed(2)}`

    }

    console.log("Product details:", orderData)
  })
})


const sizeButtons = document.querySelectorAll(".size_btns button")
let selectedSize = document.querySelector(".size_btns  .active")?.textContent || null

sizeButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault()

    sizeButtons.forEach(b => b.classList.remove("active"))

    btn.classList.add("active")

    selectedSize = btn.textContent.trim()
    console.log("Slected size:", selectedSize)
  })
})



























































  


