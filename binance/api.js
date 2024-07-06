const axios = require('axios');
const queryString = require('querystring');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;
//api
async function privateCall(path, data = {}, method = 'GET'){
    const timestamp = Date.now();
    const signature = crypto.createHmac('sha256', apiSecret)
        .update(`${queryString.stringify({ ...data, timestamp })}`)
        .digest('hex');

    const newData = { ...data, timestamp, signature };  
    const qs = `?${queryString.stringify(newData)}`;

    try{
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`,
            headers: { 'X-MBX-APIKEY': apiKey }

        })
        return result.data;

    }
    catch (err){    
        console.log(err);
    }
}

async function newOrder(symbol, quantity, price, side = 'BUY', type = 'MARKET'){
    const data = { symbol, side, type, quantity };

    if(price) data.price = price;
    if(type  === 'LIMIT') data.timeInForce = 'GTC';

    return privateCall('/v3/order', data, 'POST');
 
}


async function accountInfo(){
    return privateCall('/v3/account');
}


async function publicCall(path, data, method = 'GET'){
   try{

     const qs = data ? `?${queryString.stringify(data)}` : '';
     const result = await axios({
         method,
         url: `${apiUrl}${path}${qs}`

     })
     return result.data;
    }
   catch(err){
    console.log(err);
   }
}


async function time(){
    return publicCall('/v3/time');
}

async function depth(symbol = 'BTCBRL', limit = 5){
    return publicCall('/v3/depth', { symbol, limit });
}

async function exchangeInfo(){
    return publicCall('/v3/exchangeInfo');
}


module.exports = { time, depth, exchangeInfo, accountInfo, newOrder }
