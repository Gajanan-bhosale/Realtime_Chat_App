import { ArchiveStatus } from '@aws-sdk/client-s3';

const numbers = [1, 2, 3, 4, 5];

const newNumber = numbers.map((num) => num * 3);

console.log(newNumber);

const names = ['amit', 'rahul', 'neha'];

// const newNames = names.map((name) => name[0].toUpperCase() + name.substring(1));

const newNames = names.map(
  (name) => name.charAt(0).toUpperCase() + name.slice(1),
);

console.log(newNames);

const products = [
  { name: 'Phone', price: 10000 },
  { name: 'Laptop', price: 50000 },
  { name: 'Tablet', price: 20000 },
];

const onlyPrices = products.map((product) => product.price);

console.log(onlyPrices);

/********************************************************************************************/

// forEach()

// 👉 Print each fruit in this format: "I like Apple"

const fruits = ['Apple', 'Banana', 'Mango'];

const newSentence = fruits.forEach((fruit) => console.log(`I like ${fruit}`));

console.log(newSentence);

// 👉 Print square of each number.

const nums = [1, 2, 3, 4];

const squareNum = nums.forEach((num) => console.log(num * num));

console.log(squareNum);

//👉 Print each fruit in this format

const students = ['Amit', 'Rahul', 'Neha'];

students.forEach((greet) => console.log(`Welcome ${greet}`));

/********************************************************************************************/

// Filter

// Get all ages greater than or equal to 18.

const ages = [12, 18, 20, 15, 25, 30];

const matchedAges = ages.filter((age) => age >= 18);

console.log(matchedAges);

// 👉 Filter only passing marks (>= 40).

const marks = [35, 80, 45, 90, 20, 60];

const passingMarks = marks.filter((mark) => mark >= 40);

console.log(passingMarks);

// 👉 Get only active users.

const users = [
  { name: 'Amit', active: true },
  { name: 'Rahul', active: false },
  { name: 'Neha', active: true },
];

const activeUsers = users.filter((user) => user.active);

console.log(activeUsers);

/********************************************************************************************/

// find()

// 👉 Find the first number greater than 20

const arr = [10, 20, 30, 40];

const greater = arr.find((first) => first > 20);

console.log(greater);

// 👉 Find the user with id = 2

const users1 = [
  { id: 1, name: 'Amit' },
  { id: 2, name: 'Rahul' },
  { id: 3, name: 'Neha' },
];

const findId = users1.find((user) => user.id === 2);

console.log(findId);

// 👉 Find the first product that is out of stock

const productsStock = [
  { name: 'Phone', stock: 0 },
  { name: 'Laptop', stock: 5 },
  { name: 'Tablet', stock: 2 },
  { name: 'Charger', stock: 0 },
];

const outOfStock = productsStock.find((checkStock) => checkStock.stock == 0);

const outOfStockFilter = productsStock.filter(
  (checkStock) => checkStock.stock == 0,
);

console.log(outOfStock);

console.log(outOfStockFilter);

/********************************************************************************************/

// findIndex()

// 👉 Find the index of 15

const arr2 = [5, 10, 15, 20];

const indexCheck = arr2.findIndex((index) => index == 15);

console.log(indexCheck);

// Find the index of Neha

const names2 = ['Amit', 'Rahul', 'Neha'];

const findName = names2.findIndex((str) => str === 'Neha');

console.log(findName);

// Find the index of user whose id is 102.

const users2 = [
  { id: 101, name: 'Amit' },
  { id: 102, name: 'Rahul' },
  { id: 103, name: 'Neha' },
];

const findIds = users2.findIndex((ids) => ids.id === 102);

console.log(findIds);
