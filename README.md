# TradePro - Advanced TradingView Alternative

## 🎯 Overview

TradePro is a full-featured, free trading platform that provides real-time market data, professional charting, and unlimited customizable indicators - all without any cost. Built as a powerful alternative to TradingView, it offers comprehensive technical analysis tools for traders of all levels.

## ✨ Key Features

### 📊 Real-Time Live Charts
- **Live Price Updates**: WebSocket-powered real-time data streaming
- **Multiple Timeframes**: 1m, 5m, 15m, 1H, 4H, 1D intervals
- **Candlestick Charts**: Professional OHLC visualization
- **Volume Analysis**: Built-in volume histogram
- **Zoom & Pan**: Interactive chart navigation
- **Crosshair Tool**: Precise price and time analysis

### 📈 Unlimited Indicators (100% Free)
All indicators are completely free with no limitations!

#### Trend Indicators
- **SMA** (Simple Moving Average) - Classic trend tracking
- **EMA** (Exponential Moving Average) - Responsive trend following
- **WMA** (Weighted Moving Average) - Custom weighted averages

#### Momentum Indicators
- **RSI** (Relative Strength Index) - Overbought/oversold signals
- **MACD** (Moving Average Convergence Divergence) - Trend momentum
- **Stochastic** - Momentum oscillator

#### Volatility Indicators
- **Bollinger Bands** - Volatility-based support/resistance
- **ATR** (Average True Range) - Volatility measurement

#### Custom Indicators
- **Build Your Own**: Write JavaScript to create custom indicators
- **Unlimited Possibilities**: No restrictions on indicator complexity
- **Instant Application**: Apply custom indicators immediately

### 🎯 Additional Features
- **Watchlist**: Track multiple symbols simultaneously
- **Price Alerts**: Real-time price change monitoring
- **Dark/Light Mode**: Switch between themes
- **Responsive Design**: Works on desktop and tablets
- **Fast Performance**: Optimized rendering engine

## 🚀 Getting Started

### Access the Platform
**Visit**: https://abhimanyusnair42022-tech.github.io/tradepro/

### Basic Usage

#### 1. Change Symbol
- Enter any cryptocurrency pair in the search box (e.g., BTC/USDT, ETH/USDT)
- Press Enter or click on a symbol from the watchlist

#### 2. Change Timeframe
- Use the dropdown to select: 1m, 5m, 15m, 1H, 4H, or 1D
- Chart automatically refreshes with new data

#### 3. Add Indicators
- Click the "+ Add Indicator" button
- Choose from built-in indicators
- Or write custom JavaScript code for custom indicators

#### 4. Watchlist
- Click on any symbol in the watchlist to view its chart
- Prices update automatically every 30 seconds

#### 5. Chart Controls
- **Scroll**: Mouse wheel or drag
- **Zoom**: Mouse wheel or pinch
- **Pan**: Click and drag the chart
- **Reset**: Double-click on the time scale

## 💻 Technical Architecture

### Technology Stack
- **Lightweight Charts**: High-performance charting library (by TradingView)
- **Binance API**: Real-time market data (free, no API key required)
- **Vanilla JavaScript**: No framework dependencies
- **WebSocket**: Real-time data streaming
- **HTML5/CSS3**: Modern, responsive UI

### Data Sources
Currently supports cryptocurrency pairs via Binance's public API:
- BTC/USDT, ETH/USDT, BNB/USDT
- XRP/USDT, SOL/USDT, and many more
- All major cryptocurrency trading pairs

## 📝 Custom Indicator Creation

### How to Create Custom Indicators

1. Click "+ Add Indicator"
2. Scroll to "Custom Indicator" section
3. Write your JavaScript code
4. Click "Add Custom"

### Example Custom Indicator

```javascript
// Simple Moving Average with custom period
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

### Data Structure
Each candle object contains:
- `time`: Unix timestamp (seconds)
- `open`: Opening price
- `high`: Highest price
- `low`: Lowest price
- `close`: Closing price

## 🎨 Features in Detail

### Indicator Panels
Indicators are displayed in two ways:
- **Overlay**: Displayed directly on the price chart (SMA, EMA, Bollinger Bands)
- **Separate Panel**: Displayed in their own panel (RSI, MACD, Stochastic)

### Reference Lines
Oscillator indicators include automatic reference lines:
- **RSI**: 30 (oversold) and 70 (overbought)
- **Stochastic**: 20 (oversold) and 80 (overbought)

### Color Coding
- **Green/Bullish**: Price increased, positive momentum
- **Red/Bearish**: Price decreased, negative momentum
- **Consistent**: Professional TradingView-style colors

## 🔧 Configuration Options

### Chart Settings
- **Show Volume**: Toggle volume histogram on/off
- **Dark Mode**: Switch between dark and light themes
- **Time Scale**: Show/hide time axis

### Indicator Management
- **Add**: Click "+ Add Indicator" button
- **Remove**: Click × button on active indicator
- **Multiple**: Add unlimited indicators

## 📊 Performance

### Real-Time Updates
- **Price**: Updates every second via WebSocket
- **Watchlist**: Refreshes every 30 seconds
- **Indicators**: Recalculated with new data

### Data Limits
- **Historical Data**: Up to 1000 candles
- **Memory Usage**: Optimized for smooth performance
- **Latency**: Sub-second data updates

## 🌟 Advantages Over TradingView

### ✅ Completely Free
- No subscription fees
- No pro plans needed
- All features accessible

### ✅ Unlimited Indicators
- Add as many indicators as you want
- Create unlimited custom indicators
- No restrictions on complexity

### ✅ No Account Required
- Start trading immediately
- No sign-up process
- No personal information needed

### ✅ Open & Flexible
- Custom indicator builder
- Extensible architecture
- Community-driven features

## 🎓 Use Cases

### Day Trading
- Real-time 1-minute charts
- Quick price action analysis
- Fast indicator updates

### Swing Trading
- Daily and 4-hour timeframes
- Trend following indicators
- Support/resistance levels

### Technical Analysis
- Multiple timeframe analysis
- Indicator combinations
- Custom strategy testing

### Market Research
- Watchlist monitoring
- Price change tracking
- Comparative analysis

## 🛠️ Technical Support

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ⚠️ Limited support

### System Requirements
- Modern web browser
- Internet connection
- JavaScript enabled

## 📄 License

This project is open source and free to use for personal and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional indicators
- New data sources
- UI enhancements
- Performance optimizations
- Bug fixes

---

**Start Trading Today!** Visit the platform at https://abhimanyusnair42022-tech.github.io/tradepro/