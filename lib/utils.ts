export type propType = {
  toppings: toppingData[];
  pizzas: pizzaData[];
  components: componentData[];
};

export type mapToppings = {
  [key: string]: toppingData[];
};

/* pizzaAssembler synthesizes pizzas by mapping toppings to pizzas */
export const pizzaAssembler = ({
  toppings,
  pizzas,
  components,
}: propType): mapToppings => {
  let mapToppings: mapToppings = {};

  // create and initialize map object of empty arrays
  pizzas.map((pizza) => {
    mapToppings[pizza.pizza_id] = [];
  });

  /* loop through component data,
      map component topping to topping object by ids
      push found topping to corresponding pizza in the mapToppings 
  */
  components.map((component) => {
    const topping = toppings.find(
      (topping) => component.topping_id === topping.topping_id
    );
    topping && component.pizza_id != null
      ? mapToppings[component.pizza_id].push(topping)
      : null;
  });

  // // sort by topping_id
  // pizzas.map(pizza=>{mapToppings[pizza.pizza_id] = toppingIdSort(mapToppings[pizza.pizza_id])})
  // // sort by topping__name
  pizzas.map((pizza) => {
    mapToppings[pizza.pizza_id] = toppingNameSort(mapToppings[pizza.pizza_id]);
  });
  return mapToppings;
};

export const toppingNameSort = (ary: toppingData[]): toppingData[] =>
  ary.sort((a: toppingData, b: toppingData): number => {
    const nameA = a.topping_name.toLowerCase();
    const nameB = b.topping_name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names equal
    return 0;
  });

export const toppingIdSort = (ary: toppingData[]): toppingData[] =>
  ary.sort((a, b) => a.topping_id - b.topping_id);

export const toppingExists = (
  toppings: toppingData[],
  selectedTopping: toppingData,
  toppingName: string
): boolean => {
  // check if topping name used already
  const checkTopping = toppings.find(
    ({ topping_name }) => topping_name === toppingName
  );
  // if topping exists and not itself
  return checkTopping && checkTopping.topping_id != selectedTopping.topping_id
    ? true
    : false;
};

export const pizzaNameExists = (
  pizzas: pizzaData[],
  selectedPizza: pizzaData,
  pizzaName: string
): boolean => {
  // check if pizza name used already
  const checkPizza = pizzas.find(
    ({ pizza_name }) => pizza_name === pizzaName.toLowerCase()
  );
  // if pizza exists and not itself
  return checkPizza && checkPizza.pizza_id != selectedPizza.pizza_id
    ? true
    : false;
};

export const pizzaComboExists = (
  data: { pizza: pizzaData; toppings: toppingData[] },
  assembledPizzas?: mapToppings
): boolean => {
  let existingPizza = false;
  // Typescript check if assembledPizzas exists
  if (assembledPizzas) {
    for (const [key, value] of Object.entries(assembledPizzas)) {
      // if toppings ary same size and not the same pizzas
      if (
        value.length === data.toppings.length &&
        parseInt(key) != data.pizza.pizza_id
      ) {
        let same = true;
        for (let i = 0; i < value.length; i++) {
          if (
            !data.toppings.find(
              ({ topping_id }) => topping_id === value[i].topping_id
            )
          ) {
            same = false;
            i = value.length;
          }
        }
        existingPizza = same;
      }
    }
  }
  return existingPizza;
};

export const titleCase = (str: string) => {
  if (str) {
    const splitStr = str.split(" ");

    let spaceChar = false;
    let newStr: string[] = [];

    splitStr.forEach((word) => {
      if (word.length === 0 && !spaceChar) {
        //detect single space. Second space removed
        spaceChar = true;
        newStr.push(word);
      } else if (word.length > 0) {
        let title = word.trim().split("");
        title[0] ? (title[0] = title[0].toUpperCase()) : null;
        newStr.push(title.join(""));
        spaceChar = false;
      }
    });
    return newStr.join(" ");
  } else return str;
};

export const purgeWhitespace = (str: string) => {
  if (str) {
    const splitStr = str.split(" ");
    let newStr: string[] = [];
    splitStr.forEach((word) => {
      const trimWord = word.trim();
      trimWord.length > 0 ? newStr.push(trimWord) : null;
    });
    return newStr.join(" ");
  } else return str;
};

export const allWhitespace = (str: string) =>
  str.trim().length ? true : false;

export const isAlphaNumeric = (str: string) => {
  let code;
  for (let i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);
    if (
      !(code === 32) && // space (' ')
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) // lower alpha (a-z)
    ) {
      return false;
    }
  }
  return true;
};
