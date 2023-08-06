'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-04-18T21:31:17.178Z',
    '2023-05-23T07:42:02.383Z',
    '2023-06-28T09:15:04.904Z',
    '2023-07-01T10:17:24.185Z',
    '2023-08-01T14:11:59.604Z',
    '2023-08-03T17:01:17.194Z',
    '2023-08-05T23:35:17.929Z',
    '2023-08-06T10:31:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-07-01T13:15:33.035Z',
    '2023-07-18T09:48:16.867Z',
    '2023-07-25T06:04:23.907Z',
    '2023-07-30T14:18:46.235Z',
    '2023-08-01T16:33:06.386Z',
    '2023-08-03T14:43:26.374Z',
    '2023-08-05T18:49:59.371Z',
    '2023-08-06T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


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



const formatDate= function(date){

  const calcDaysPassed= (date1,date2)=> Math.round(Math.abs(date2-date1)/(1000*60*60*24));
    const dayPassed = calcDaysPassed(new Date(),date);

    if(dayPassed===0) return 'Today';
    if(dayPassed===1) return 'Yesterday';
    if(dayPassed<=7)  return `${dayPassed} days ago`;
else{
  const day = `${date.getDay()}`.padStart(2,0);
  const month =  `${date.getMonth()+1}`.padStart(2,0);
   const year= date.getFullYear();
   
   return `${day}/${month}/${year}`;
}
};


const displayMovements=function (acc,sort=false){

  containerMovements.innerHTML='';

  const movs = sort?acc.movements.slice().sort((a,b)=>a-b):acc.movements;

  movs.forEach(function (mov,i){


      const type =mov > 0 ?'deposit':'withdrawal';
     const date = new Date(acc.movementsDates[i]);
     const displayDate =formatDate(date);  


      const html=`
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
     
      <div class="movements__date"> ${displayDate}</div>

      <div class="movements__value">${mov.toFixed(2)} Rs</div>
    </div> 
      `;
containerMovements.insertAdjacentHTML('afterbegin',html);
  });

};



// IN-OUT SUMMARY---------------------//

const calcDisplaySummary=function(acc){
 
  const displayIn= acc.movements.filter(mov=> mov>0).reduce((acc,mov)=> acc+mov,0)
  labelSumIn.textContent=`${displayIn.toFixed(2)} `;

  const displayOut= acc.movements.filter(mov=> mov<0).reduce((acc,mov)=> acc+mov,0)
  labelSumOut.textContent=`${Math.abs(displayOut).toFixed(2)} `;


  const interestTotal = acc.movements.filter(mov=> mov>0).map(deposit => (deposit * acc.interestRate)/100)
  .filter((int , i , arr)=>{
  return int>=1
  })
  .reduce((acc,int)=> acc+int,0);
  labelSumInterest.textContent= `${interestTotal.toFixed(2)}`;
}




// Display Total Ammount--------------------------------//

const calDisplayBalance = function(acc){
  acc.balance= acc.movements.reduce((acc, cur,)=>acc+cur ,0);
  labelBalance.textContent=`${acc.balance.toFixed(2)} Rs`;
}


const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer= function(){
 
// Set time to 5 min
const tick = function(){

//call the timer every second
  const min = String(Math.trunc(time/60)).padStart(2,0);
  const sec= String(time%60).padStart(2,0);

  labelTimer.textContent=`${min}:${sec}`;

 

  if(time==0){
    clearInterval(timer);
    labelWelcome.textContent='Oops! you are Logged Out!';
    containerApp.style.opacity=0;
  }
  time--;
};
let time= 300;

tick();
const timer= setInterval(tick,1000);

return timer;
};
//




const createusernames= function (accs){

  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join("");
  });


}
createusernames(accounts);
console.log(accounts);







let currentAccount ,timer;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  

 currentAccount= accounts.find(acc=> acc.username===inputLoginUsername.value);

 //console.log(currentAccount);

 if(currentAccount?.pin === Number(inputLoginPin.value)){

// UI AND WELCOME MESSAGE SHOW --------//

labelWelcome.textContent= `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
containerApp.style.opacity =100;

const now = new Date();
const day = `${now.getDate()}`.padStart(2,0);
const month =  `${now.getMonth()+1}`.padStart(2,0);
const year= now.getFullYear();
const hour = `${now.getHours()}`.padStart(2,0);
const min = `${now.getMinutes()}`.padStart(2,0);

labelDate.textContent= `${day}/${month}/${year}, ${hour}:${min}`;



inputLoginUsername.value = inputLoginPin.value ='';
inputLoginPin.blur();

// display MOvements-------------------//
if(timer) clearInterval(timer);
timer= startLogOutTimer();

updateUI(currentAccount);

 }
else{
  alert("Wrong UserID or PIN , Kindly check it again");
}

});

// Transfer ammount------------------------//

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount= Number(inputTransferAmount.value);
  const recieverAcc= accounts.find(acc=> acc.username=== inputTransferTo.value);

  inputTransferAmount.value= inputTransferTo.value='';

 if(
  amount>0 && recieverAcc && 
  currentAccount.balance >= amount &&
  recieverAcc?.username!==currentAccount.username){

    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

  currentAccount.movementsDates.push(new Date().toISOString());
  recieverAcc.movementsDates.push(new Date().toISOString());

  clearInterval(timer);
   timer= startLogOutTimer();
// update UI once again //
updateUI(currentAccount);
 
  }

});


// Loan AMOUNT----------------//
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
 
    const amount= Math.floor(inputLoanAmount.value);

   if(amount>0 && currentAccount.movements.some(mov=>mov>=amount *0.1)){
    

    setTimeout(function(){

    
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());


    clearInterval(timer);
    timer= startLogOutTimer();

    // update UI  //
    updateUI(currentAccount);
  },2500);
   }

   inputLoanAmount.value='';
});

// close account -------------------//

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  

   if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){

       const index= accounts.findIndex(acc=>acc.username===currentAccount.username );

     accounts.splice(index,1); 
     labelWelcome.textContent= `GoodBye, ${currentAccount.owner.split(' ')[0]} :(`;

       containerApp.style.opacity =0;
   }
   
   inputCloseUsername.value=inputClosePin.value='';

});

let sorted =false;


function numwericSort(a,b){
  return a-b;
}
btnSort.addEventListener('click', function(e){
  
  e.preventDefault();

  currentAccount.sort(numwericSort);
  displayMovements(currentAccount.movements,!sorted);
  sorted=!sorted;
  

});


labelBalance.addEventListener('click',function(){
  const movementsUI= Array.from(
    document.querySelectorAll('.movements__value'),
    el=>Number(el.textContent.replace('Rs',''))
  );
  console.log(movementsUI);
});

// Date and Time ----------------------------// 








/////////////////////////////////////////////////
/////////////////////////////////////////////////










//



/////////////////////////////////////////////////
