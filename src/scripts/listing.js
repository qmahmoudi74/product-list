const user = "d341fd64-d74c-42e7-ae4c-11375e1ef58c";
const list = document.getElementById("list");
const pagination = document.getElementById("pagination");
const search = document.getElementById("search");

function onLikeClick(productId, likeId) {
  if (likeId)
    fetch(`http://localhost:3000/likes/${likeId}`, {
      method: "delete"
    });
  else
    fetch(`http://localhost:3000/likes`, {
      method: "post",
      body: JSON.stringify({ productId, userId: user }),
      headers: {
        "Content-Type": "application/json"
      }
    });
}

const createProductCard = ({ id, name, desc, price, likes = [] }) => {
  const isLiked = likes.some(({ userId }) => userId === user);

  const likeId = isLiked
    ? likes.filter(({ userId }) => userId === user)[0].id
    : null;

  const productPrice = (parseFloat(price) * 1000).toLocaleString("fa-IR");

  return `
    <li class="product-item">
      <div class="product-item__likes">
        <img
          data-like='${JSON.stringify({ productId: id, likeId })}'
          src="./assets/${isLiked ? "heart-fill.svg" : "heart.svg"}"
          data-id="like"
          width="16px" height="16px"
        />
        
        <p>${likes.length}</p>
      </div>

      <a href="./product.html?id=${id}">
        <h5 class="product-item__name">${name}</h5>
      </a>
      
      <p class="product-item__desc">${desc}</p>
      
      <h6 class="product-item__price">
        ${productPrice} تومان
      </h6>
    </li>
`;
};

const createPagination = (total) => {
  const items = new Array(total).fill(0).map(
    (_, index) => `
      <button value="${index + 1}">
        ${index + 1}
      </button>
    `
  );

  pagination.innerHTML = items.reduce((acc, curr) => (acc += curr), "");
};

let id;

search.addEventListener("input", ({ target }) => {
  if (id) clearTimeout(id);

  id = setTimeout(() => {
    getProductList({ q: target.value }).then((data) => {
      list.innerHTML = data
        .map((product) => createProductCard(product))
        .reduce((acc, curr) => (acc += curr), "");
    });
  }, 1000);
});

pagination.addEventListener("click", ({ target }) => {
  location.assign(`?page=${target.value}`);

  getProductList({ page: +target.value }).then((data) => {
    list.innerHTML = data
      .map((product) => createProductCard(product))
      .reduce((acc, curr) => (acc += curr), "");
  });
});

list.addEventListener("click", ({ target }) => {
  if (target.dataset.id === "like") {
    const { productId, likeId } = JSON.parse(target.dataset.like);
    onLikeClick(productId, likeId);
  }
});

const getProductList = async ({ page, limit = 12, q }) => {
  const res = await fetch(
    `http://localhost:3000/products?_embed=likes&_page=${page}&_limit=${limit}${
      q ? `&q=${q}` : ""
    }`
  );
  const data = await res.json();
  return data;
};

const query = (queryString = "") =>
  queryString
    .slice(1)
    .split("&")
    .reduce((acc, curr) => {
      const [key, value] = curr.split("=");
      return { ...acc, [key]: value };
    }, {});

getProductList({ page: query(location.search).page }).then((data) => {
  list.innerHTML = data
    .map((product) => createProductCard(product))
    .reduce((acc, curr) => (acc += curr), "");
  createPagination(1000);
});
