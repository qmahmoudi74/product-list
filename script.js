const fs = require("fs");
const { faker } = require("@faker-js/faker/locale/fa");

const { price, productDescription, productName } = faker.commerce;
const { fullName } = faker.person;
const { userName } = faker.internet;

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

const likes = new Array(10_000).fill(0).map(() => ({
  id: faker.string.uuid(),
  productId: products[Math.floor(Math.random() * 1000)].id,
  userId: users[Math.floor(Math.random() * 50)].id
}));

const comments = new Array(10_000).fill(0).map(() => ({
  id: faker.string.uuid(),
  productId: products[Math.floor(Math.random() * 1000)].id,
  userId: users[Math.floor(Math.random() * 50)].id,
  content: faker.lorem.lines(Math.floor(Math.random() * 4 + 1))
}));

const db = {
  users,
  products,
  likes,
  comments
};

fs.writeFile("db.json", JSON.stringify(db), () => {});
