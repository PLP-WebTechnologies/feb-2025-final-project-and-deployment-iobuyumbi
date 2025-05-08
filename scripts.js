// Cart Management
const CartManager = {
  getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
      console.error("Error reading cart:", error);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  },

  addItem(product) {
    const cart = this.getCart();
    cart.push(product);
    this.saveCart(cart);
  },

  removeItem(index) {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  },

  clearCart() {
    localStorage.removeItem("cart");
  },
};

// Modal Management
const ModalManager = {
  modal: null,
  modalImg: null,
  modalTitle: null,
  modalPrice: null,

  init() {
    this.modal = document.getElementById("productModal");
    this.modalImg = document.getElementById("modalImg");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalPrice = document.getElementById("modalPrice");

    // Close modal when clicking the close button
    document
      .querySelector(".close-button")
      ?.addEventListener("click", () => this.close());

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    });
  },

  open(product) {
    if (!this.modal || !product) return;

    this.modalTitle.textContent = product.name;
    this.modalPrice.textContent = `$${product.price}`;
    this.modalImg.src = product.img;
    this.modal.style.display = "flex";
  },

  close() {
    if (this.modal) {
      this.modal.style.display = "none";
    }
  },
};

// Cart UI Management
const CartUI = {
  container: null,

  init(container) {
    this.container = container;
    this.render();
  },

  render() {
    if (!this.container) return;

    const cart = CartManager.getCart();

    if (cart.length === 0) {
      this.container.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    this.container.innerHTML = cart
      .map(
        (item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `
      )
      .join("");

    this.attachRemoveListeners();
  },

  attachRemoveListeners() {
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        CartManager.removeItem(index);
        this.render();
      });
    });
  },
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Modal
  ModalManager.init();

  // Setup product view details buttons
  document.querySelectorAll(".view-details").forEach((button) => {
    button.addEventListener("click", function () {
      const product = this.closest(".product");
      if (!product) return;

      const productData = {
        name: product.getAttribute("data-name"),
        price: product.getAttribute("data-price"),
        img: product.getAttribute("data-img"),
      };

      ModalManager.open(productData);
    });
  });

  // Setup Add to Cart button in modal
  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const product = {
        name: ModalManager.modalTitle.textContent,
        price: parseFloat(ModalManager.modalPrice.textContent.replace("$", "")),
        image: ModalManager.modalImg.src,
      };

      CartManager.addItem(product);
      alert("Added to cart!");
      ModalManager.close();
    });
  }

  // Initialize Cart UI if on cart page
  const cartContainer = document.querySelector(".cart-items");
  if (cartContainer) {
    CartUI.init(cartContainer);
  }

  // Setup checkout form
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for your purchase!");
      CartManager.clearCart();
      window.location.href = "index.html";
    });
  }
});
