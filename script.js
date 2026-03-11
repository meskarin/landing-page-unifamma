const API_URL = "https://fakestoreapi.com/products";
/*TODO: colocar dentro de um secret manager*/

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='200'>
      <rect width='100%' height='100%' fill='#f7f2ea'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Space Grotesk, sans-serif' font-size='16' fill='#6f6b64'>
        Imagem indisponivel
      </text>
    </svg>`
  );
  /*TODO: gerar uma imagem de svg de fallback para subistituir isso aqui*/

const grid = document.getElementById("products-grid");
const filters = document.querySelectorAll(".filter");

let allProducts = [];

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const truncate = (text, limit = 110) => {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 3)}...`;
};

const renderProducts = (products) => {
  grid.innerHTML = "";

  if (!products.length) {
    return;
  }

  products.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const category = product.category || "categoria";
    const price = priceFormatter.format(product.price || 0);

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image || FALLBACK_IMAGE}" alt="${product.title}" loading="lazy" />
      </div>
      <div class="product-meta">
        <span>${category}</span>
        <span>ID ${product.id}</span>
      </div>
      <div class="product-title">${product.title}</div>
      <div class="product-desc">${truncate(product.description)}</div>
      <div class="product-footer">
        <span class="price">${price}</span>
        <span class="chip">Mais detalhes</span>
        
      </div>
    `;

    const img = card.querySelector("img");
    img.addEventListener("error", () => {
      img.src = FALLBACK_IMAGE;
    });

    grid.appendChild(card);
  });
};
/* botão sem ação, não foi solicitado no escopo da atividade */

const setActiveFilter = (button) => {
  filters.forEach((filter) => filter.classList.remove("active"));
  button.classList.add("active");
};

const applyFilter = (category) => {
  if (category === "all") {
    renderProducts(allProducts);
    return;
  }
  const filtered = allProducts.filter((product) => product.category === category);
  renderProducts(filtered);
};

const initFilters = () => {
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveFilter(button);
      applyFilter(button.dataset.category);
    });
  });
};

const loadProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro na requisicao: ${response.status}`);
    }
    const data = await response.json();
    allProducts = Array.isArray(data) ? data : [];
    renderProducts(allProducts);
  } catch (error) {
    console.error(error);
  }
};

initFilters();
loadProducts();
