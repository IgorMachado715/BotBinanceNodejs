
const api = require('./api');
const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);

setInterval(async () => {
   let buy = 0, sell = 0;

   const result = await api.depth(symbol);
   if (result.bids && result.bids.length){
    console.log(`Highest Buy: ${result.bids[0] [0]}`);
    buy = parseInt(result.bids[0] [0]);
   }

   if (result.asks && result.asks.length){
    console.log(`Lowest Sell: ${result.asks[0] [0]}`);
    sell = parseFloat(result.asks[0] [0]);
   }

   if (sell < 700){
       console.log('Hora de Comprar!');

       const account = await api.accountInfo();
       const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
       console.log(`POSIÇÃO DA CARTEIRA:`);
       console.log(coins);

       console.log('Verificando se tenho grana...');
       if(sell <= parseInt(coins.find(c =>  c.asset === 'BUSD').free)){
           console.log('Temos grana! Comprando agora...')
           const buyOrder = await api.newOrder(symbol, 1);
           console.log(`orderId: ${buyOrder.orderId}`);
           console.log(`status: ${buyOrder.status}`);

           console.log('Posicionando venda futura...')
           const price = parseFloat(sell * profitability).toFixed(8);
           console.log(`Vendendo por ${price} (${profitability})`);
           const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
           console.log(`orderId: ${sellOrder.orderId}`);
           console.log(`status: ${sellOrder.status}`);
       }
     }

   else if (buy > 1000){
       console.log('Hora de Vender!');
   }

   else{
       console.log('Esperando o mercado se mexer');
   }

}, process.env.CRAWLER_INTERVAL)
