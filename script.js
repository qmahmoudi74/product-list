const fs = require("fs");
const { faker } = require("@faker-js/faker/locale/fa");

const { price, productDescription, productName } = faker.commerce;
const { fullName } = faker.person;
const { userName } = faker.internet;

const db = {};

const users = new Array(50).fill(0).map(() => ({
  id: faker.string.uuid(),
  username: userName(),
  fullName: fullName()
}));

const products = new Array(1000).fill(0).map(() => ({
  id: faker.string.uuid(),
  name: productName(),
  price: price(),
  desc: productDescription()
}));

db.users = users;
db.products = products;

fs.writeFile("db.json", JSON.stringify(db), () => {});
