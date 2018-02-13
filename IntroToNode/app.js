var cat = require('cat-me');
var joke = require('knock-knock-jokes')
var faker = require('faker')
// console.log(cat());
 console.log(joke())

console.log(faker.commerce.productName() + " - $" 
                + faker.commerce.price() ) 