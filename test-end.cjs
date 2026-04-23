const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/active-sessions',
  method: 'GET'
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const bookings = JSON.parse(data);
    console.log("Active Bookings:", bookings);
    if (bookings.length > 0) {
      const b_id = bookings[0].booking_id;
      console.log(`Attempting to end booking ${b_id}...`);
      
      const endReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/bookings/end/${b_id}`,
        method: 'POST'
      }, res2 => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => console.log("End Booking Response:", res2.statusCode, data2));
      });
      endReq.end();
    }
  });
});
req.end();
