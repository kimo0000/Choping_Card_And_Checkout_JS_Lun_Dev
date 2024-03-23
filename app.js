const listProducts = document.querySelector(".list_products"),
  shopEl = document.querySelector(".icon"),
  countDisplay = document.querySelector(".count"),
  listShoping = document.querySelector(".list_shoping"),
  closeBtn = document.querySelector(".shoping_card .btns .close"),
  listPage = document.querySelector(".list_page"),
  checkoutBtn = document.querySelector(".check"),
  popupEL = document.querySelector(".popup"),
  productListCheck = popupEL.querySelector(".product_list"),
  checkKeeping = popupEL.querySelector(".keep_shoping"),
  totalQuantityHTML = popupEL.querySelector(".all_quantity"),
  totalPriceHTML = popupEL.querySelector(".price_to"),
  totalCountCard = document.querySelector(".card_count");

// console.log(totalCountCard);

let allProducts = [];
let cards = [];
let allProductInPage = [];

shopEl.addEventListener("click", () => {
  document.body.classList.toggle("show");
});

closeBtn.addEventListener("click", () => {
  document.body.classList.remove("show");
});

function goToCheck() {}

checkoutBtn.addEventListener("click", goToCheck);

const showDataInHTML = () => {
  listProducts.innerHTML = "";
  if (allProducts) {
    allProducts.forEach((item) => {
      const { id, image, name, price } = item;
      let liTag = document.createElement("li");
      liTag.classList.add("product");
      liTag.setAttribute("data-id", id);
      liTag.innerHTML = ` <img src="${image}" alt="image">
                            <div class="content">
                              <p>${name}</p>
                              <span class="price">$${price}</span>
                            </div>
                            <button class="add" onclick="ShopingCard(this.parentElement.dataset.id)">Add Product</button>`;

      listProducts.appendChild(liTag);
    });
  }
};

function ShopingCard(productId) {
  let positionProduct = cards.findIndex((value) => value.product_id == productId);
  if (!cards.length) {
    cards = [
      {
        product_id: productId,
        quantity: 1,
      },
    ];
  } else if (positionProduct < 0) {
    cards.push({
      product_id: productId,
      quantity: 1,
    });
  } else {
    cards[positionProduct].quantity += 1;
  }

  addToMemory();
  addToShopingCard();
  countDisplay.innerText = cards.length;
}

function addToMemory() {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function addToShopingCard() {
  let divTag = "";
  listShoping.innerHTML = "";
  totalCountCard.innerText = cards.length;
  if (cards.length) {
    cards.forEach((item) => {
      let positionEl = allProducts.findIndex(
        (value) => value.id == item.product_id
      );
      let info = allProducts[positionEl];
      const { quantity } = item;
      const { image, name, price } = info;
      divTag += `<div class="item" data-id="${item.product_id}">
                          <div class="info">
                              <img src="${image}" alt="">
                              <div>
                              <div class="title">${name}</div>
                              <div class="price">$${price}/1 Product</div>
                              </div>
                          </div>
                          <div class="quantity">
                              <span class="minus">-</span>
                              <span>${quantity}</span>
                              <span class="plus">+</span>
                          </div>
                      </div>`;
    });

    listShoping.innerHTML = divTag;
  }
}

listShoping.addEventListener("click", ({ target }) => {
  if (target.classList.contains("minus") || target.classList.contains("plus")) {
    let product_id = target.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (target.classList.contains("plus")) {
      type = "plus";
    }

    changeQuantity(product_id, type);
    countDisplay.innerText = cards.length;
  }

});

function changeQuantity(id, type) {
  let positionEl = cards.findIndex((value) => value.product_id == id);
  if (type == "plus") {
    cards[positionEl].quantity += 1;
  } else {
    let infoQuantity = cards[positionEl].quantity - 1;
    if (infoQuantity > 0) {
      cards[positionEl].quantity = infoQuantity;
    } else {
      cards.splice(positionEl, 1);
    }
  }

  addToMemory();
  addToShopingCard();
  addToCheckPage();
}

function initdata() {
  fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    showDataInHTML();
    
    if (localStorage.getItem("cards")) {
      cards = JSON.parse(localStorage.getItem("cards") || "[]");
      addToShopingCard();
      countDisplay.innerText = cards.length;
      totalCountCard.innerText = cards.length;
      addToCheckPage();
      }

      const productsBox = listProducts.querySelectorAll(".product");
      allProductInPage = productsBox;
      loadPage();
    });
}

initdata();

function addToCheckPage() {
  productListCheck.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;
  if(cards.length){
     cards.forEach(el => {
      let position = allProducts.findIndex(value => value.id == el.product_id);
      let checkInfo = allProducts[position];
      const liTag = document.createElement("li");
      liTag.classList.add('item');
      liTag.innerHTML = `<img src="${checkInfo.image}" alt="">
                          <div class="product_name">
                          <div class="title">${checkInfo.name}</div>
                          <span>$${checkInfo.price}/1</span> product</span>
                          </div>
                          <div class="quantity">${el.quantity}</div>
                          <div class="price">$${checkInfo.price * el.quantity}</div>`;
      
      productListCheck.appendChild(liTag);
      totalQuantity += el.quantity
      totalPrice += checkInfo.price * el.quantity;
     })
  }

  totalQuantityHTML.innerText = totalQuantity;
  totalPriceHTML.innerText = totalPrice;
}

let page = 1;
let totalPages = 3;

function loadPage() {
  let start = totalPages * (page - 1);
  let end = totalPages * page - 1;

  allProductInPage.forEach((item, index) => {
    if (index >= start && index <= end) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });

  showPageToHTML();
}

function showPageToHTML() {
  let count = Math.ceil(allProductInPage.length / totalPages);
  let liTag = "";
  let activeEl;

  if (page > 1) {
    liTag += `<li class="prev" onclick="changePage(${page - 1})">Prev</li>`;
  }

  for (let i = 1; i <= count; i++) {
    i == page ? (activeEl = "active") : (activeEl = "");
    liTag += `<li class="${activeEl}" onclick="changePage(${i})">${i}</li>`;
  }

  if (page < count) {
    liTag += `<li class="next" onclick="changePage(${page + 1})">Next</li>`;
  }

  listPage.innerHTML = liTag;
}

function changePage(i) {
  page = i;
  loadPage();
}

checkoutBtn.addEventListener('click', () => {
  popupEL.classList.add('show');
  document.body.classList.remove("show");
});

checkKeeping.addEventListener('click', () => {
  popupEL.classList.remove("show");
});


