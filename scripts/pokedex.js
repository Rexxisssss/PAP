const pokedexBtn = document.getElementById("pokedex-button");
const pokedexWrapper = document.getElementById("pokedex-wrapper");
const pokedexOpenSound = document.getElementById("pokedex-open-sound");

const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("type-filter");
const shinyToggle = document.getElementById("shiny-toggle");

const pokemonListContainer = document.getElementById("pokemon-list");
const selectSound = document.getElementById("select-sound");

let currentPokemonData = null;

pokedexBtn.addEventListener("click", () => {
  const opening = !pokedexWrapper.classList.contains("open");

  pokedexWrapper.classList.toggle("open");
  pokedexWrapper.classList.toggle("closed");

  // Atualiza apenas o texto da <span> dentro do botão
  const textSpan = pokedexBtn.querySelector("span");
  textSpan.textContent = opening ? "Fechar Pokédex" : "Abrir Pokédex";

  if (opening) pokedexOpenSound.play();
});

// Carrega e cria lista com filtros dinâmicos
async function loadPokemonList() {
  for (let i = 1; i <= 151; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();
    data.shiny = false;
    createPokemonListItem(data);
  }
}

function createPokemonListItem(data) {
  const item = document.createElement("div");
  item.className = "pokemon-item";
  item.dataset.name = data.name;
  item.dataset.id = data.id;
  item.dataset.types = data.types.map(t => t.type.name).join(",");
  item.innerHTML = `<img src="${data.sprites.front_default}" alt="${data.name}">
    <span>#${String(data.id).padStart(3,"0")} ${capitalize(data.name)}</span>`;
  item.addEventListener("click", () => showPokemon(data, item));
  pokemonListContainer.appendChild(item);
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const shiny = shinyToggle.checked;

  document.querySelectorAll(".pokemon-item").forEach(item => {
    const name = item.dataset.name.toLowerCase();
    const id = item.dataset.id;
    const types = item.dataset.types.split(",");

    // Pesquisa permite encontrar por nome ou por id que comece pelo termo
    const matchesSearch =
      term === "" ||
      name.includes(term) ||
      id.startsWith(term);

    const matchesType = type === "all" || types.includes(type);

    const visible = matchesSearch && matchesType;

    item.style.display = visible ? "" : "none";

    if (visible) {
      item.querySelector("img").src = shiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
  });
}

async function showPokemon(data, item) {
  const res = await fetch(data.url || `https://pokeapi.co/api/v2/pokemon/${data.id}`);
  const det = data.stats ? data : await res.json();
  currentPokemonData = det;

  document.getElementById("pokemon-image").src = shinyToggle.checked
    ? det.sprites.front_shiny
    : det.sprites.front_default;

  document.getElementById("pokemon-name").textContent = capitalize(det.name);
  document.getElementById("pokemon-id").textContent = det.id;
  document.getElementById("pokemon-types").textContent =
    det.types.map(t => capitalize(t.type.name)).join(", ");
  document.getElementById("pokemon-abilities").textContent =
    det.abilities.map(a => capitalize(a.ability.name)).join(", ");
  document.getElementById("pokemon-height").textContent = `${det.height/10} m`;
  document.getElementById("pokemon-weight").textContent = `${det.weight/10} kg`;

  const statsList = document.getElementById("pokemon-stats");
  statsList.innerHTML = "";
  det.stats.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${capitalize(s.stat.name)}: ${s.base_stat}`;
    statsList.appendChild(li);
  });

  selectSound.play();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
shinyToggle.addEventListener("change", applyFilters);

shinyToggle.addEventListener("change", () => {
  applyFilters(); // Atualiza imagens na lista
  if (currentPokemonData) {
    document.getElementById("pokemon-image").src = shinyToggle.checked
      ? currentPokemonData.sprites.front_shiny
      : currentPokemonData.sprites.front_default;
  }
});

loadPokemonList();
