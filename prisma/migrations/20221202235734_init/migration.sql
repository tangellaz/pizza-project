-- CreateTable
CREATE TABLE "pizza_components" (
    "component_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pizza_id" INTEGER,
    "topping_id" INTEGER,
    CONSTRAINT "pizza_components_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "toppings" ("topping_id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "pizza_components_pizza_id_fkey" FOREIGN KEY ("pizza_id") REFERENCES "pizzas" ("pizza_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "pizzas" (
    "pizza_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pizza_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "toppings" (
    "topping_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topping_name" TEXT NOT NULL
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_pizzas_1" ON "pizzas"("pizza_name");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_toppings_1" ON "toppings"("topping_name");
Pragma writable_schema=0;
