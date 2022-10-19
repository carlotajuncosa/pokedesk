const pokedex$$ = document.querySelector("#pokedex");
const searchInput$$ = document.querySelector("input[name=filter]");
let ALL_POKEMONS_INFO = []; //MAYUS cuando una variable global scope puede ser usada por todas

//Recibiendo informacion de la api de pokemon
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


//AUTOCOMPLETE
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        console.log(pokemon);
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

//renderizando elementos dinámicos
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
  const divError$$ = document.createElement("div");
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

  /* OTRA VERSIÓN DE LA LÍNEA 109-115
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

autocomplete(document.getElementById("myInput"), ALL_POKEMONS_INFO);

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
