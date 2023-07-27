const cardItems = document.querySelectorAll('.card-items');
const checkout = document.getElementById('checkout-form');
const countries = document.getElementById('country');
const emailForm = document.getElementById('e-mail');
const phoneForm = document.getElementById('phone');
const fullNameForm = document.getElementById('full-name');
const addressForm = document.getElementById('address');
const cityForm = document.getElementById('city');
const postalCodeForm = document.getElementById('postal-code');
const saveCheckOut = document.getElementById('save');
  

const userCheckOut = {
  isSave: false,
  email: '',
  phone: null,
  fullName: '',
  address: '',
  city: '',
  country: '',
  postalCode: null
}


countries.onchange = (e) => {
   userCheckOut.country = e.target.value;
}
saveCheckOut.onclick = (e) => {
    if (e.target.checked) {
      userCheckOut.isSave = true;
      if(userCheckOut.isSave) {
        localStorage.setItem('userCheckOut', JSON.stringify(userCheckOut))
      }
    } else {
      userCheckOut.isSave = false;
      if (!userCheckOut.isSave) {
        localStorage.removeItem('userCheckOut')
      }
    };
  }
  
checkout.addEventListener('submit', (e) => {
  e.preventDefault();
  
  userCheckOut.email = emailForm.value;
  userCheckOut.phone = phoneForm.value;
  userCheckOut.fullName = fullNameForm.value;
  userCheckOut.address = addressForm.value;
  userCheckOut.city = cityForm.value;
  userCheckOut.postalCode = postalCodeForm.value;
  
  
  const {email, phone, fullName, address, city, country, postalCode } = userCheckOut;
  
 
  if ([email, phone, fullName, address, city, country, postalCode].every(data => !data)) {
    alert('You must field first');
  } else {
     alert('Success, we are process your order')
    localStorage.setItem('userCheckOut', JSON.stringify(userCheckOut))
  }
  
  
})


const dataPrice = [];
const updateCost = (quantity, card, index) => {
  const pricePerItem = card.querySelector('#new-price');
  const totalCost = document.querySelector('#total-cost');
  
  let totalPerItem = parseFloat(pricePerItem.innerText) * quantity;
  
  dataPrice[index] = totalPerItem;
  
  let sumPriceItems = dataPrice.reduce((total, num) => {
    return total + num 
  }, 0)
  
 let total = sumPriceItems + 19
 totalCost.innerText = '$' + total.toFixed(2);
 totalCost.classList.add('active');
 
 setTimeout(() => {
  totalCost.classList.remove('active');
 }, 300);
}

const getListCountry = async () => {
   const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
   const data = await response.json();
   data.sort((a, b) => {
    const nameA = a.name.common.toUpperCase();
    const nameB = b.name.common.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
   data.forEach(obj => {
     countries.innerHTML += `<option value=${obj.name.common}>${obj.name.common}</option>`
   })
}

const loadUserCheckout = () => {
  if (localStorage.getItem('userCheckOut') !== undefined) {
    const getData = JSON.parse(localStorage.getItem('userCheckOut'));
    if (getData) {
      const {isSave, email, phone, fullName, address, city, country, postalCode} = getData;
      if ([isSave, email, phone, fullName, address, city, country, postalCode].every(data => data)) {
         saveCheckOut.checked = isSave;
         emailForm.value = email;
         phoneForm.value = phone;
         fullNameForm.value = fullName;
         addressForm.value = address;
         cityForm.value = city;
         countries.innerHTML = `<option value=${country} selected>${country}</option>`;
         postalCodeForm.value = postalCode;
         
         userCheckOut.isSave = isSave;
         userCheckOut.email = email;
         userCheckOut.phone = phone;
         userCheckOut.fullName = fullName;
         userCheckOut.address = address;
         userCheckOut.city = city;
         userCheckOut.country = country;
         userCheckOut.postalCode = postalCode;
      };
      console.log(userCheckOut)
    };
  };
}


window.addEventListener('DOMContentLoaded', () => {
  getListCountry();
  loadUserCheckout();
  cardItems.forEach((card, index) => {
    const quantityButton = card.querySelectorAll('.quantity-btn');
    const quantity = card.querySelector('#quantity');
    updateCost(quantity.value, card, index);
    quantityButton.forEach(btn => {
      btn.onclick = (e) => {
        const target = e.target.id;
        
        if (quantity.value <= 0) {
          quantity.value = 0;
          return false;
        };
        
        if (target == 'plus') {
          quantity.value++;
          updateCost(quantity.value, card, index)
        } else {
          quantity.value--;
          updateCost(quantity.value, card, index)
        };
      };
    });
  });
})