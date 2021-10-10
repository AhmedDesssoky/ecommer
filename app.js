// variables

const openCart = document.querySelector('.cart__icon')
const closeCart = document.querySelector('.close__cart')
const cartContent = document.querySelector('.cart__centent')
const productDom = document.querySelector('.product__center')
const cartOverlay = document.querySelector('.cart__overlay')
const cartDom = document.querySelector('.cart')
const itemsTotal = document.querySelector('.item__total');
const cartTotal = document.querySelector('.cart__total');
const clearCart = document.querySelector(".clear__cart")


// cart
let cart = [];
let buttonDom = [];

// ui 

class UI {
  displayProudcts(obj) {
    let result = "";
    obj.forEach(({ image, title, id, price }) => {
      result += `<div class="product">
      <div class="image__container">
        <img src=${image} alt="" />
      </div>
      <div class="product__footer">
        <h1>${title}</h1>
        <div class="rating">
          <span>
            <svg>
              <use xlink:href="./images/sprite.svg#icon-star-full"></use>
            </svg>
          </span>
          <span>
            <svg>
              <use xlink:href="./images/sprite.svg#icon-star-full"></use>
            </svg>
          </span>
          <span>
            <svg>
              <use xlink:href="./images/sprite.svg#icon-star-full"></use>
            </svg>
          </span>
          <span>
            <svg>
              <use xlink:href="./images/sprite.svg#icon-star-full"></use>
            </svg>
          </span>
          <span>
            <svg>
              <use xlink:href="./images/sprite.svg#icon-star-empty"></use>
            </svg>
          </span>
        </div>
        <div class="bottom">
          <div class="btn__group">
            <a href="#" class="btn addToCart" data-id=${id}>Add to Cart</a>
            <a href="#" class="btn view">View</a>
          </div>
          <div class="price">$${price}</div>
        </div>
      </div>
    </div>`

    });
    productDom.innerHTML = result

  }

  getButtons() {
    const buttons = [...document.querySelectorAll('.addToCart')];
    buttonDom = buttons;
    buttons.forEach(button => {
      const id = button.dataset.id;
      const inCart = cart.find(item => item.id === id , 10);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        // get product from products
        const cartItem = { ...Storage.getProudcts(id), amount: 1 }
        // add product to cart
        cart = [...cart, cartItem]
        // store the product in local storage 
        Storage.saveCart(cart);
        // setItems 
        this.setItemsValue(cart);
        // display the item in cart

        this.addToCart(cartItem);



      })

    });
  }

  setItemsValue(cart) {
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemTotal += item.amount
    })
    itemsTotal.innerText = itemTotal;
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2))

  }

  addToCart({ title, price, id, image }) {
    let div = document.createElement("div")
    div.classList.add("cart__item")
    div.innerHTML = `
    <img src=${image} alt="">
    <div>
      <h3>${title}</h3>
      <h3 class="price">$${price}</h3>
    </div>
    <div>
      <span class="increase" data-id=${id}>
        <svg>
          <use xlink:href="./images/sprite.svg#icon-angle-up"></use>
        </svg>
      </span>
      <p class="item__amount">1</p>
      <span class="decrease" data-id=${id}>
        <svg>
          <use xlink:href="./images/sprite.svg#icon-angle-down"></use>
        </svg>
      </span>
    </div>
    
    <div>
    <span class="remove__item" data-id=${id}>
      <svg>
        <use xlink:href="./images/sprite.svg#icon-trash"></use>
      </svg>
    </span>
  </div>`
    cartContent.appendChild(div)
  }

  show() {
    cartDom.classList.add("show");
    cartOverlay.classList.add("show");
  }
  hide() {
    cartDom.classList.remove("show");
    cartOverlay.classList.remove("show");
  }
  setApp() {
    cart = Storage.getCart();
    this.setItemsValue(cart);
    this.populate(cart);
    openCart.addEventListener("click", this.show)
    closeCart.addEventListener("click", this.hide)


  }
  populate(cart) {
    cart.forEach(item => this.addToCart(item));
  }
  cartLogic() {
    // Clear Cart
    clearCart.addEventListener("click", () => {
      this.clearCart();
      this.hide();
    });

    // Cart Functionality
    cartContent.addEventListener("click", e => {
      const target = e.target.closest("span");
      const targetElement = target.classList.contains("remove__item");
      if (!target) return;

      if (targetElement) {
        const id = parseInt(target.dataset.id);
        this.removeItem(id);
        cartContent.removeChild(target.parentElement.parentElement);
      } else if (target.classList.contains("increase")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount++;
        Storage.saveCart(cart);
        this. setItemsValue(cart);
        target.nextElementSibling.innerText = tempItem.amount;
      } else if (target.classList.contains("decrease")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount--;

        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this. setItemsValue(cart);
          target.previousElementSibling.innerText = tempItem.amount;
        } else {
          this.removeItem(id);
          cartContent.removeChild(target.parentElement.parentElement);
        }
      }
    });
  }

  clearCart() {
    const cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setItemsValue(cart);
    Storage.saveCart(cart);

    let button = this.singleButton(id);
    button.disabled = false;
    button.innerText = "Add to Cart";
  }
  singleButton(id) {
    return buttonDom.find(button => parseInt(button.dataset.id) === id);
  }

}
// storage 

class Storage {
  static saveProduct(obj) {
    localStorage.setItem("proudcts", JSON.stringify(obj))
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  static getProudcts(id) {
    const proudcts = JSON.parse(localStorage.getItem("proudcts"));
    return proudcts.find(item => item.id === parseInt(id))

  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
// products

class Products {

  async getProducts() {
    try {
      const results = await fetch('products.json')
      const data = await results.json()
      let product = data.items;
      return product
    } catch (error) {
      console.log(err);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const products = new Products();
  const ui = new UI();
  ui.setApp()
  const productObje = await products.getProducts();
  ui.displayProudcts(productObje);
  Storage.saveProduct(productObje);
  ui.getButtons();
  ui.cartLogic()

})