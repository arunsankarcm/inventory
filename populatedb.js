#! /usr/bin / env node

console.log(
    'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");


const items = [];
const categories = [];


const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Vegetable category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
    const category = new Category({ name: name });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function itemCreate(index, title, description, price, stock, category) {
    const itemdetail = {
        title: title,
        description: description,
        price: price,
        stock: stock,
    };
    if (category != false) itemdetail.category = category;

    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${title}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate(0, "Vegetable"),
        categoryCreate(1, "Fruit"),
        categoryCreate(2, "Meat"),
    ]);
}


async function createItems() {
    console.log("Adding Items");
    await Promise.all([
        itemCreate(0,
            "Cabbage",
            "Cabbage, comprising several cultivars of Brassica oleracea, is a leafy green, red, or white biennial plant grown as an annual vegetable crop for its dense-leaved heads.",
            "30",
            "10",
            [categories[0]]
        ),
        itemCreate(1,
            "Banana",
            "A banana is a long, curved fruit with a yellow skin and soft, sweet, white flesh inside. It is botanically a berry and is produced by several kinds of large herbaceous flowering plants in the genus Musa.",
            "40",
            "20",
            [categories[1]]
        ),
        itemCreate(2,
            "Chicken",
            "Chicken is the most common type of poultry in the world.",
            "100",
            "7",
            [categories[2]]
        ),
        itemCreate(3,
            "Tomato",
            "The tomato is the edible berry of the plant Solanum lycopersicum, commonly known as the tomato plant.",
            "30",
            "12",
            [categories[0], categories[1]]
        ),
        itemCreate(4,
            "Shoes",
            "an outer covering for the human foot typically having a thick or stiff sole with an attached heel and an upper part of lighter material",
            "350",
            "20",
            false
        ),
    ]);
}

