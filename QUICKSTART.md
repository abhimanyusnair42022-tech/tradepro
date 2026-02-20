# Quick Start Guide - TradePro

## 🚀 Get Started in 3 Easy Steps

### Step 1: Access the Platform
Open your browser and navigate to:
**https://tradepro-005tw.app.super.myninja.ai**

### Step 2: Start Charting
- The platform loads with BTC/USDT by default
- Real-time data starts streaming immediately
- Zoom, pan, and explore the chart

### Step 3: Add Indicators
- Click the "+ Add Indicator" button
- Select any indicator from the list
- It appears instantly on your chart

## 📊 Basic Operations

### Change Trading Pair
1. Type symbol in search box (e.g., ETH/USDT)
2. Press Enter
3. Chart updates automatically

### Change Timeframe
1. Click the timeframe dropdown
2. Select: 1m, 5m, 15m, 1H, 4H, or 1D
3. Chart refreshes with new interval

### Navigate the Chart
- **Zoom**: Mouse wheel
- **Pan**: Click and drag
- **Reset**: Double-click time scale
- **Crosshair**: Move mouse over chart

## 🎯 Popular Indicator Combinations

### For Trend Following
1. SMA (20 period) - Blue line
2. EMA (50 period) - Orange line
3. Volume - Bottom histogram

### For Momentum Trading
1. RSI (14 period) - Separate panel
2. MACD (12, 26, 9) - Separate panel
3. Bollinger Bands - Overlay

### For Volatility Analysis
1. Bollinger Bands (20, 2) - Overlay
2. ATR (14 period) - Separate panel
3. Volume - Bottom histogram

## 💡 Pro Tips

### Watchlist Usage
- Click any symbol in the watchlist to switch charts
- Watchlist updates every 30 seconds
- Green = positive change, Red = negative

### Custom Indicators
Create your own indicators using JavaScript:
```javascript
// Example: 10-period simple moving average
const period = 10;
const result = [];

for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
    }
    result.push({
        time: data[i].time,
        value: sum / period
    });
}

return result;
```

### Reading the Chart
- **Green candles**: Price went up
- **Red candles**: Price went down
- **Wicks**: Show high/low range
- **Volume**: Bar height = trading volume

## 🎨 Keyboard Shortcuts

- **Enter**: Load symbol from search
- **Arrow Keys**: Pan chart (coming soon)
- **+/-**: Zoom in/out (coming soon)

## 📱 Supported Pairs

Currently supports all Binance cryptocurrency pairs:
- Major: BTC, ETH, BNB, XRP, SOL
- Altcoins: ADA, DOGE, DOT, AVAX, MATIC
- DeFi: UNI, AAVE, LINK, COMP
- And hundreds more!

## ⚡ Performance Tips

1. **Limit Indicators**: Each indicator uses processing power
2. **Use Appropriate Timeframes**: Shorter timeframes = more data
3. **Close Unused Tabs**: Browser performance matters
4. **Stable Internet**: Required for real-time updates

## 🆘 Troubleshooting

### Chart Not Loading
- Check internet connection
- Refresh the page
- Try a different browser

### No Data Showing
- Verify the symbol format (e.g., BTC/USDT)
- Check if the pair exists on Binance
- Wait a few seconds for data to load

### Indicators Not Working
- Remove and re-add the indicator
- Check for JavaScript errors in custom code
- Ensure you have enough historical data

## 🎓 Next Steps

1. **Explore**: Try different timeframes and indicators
2. **Experiment**: Create custom indicators
3. **Learn**: Study how different indicators work together
4. **Practice**: Develop your trading strategies

## 📞 Need Help?

- Check the full README.md for detailed documentation
- Experiment with the platform features
- Start with simple indicator combinations

---

**Ready to trade?** Start exploring the platform now!
**URL**: https://tradepro-005tw.app.super.myninja.ai