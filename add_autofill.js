const fs = require('fs');

let code = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

if (!code.includes("useEffect(() => {")) {
  code = code.replace(
    "import { useRouter } from 'next/navigation';",
    "import { useRouter } from 'next/navigation';\nimport { useEffect } from 'react';"
  );

  const hookStr = `
  useEffect(() => {
    const saved = localStorage.getItem('customer_profile');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(prev => ({ ...prev, name: data.name, mobile: data.mobile }));
      
      // Fetch past orders to auto-fill address
      fetch('/api/orders/customer/' + data.mobile)
        .then(r => r.json())
        .then(orders => {
          if (orders && orders.length > 0) {
            const last = orders[0];
            setFormData(prev => ({
              ...prev,
              address: prev.address || last.customerAddress || '',
              city: prev.city || last.customerCity || '',
              state: prev.state || last.customerState || '',
              pincode: prev.pincode || last.customerPincode || '',
              email: prev.email || last.customerEmail || ''
            }));
          }
        })
        .catch(() => {});
    }
  }, []);
`;

  code = code.replace(
    "const [submitting, setSubmitting] = useState(false);",
    "const [submitting, setSubmitting] = useState(false);\n" + hookStr
  );

  fs.writeFileSync('src/app/checkout/page.tsx', code);
  console.log('Added auto-fill logic to checkout');
}
