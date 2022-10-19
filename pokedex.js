const pokedex$$ = document.querySelector("#pokedex");
const searchInput$$ = document.querySelector("input[name=filter]");
let ALL_POKEMONS_INFO = []; //MAYUS cuando una variable global scope puede ser usada por todas

const getAllPokemons = () =>
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json())
    .then((response) => response.results)
    .catch((error) =>
      console.log("Error obteniendo todos los pokemons", error)
    );

const getOnePokemon = async (url) => {
  try {
    const response = await fetch(url);
    const result = await response.json();

    const pokemon = {
      sprites: result.sprites,
      name: result.name,
      id: result.id,
      types: result.types.map((element) => element.type.name),
      image: result.sprites.front_default,
    };

    return pokemon;
  } catch (error) {
    console.log("Error obteniendo pokemon " + url, error);
  }
};

const renderTypes = (types, container) => {
  const div$$ = document.createElement("div");
  div$$.classList.add("card-subtitle", "types-container");

  types.forEach((type) => {
    const typeContainer$$ = document.createElement("p");
    typeContainer$$.setAttribute("pokemon-type", type);
    typeContainer$$.style.backgroundColor = typeColors[type];
    typeContainer$$.classList.add("type");
    typeContainer$$.textContent = type;
    typeContainer$$.addEventListener("click", () => {
      searchInput$$.setAttribute("value", type);
      search(type);
    });
    div$$.appendChild(typeContainer$$);
  });

  container.appendChild(div$$);
};

const cleanPokedex = () => (pokedex$$.innerHTML = "");

const renderNoResults = () => {
  
  const divError$$ = document.createElement('div');
  divError$$.classList.add("border-error");

  const pRed$$ = document.createElement("p");
  pRed$$.classList.add("card-title-error");
  pRed$$.textContent = "¡Ningún pokemon coincide con tu búsqueda!";
  
  const pGrey$$ = document.createElement("p");
  pGrey$$.classList.add("card-subtitle-error");
  pGrey$$.textContent = "Prueba estas sugerencias para encontrar un Pokémon:";
  
  const pGrey1$$ = document.createElement("p");
  pGrey1$$.classList.add("card-subtitle-error");
  pGrey1$$.textContent = "· Reduce el número de parámetros de búsqueda";

  const pGrey2$$ = document.createElement("p");
  pGrey2$$.classList.add("card-subtitle-error");
  pGrey2$$.textContent = "· Busca solo un tipo de Pokémon a la vez";

  const pGrey3$$ = document.createElement("p");
  pGrey3$$.classList.add("card-subtitle-error");
  pGrey3$$.textContent = "· Prueba múltiples tamaños y formas de cuerpo";

  pokedex$$.appendChild(divError$$);
  divError$$.appendChild(pRed$$);
  divError$$.appendChild(pGrey$$);
  divError$$.appendChild(pGrey1$$);
  divError$$.appendChild(pGrey2$$);
  divError$$.appendChild(pGrey3$$);
  
  

};

const renderPokemonCard = (poke) => {
  const li$$ = document.createElement("li");
  li$$.classList.add("card");

  const img$$ = document.createElement("img");
  img$$.src = poke.sprites.other.dream_world.front_default;

  img$$.alt = poke.name;
  img$$.classList.add("imgSize");

  const divPoke$$ = document.createElement("div");
  divPoke$$.classList.add("divPoke");
  divPoke$$.appendChild(img$$);

  const p$$ = document.createElement("p");
  p$$.classList.add("card-title");
  p$$.textContent = poke.name;

  const divId$$ = document.createElement("div");
  divId$$.classList.add("card-subtitle");

  let id = poke.id.toString();
  let pad = "000";
  var idFinal = pad.substring(0, pad.length - id.length) + id;

  divId$$.textContent = "N.º" + idFinal;

 /* OTRA VERSIÓN DE LA LÍNEA 86-90
  if (poke.id.toString().length == 1) {
    divId$$.textContent = "N.º" + "00" + poke.id;
  } else if (poke.id.toString().length == 2) {
    divId$$.textContent = "N.º" + "0" + poke.id;
  } else {
    divId$$.textContent = "N.º" + poke.id;
  }
  console.log(poke.id.length); */

  li$$.appendChild(divPoke$$);
  pokedex$$.appendChild(li$$);
  li$$.appendChild(divId$$);
  li$$.appendChild(p$$);
  renderTypes(poke.types, li$$);
};

const renderPokemons = (pokemons) => {
  cleanPokedex();
  if (!pokemons.length) renderNoResults();
  pokemons.forEach((pokemon) => renderPokemonCard(pokemon));
};

const search = (value) => {
  const filtered = ALL_POKEMONS_INFO.filter((pokemon) => {
    const matchName = pokemon.name.includes(value);
    const matchId = pokemon.id == value;
    const matchType = pokemon.types.includes(value);

    return matchName || matchId || matchType;
  });
  renderPokemons(filtered);
};

const addEventsListeners = () => {
  searchInput$$.addEventListener("input", (event) => {
    search(event.target.value);
  });
};

//FUNCIÓN MADRE
const init = async () => {
  addEventsListeners();
  const allPokemons = await getAllPokemons(); 

  for (const pokemon of allPokemons) {
    const pokemonIndividualInfo = await getOnePokemon(pokemon.url);
    ALL_POKEMONS_INFO.push(pokemonIndividualInfo);
  }

  console.log("Todos los pokemon info", ALL_POKEMONS_INFO);
  renderPokemons(ALL_POKEMONS_INFO);
};

window.onload = init; // = defer