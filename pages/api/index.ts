import type { NextApiRequest, NextApiResponse } from "next";

import {
  findAllDynamic,
  findManyDynamic,
  createDynamic,
  createManyDynamic,
  updateDynamic,
  updateManyDynamic,
  deleteDynamic,
  deleteManyDynamic,
  deleteManyDynamica,
} from "../../prisma/utils";

const printData = async () => {
  console.log("pizzas:\n", await findAllDynamic("pizzas"));
  console.log("toppings:\n", await findAllDynamic("toppings"));
  console.log("pizza_components:\n", await findAllDynamic("pizza_components"));
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { user } = req.query;
      // const toppingsList = await prisma.toppings.findMany()
      const toppingsList = await findAllDynamic("toppings");
      const pizzasList = user === "chef" ? await findAllDynamic("pizzas") : [];
      const pizzaComponents =
        user === "chef" ? await findAllDynamic("pizza_components") : [];

      res.status(200).json({
        toppings: toppingsList,
        pizzas: pizzasList,
        components: pizzaComponents,
      });
    } catch (error) {
      res.status(403).json({ error: "Error occured." });
    }
  }

  if (req.method === "POST") {
    try {
      const { user } = req.query;
      const data = req.body;
      console.log("POST");
      console.log(data);
      if (user === "chef") {
        /*
          INSERT INTO pizzas (pizza_name)
          VALUES ([variable name]);
          INSERT INTO pizza_components (pizza_id,topping_id)
          VALUES ([variable id],[variable id]);

          createDynamic('pizzas',[{col_name:'pizza_name',value:'pepperoni'}])
        */

        // if new pizza, add pizza and toppings
        if (data.pizza.pizza_id === -999) {
          const pizza: pizzaData = await createDynamic("pizzas", [
            { col_name: "pizza_name", value: data.pizza.pizza_name },
          ]);
          console.log("pizza", pizza);
          data.toppings.map(
            async (topping: toppingData) =>
              await createDynamic("pizza_components", [
                { col_name: "pizza_id", value: pizza.pizza_id },
                { col_name: "topping_id", value: topping.topping_id },
              ])
          );
        } else {
          // update where pizza_id === pizza_id
          await updateDynamic(
            "pizzas",
            { col_name: "pizza_id", value: data.pizza.pizza_id },
            { col_name: "pizza_name", value: data.pizza.pizza_name }
          );

          // // UPDATE toppings
          // // get topping records for pizza
          // const prevToppingIds = await findManyDynamic("pizza_components",{col_name:'pizza_id', value: data.pizza.pizza_id},{col_name:'topping_id', value: true})

          // // map through all records
          // const allToppingIds = await findManyDynamic("toppings",undefined,{col_name:'topping_id', value: true})
          // allToppingIds.map(async(topping:{topping_id: number})=>{
          //   const prev = prevToppingIds.find(({topping_id}:{topping_id:number})=> topping_id === topping.topping_id)
          //   const update = data.toppings.find(({topping_id}:{topping_id:number})=> topping_id === topping.topping_id)
          //   console.log({prev:prev,update:update})
          //   // if topping in updated and not prev, create new record
          //   // if topping not in updated but in prev, delete
          //   // if topping in updated and prev, do nothing
          //   if(!prev && update) {
          //     await createDynamic('pizza_components',[{col_name:'pizza_id',value:data.pizza.pizza_id},{col_name:'topping_id',value:update.topping_id}])
          //   } else if (!update && prev) {
          //     await deleteManyDynamica('pizza_components',[{col_name:'pizza_id',value:data.pizza.pizza_id},{col_name:'topping_id',value:prev.topping_id}])
          //   } else null
          // })

          // Second Approach (minimize queries on db)
          console.log("data.pizza.pizza_id", data.pizza.pizza_id);
          console.log("typeof data.pizza.pizza_id", typeof data.pizza.pizza_id);
          const deleted = await deleteManyDynamic("pizza_components", {
            col_name: "pizza_id",
            value: data.pizza.pizza_id,
          });
          console.log("deleted", deleted);
          data.toppings.map(
            async (topping: toppingData) =>
              await createDynamic("pizza_components", [
                { col_name: "pizza_id", value: data.pizza.pizza_id },
                { col_name: "topping_id", value: topping.topping_id },
              ])
          );

          // data.toppings.map(async(topping:toppingData)=>
          //   await createDynamic('pizza_components',[
          //     {col_name:'pizza_id',value:pizza.pizza_id},
          //     {col_name:'topping_id',value:topping.topping_id}
          //   ])
          // )
        }
        printData();
      } else if (user === "owner") {
        // INSERT INTO toppings (topping_name)
        // VALUES ([variable name]);
        if (data.topping_id === -999) {
          createDynamic("toppings", [
            { col_name: "topping_name", value: data.topping_name },
          ]);
        } else {
          // update where topping_id === topping_id
          console.log("data.topping_name", data.topping_name);
          updateDynamic(
            "toppings",
            { col_name: "topping_id", value: data.topping_id },
            { col_name: "topping_name", value: data.topping_name }
          );
        }
        // console.log(createManyDynamic('toppings',[[{col_name:'topping_name',value:'pepperoni'}],[{col_name:'topping_name',value:'sausage'}]]))
      } else null;

      res.status(201).json({});
    } catch (error) {
      res.status(403).json({ error: "Error occured." });
    }
  }

  if (req.method === "PUT") {
    try {
      const { user } = req.query;
      const data = req.body;
      console.log("PUT");
      console.log(data);
      if (user === "chef") {
        /*
          UPDATE pizzas SET pizza_name = [variable name] WHERE pizza_id = [some_value];
          
          DELETE FROM pizza_components WHERE pizza_id = [pizza id];
          INSERT INTO pizza_components (pizza_id,topping_id)
          VALUES ([variable id],[variable id]);
        */
      } else if (user === "owner") {
        /*
          UPDATE toppings SET topping_name = [variable name] WHERE topping_id = [some_value];
        */
      } else null;

      res.status(200).json([]);
    } catch (error) {
      res.status(403).json({ error: "Error occured." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { user } = req.query;
      const data = req.body;
      console.log("DELETE");
      console.log(data);
      if (user === "chef") {
        /*
          DELETE FROM pizzas WHERE pizza_id = [pizza id];
        */
        const result = await deleteDynamic("pizzas", {
          col_name: "pizza_id",
          value: data.pizza_id,
        });
      } else if (user === "owner") {
        /*
          if pizzas with topping, grab pizza ids with topping to delete. Delete pizza ids.
          DELETE FROM toppings WHERE topping_name = [variable name];
          (prisma DELETE MANY)  
          DELETE FROM pizzas WHERE pizza_id = [pizza id];  
        */

        // get array of pizza ids
        const pizzaIds = await findManyDynamic(
          "pizza_components",
          { col_name: "topping_id", value: data.topping_id },
          { col_name: "pizza_id", value: true }
        );
        // pizzaIds = [ { pizza_id: 1 }, { pizza_id: 2 }, { pizza_id: 3 } ]
        // console.log('pizzaIds Results:\n',pizzaIds)

        // convert to list
        const pizzaIdsList = pizzaIds.map(
          (pizza: { pizza_id: number }) => pizza.pizza_id
        );
        // console.log('pizzaIdsList Results:\n',pizzaIdsList)

        await deleteManyDynamic("pizzas", {
          col_name: "pizza_id",
          value: { in: pizzaIdsList },
        });
        // console.log('Deleted from pizzas:\n',result1)

        await deleteDynamic("toppings", {
          col_name: "topping_id",
          value: data.topping_id,
        });
        // console.log('Deleted from toppings:\n',result2)
      } else null;

      // throw new Error('Random error') //Error testing
      res.status(200).json([]);
    } catch (error) {
      res.status(403).json({ error: "Error occured." });
    }
  }
}
