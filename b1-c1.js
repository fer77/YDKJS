/*
1) Write a program to calculate the total price of your phone purchase. You will keep purchasing phones (hint: loop!) until you run out of money in your bank account. You'll also buy accessories for each phone as long as your purchase amount is below your mental spending threshold.
2) After you've calculated your purchase amount, add in the tax, then print out the calculated purchase amount, properly formatted.
3) Finally, check the amount against your bank account balance to see if you can afford it or not.
4) You should set up some constants for the "tax rate," "phone price," "accessory price," and "spending threshold," as well as a variable for your "bank account balance".
5) You should define functions for calculating the tax and for formatting the price with a "$" and rounding to two decimal places.
6) Bonus Challenge: Try to incorporate input into this program, perhaps with the prompt(..) covered in "Input" earlier. You may prompt the user for their bank account balance, for example.
*/

const taxRate = .08;
const phonePrice = (600 + (600 * taxRate));
const accessoryPrice = (60 + (60 * taxRate));
const amntToSpend = prompt('How much money do you have for this purchase today?');
var accBalance = amntToSpend;

function purchase() {
  if (accBalance > phonePrice) {
    accBalance = accBalance - phonePrice;
    console.log('Let\'s add some accessories I have ' + '$' + accBalance.toFixed(2) + ' to spend on accessories.');
  } while (accBalance > accessoryPrice) {
    console.log('Let\'s add some MORE accessories!! I still have ' + '$' + accBalance.toFixed(2) + ' to spend.');
    accBalance = accBalance - accessoryPrice;
    if (accBalance < accessoryPrice) {
      console.log('Better stop, I only wanted to spend ' + '$' + (amntToSpend - accBalance));
    }
  }
}

purchase();
