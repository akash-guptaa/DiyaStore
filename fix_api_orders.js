const fs = require('fs');

let apiCode = fs.readFileSync('src/app/api/orders/route.ts', 'utf8');

apiCode = apiCode.replace(
  "customerMobile: data.customerMobile,",
  `customerMobile: data.customerMobile,
    customerEmail: data.customerEmail,
    customerAddress: data.customerAddress,
    customerCity: data.customerCity,
    customerState: data.customerState,
    customerPincode: data.customerPincode,
    orderNotes: data.orderNotes,`
);

fs.writeFileSync('src/app/api/orders/route.ts', apiCode);
console.log('Fixed API Route to save addresses');
