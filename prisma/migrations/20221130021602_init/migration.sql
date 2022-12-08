/*
  Warnings:

  - A unique constraint covering the columns `[pizza_name]` on the table `pizzas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[topping_name]` on the table `toppings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_pizzas_1" ON "pizzas"("pizza_name");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_toppings_1" ON "toppings"("topping_name");
Pragma writable_schema=0;
