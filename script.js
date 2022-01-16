'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const move = sort ? movements.slice().sort((a, b) => a - b) : movements;
  move.forEach((item, index) => {
    const type = item > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    }: ${type}</div>
    <div class="movements__value">${item}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////////////////////

const calcualteBalance = function (account) {
  const balance = account.movements.reduce((acc, item) => acc + item, 0);
  labelBalance.textContent = `${balance} EUR`;
  account.balance = balance;
};

/////////////////////////////////////////////////////////////////

const calcSummary = function (account) {
  labelSumIn.textContent = `${account.movements
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)} EUR`;
  labelSumOut.textContent = `${Math.abs(
    account.movements
      .filter(item => item < 0)
      .reduce((acc, item) => acc + item, 0)
  )} EUR`;
  labelSumInterest.textContent = `${account.movements
    .filter(item => item > 0)
    .map(item => (item * account.interestRate) / 100)
    .filter(item => item >= 1)
    .reduce((acc, item) => acc + item, 0)} EUR`;
};

/////////////////////////////////////////////////////////////////

const createInitials = function (acc) {
  acc.forEach(item => {
    item.username = item.owner
      .toLowerCase()
      .split(' ')
      .map(item => item[0])
      .join('');
  });
};
createInitials(accounts);

/////////////////////////////////////////////////////////////////

const updateUI = function (currentuser) {
  //Display Movements
  displayMovements(currentuser.movements);

  //Display balance
  calcualteBalance(currentuser);

  //Display Summary
  calcSummary(currentuser);
};

//////////////////////////////////////////////////////////////////

//Event Listeners**********Login*************************
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    item => item.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and Message
    labelWelcome.textContent = `Welcome, ${
      currentAccount.owner.split(' ')[0]
    } 😊`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    //update UI
    updateUI(currentAccount);
  }
});

//Event Listeners**********Transfer*************************
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
});

//Event Listeners**********Close Account*************************

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    accounts.splice(
      accounts.findIndex(item => currentAccount.username === item.username),
      1
    );
    //hide ui
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Event Listeners**********Request Loan*************************

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(item => item >= amount / 10)
  ) {
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//Event Listeners**********Sort*************************
let toggleVar = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !toggleVar);
  toggleVar = !toggleVar;
});

///////////////////////////////////////////////////////////////////
// let individualName = accounts.map(item => {
//   let arr = [];
//   console.log(item.owner.split(' '));
//   let initials = item.owner.split(' ').map(item => {
//     arr.push(item[0]);
//   });
//   console.log(arr.join(''));
//   initialLetters.push(arr.join(''));
// });

// console.log(initialLetters);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// movements.forEach((item, ind, arr) => {
//   console.log(arr);
//   ind++;
//   item > 0
//     ? console.log(`${ind}: ${Math.abs(item)} : Deposits`)
//     : console.log(`${ind}: ${Math.abs(item)} : Withdraw`);
// });

// /////////////////////////////////////////////////
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach((item, ind) => {
//   //console.log(ind, item);
//   console.log(`The abbrevation of ${ind} is ${item}`);
// });

// const currencyUnique = new Set(['USD', 'EUR', 'USD', 'GBP']);

// console.log(currencyUnique);
// currencyUnique.forEach((item, ind) => {
//   //console.log(ind, item);
//   console.log(`${ind} : ${item}`);
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements.reduce((acc, item) => (item > acc ? item : acc)));

// let deposits = movements
//   .filter(item => item > 0)
//   .map(item => item)
//   .reduce((acc, item) => acc + item, 10);
// console.log(deposits);
// const usdToInr = 75;

// const convertedAmount = movements.map(
//   item => `For $${item} the INR is ${Math.abs(item * 75)}`
// );

// console.log(convertedAmount);

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

const dogs = [
  { weight: 22, curFood: 284, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(item => {
  item.recommendedFood = Math.trunc(item.weight ** 0.75 * 28);
});

console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓

// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

dogs.forEach(item => {
  if (item.owners.includes('Sarah')) {
    let ans =
      item.curFood > item.recommendedFood
        ? console.log('Sarahs dog is Eating Too much')
        : item.curFood > item.recommendedFood * 0.9 &&
          item.curFood < item.recommendedFood * 1.1
        ? console.log('Sarahs dog is Eating within range')
        : console.log('Sarahs dog is Eating Less');
  }
});

// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
let overWeightOwner = [];
let underWeightOwner = [];
let res = dogs.map(item => {
  return item.curFood > item.recommendedFood
    ? overWeightOwner.push(item.owners)
    : underWeightOwner.push(item.owners);
});

console.log(overWeightOwner.flat(), underWeightOwner.flat());

// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
console.log(`${overWeightOwner.flat().join(' and ')} dogs eat too much`);
console.log(`${underWeightOwner.flat().join(' and ')} dogs eat too much`);

// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)

console.log(dogs.some(item => item.curFood === item.recommendedFood));

// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
console.log(
  dogs.some(
    item =>
      item.curFood > item.recommendedFood * 0.9 &&
      item.curFood < item.recommendedFood * 1.1
  )
);

// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

console.log(
  dogs
    .map((item, index) => {
      if (
        item.curFood > item.recommendedFood * 0.9 &&
        item.curFood < item.recommendedFood * 1.1
      ) {
        return `${item.owners.join(
          ' and '
        )} dog is eating is OK amount of food`;
      }
    })
    .filter(item => item ?? item)
);

// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

console.log(dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood));
