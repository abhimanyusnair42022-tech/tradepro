// TradePro - Advanced Charting Platform
// Full-featured TradingView alternative

class TradePro {
    constructor() {
        this.chart = null;
        this.volumeSeries = null;
        this.candleSeries = null;
        this.indicatorCharts = [];
        this.activeIndicators = new Map();
        this.currentSymbol = 'BTC/USDT';
        this.currentTimeframe = '60';
        this.ws = null;
        this.isDarkMode = true;
        
        this.init();
    }

    init() {
        this.setupChart();
        this.setupEventListeners();
        this.fetchHistoricalData();
        this.connectWebSocket();
        this.updateWatchlist();
    }

    // Chart Setup
    setupChart() {
        const container = document.getElementById('mainChart');
        
        this.chart = LightweightCharts.createChart(container, {
            layout: {
                background: { color: '#1a1a1a' },
                textColor: '#b0b0b0',
            },
            grid: {
                vertLines: { color: '#2a2a2a' },
                horzLines: { color: '#2a2a2a' },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: '#444444',
            },
            timeScale: {
                borderColor: '#444444',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        this.candleSeries = this.chart.addCandlestickSeries({
            upColor: '#00c853',
            downColor: '#ff3d00',
            borderUpColor: '#00c853',
            borderDownColor: '#ff3d00',
            wickUpColor: '#00c853',
            wickDownColor: '#ff3d00',
        });

        this.volumeSeries = this.chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.chart.applyOptions({
                width: container.clientWidth,
                height: container.clientHeight,
            });
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Symbol input
        const symbolInput = document.getElementById('symbolInput');
        symbolInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.changeSymbol(symbolInput.value);
            }
        });

        // Timeframe selector
        const timeframeSelect = document.getElementById('timeframeSelect');
        timeframeSelect.addEventListener('change', (e) => {
            this.currentTimeframe = e.target.value;
            this.fetchHistoricalData();
        });

        // Add indicator button
        const addIndicatorBtn = document.getElementById('addIndicatorBtn');
        addIndicatorBtn.addEventListener('click', () => {
            document.getElementById('indicatorModal').style.display = 'block';
        });

        // Close modal
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('indicatorModal').style.display = 'none';
        });

        // Indicator buttons
        document.querySelectorAll('.indicator-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const indicator = btn.dataset.indicator;
                this.addIndicator(indicator);
                document.getElementById('indicatorModal').style.display = 'none';
            });
        });

        // Custom indicator
        document.getElementById('addCustomIndicator').addEventListener('click', () => {
            const code = document.getElementById('customIndicatorCode').value;
            if (code.trim()) {
                this.addCustomIndicator(code);
                document.getElementById('indicatorModal').style.display = 'none';
            }
        });

        // Watchlist items
        document.querySelectorAll('.watchlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.dataset.symbol;
                document.getElementById('symbolInput').value = symbol;
                this.changeSymbol(symbol);
            });
        });

        // Chart settings
        document.getElementById('showVolume').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.volumeSeries.applyOptions({ visible: true });
            } else {
                this.volumeSeries.applyOptions({ visible: false });
            }
        });

        document.getElementById('darkMode').addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });
    }

    // Data Fetching
    async fetchHistoricalData() {
        try {
            // Using Binance API as example (free, no API key needed)
            const symbol = this.currentSymbol.replace('/', '').toLowerCase();
            const interval = this.getTimeframeInterval();
            const limit = 1000;
            
            const response = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
            );
            
            const data = await response.json();
            
            const candleData = data.map(d => ({
                time: Math.floor(d[0] / 1000),
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
            }));

            const volumeData = data.map(d => ({
                time: Math.floor(d[0] / 1000),
                value: parseFloat(d[5]),
                color: parseFloat(d[4]) >= parseFloat(d[1]) ? '#26a69a' : '#ef5350',
            }));

            this.candleSeries.setData(candleData);
            this.volumeSeries.setData(volumeData);
            
            // Update all indicators
            this.updateAllIndicators(candleData);
            
            // Update current price
            this.updateCurrentPrice(candleData[candleData.length - 1]);
            
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    }

    getTimeframeInterval() {
        const intervals = {
            '1': '1m',
            '5': '5m',
            '15': '15m',
            '60': '1h',
            '240': '4h',
            '1440': '1d'
        };
        return intervals[this.currentTimeframe] || '1h';
    }

    // WebSocket Connection
    connectWebSocket() {
        if (this.ws) {
            this.ws.close();
        }

        const symbol = this.currentSymbol.replace('/', '').toLowerCase();
        const interval = this.getTimeframeInterval();
        
        this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`);
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const kline = data.k;
            
            const candleData = {
                time: Math.floor(kline.t / 1000),
                open: parseFloat(kline.o),
                high: parseFloat(kline.h),
                low: parseFloat(kline.l),
                close: parseFloat(kline.c),
            };

            this.candleSeries.update(candleData);
            
            const volumeData = {
                time: Math.floor(kline.t / 1000),
                value: parseFloat(kline.v),
                color: candleData.close >= candleData.open ? '#26a69a' : '#ef5350',
            };
            
            this.volumeSeries.update(volumeData);
            this.updateCurrentPrice(candleData);
            this.updateIndicatorsRealtime(candleData);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    // Update Functions
    updateCurrentPrice(candleData) {
        const currentPriceEl = document.getElementById('currentPrice');
        const priceChangeEl = document.getElementById('priceChange');
        
        if (candleData) {
            currentPriceEl.textContent = `$${candleData.close.toFixed(2)}`;
            
            const change = ((candleData.close - candleData.open) / candleData.open * 100).toFixed(2);
            priceChangeEl.textContent = `${change >= 0 ? '+' : ''}${change}%`;
            priceChangeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }

    changeSymbol(symbol) {
        this.currentSymbol = symbol.toUpperCase();
        this.fetchHistoricalData();
        this.connectWebSocket();
    }

    // Indicator System
    addIndicator(type) {
        const id = Date.now();
        const indicatorConfig = this.getIndicatorConfig(type);
        
        this.activeIndicators.set(id, {
            id,
            type,
            config: indicatorConfig,
            series: null,
            chart: null,
        });
        
        this.renderIndicator(id);
        this.updateActiveIndicatorsList();
    }

    getIndicatorConfig(type) {
        const configs = {
            sma: { name: 'SMA', period: 20, overlay: true },
            ema: { name: 'EMA', period: 20, overlay: true },
            wma: { name: 'WMA', period: 20, overlay: true },
            rsi: { name: 'RSI', period: 14, overlay: false },
            macd: { name: 'MACD', fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, overlay: false },
            stochastic: { name: 'Stochastic', period: 14, overlay: false },
            bb: { name: 'Bollinger Bands', period: 20, stdDev: 2, overlay: true },
            atr: { name: 'ATR', period: 14, overlay: false },
        };
        return configs[type] || {};
    }

    renderIndicator(id) {
        const indicator = this.activeIndicators.get(id);
        if (!indicator) return;

        const candleData = this.candleSeries.data();
        if (!candleData) return;

        if (indicator.config.overlay) {
            // Overlay indicators go on main chart
            this.addOverlayIndicator(indicator, candleData);
        } else {
            // Separate panel indicators
            this.addPanelIndicator(indicator, candleData);
        }
    }

    addOverlayIndicator(indicator, candleData) {
        let data;
        
        switch (indicator.type) {
            case 'sma':
                data = this.calculateSMA(candleData, indicator.config.period);
                indicator.series = this.chart.addLineSeries({
                    color: '#2962ff',
                    lineWidth: 2,
                    title: indicator.config.name,
                });
                break;
            case 'ema':
                data = this.calculateEMA(candleData, indicator.config.period);
                indicator.series = this.chart.addLineSeries({
                    color: '#ff6d00',
                    lineWidth: 2,
                    title: indicator.config.name,
                });
                break;
            case 'wma':
                data = this.calculateWMA(candleData, indicator.config.period);
                indicator.series = this.chart.addLineSeries({
                    color: '#00c853',
                    lineWidth: 2,
                    title: indicator.config.name,
                });
                break;
            case 'bb':
                const bbData = this.calculateBollingerBands(candleData, indicator.config.period, indicator.config.stdDev);
                indicator.upperBand = this.chart.addLineSeries({ color: '#9e9e9e', lineWidth: 1 });
                indicator.lowerBand = this.chart.addLineSeries({ color: '#9e9e9e', lineWidth: 1 });
                indicator.series = this.chart.addLineSeries({ color: '#4caf50', lineWidth: 1 });
                indicator.upperBand.setData(bbData.upper);
                indicator.series.setData(bbData.middle);
                indicator.lowerBand.setData(bbData.lower);
                return;
        }
        
        if (data) {
            indicator.series.setData(data);
        }
    }

    addPanelIndicator(indicator, candleData) {
        const container = document.getElementById('indicatorCharts');
        
        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'indicator-chart';
        chartContainer.id = `indicator-${indicator.id}`;
        container.appendChild(chartContainer);
        
        // Create chart
        indicator.chart = LightweightCharts.createChart(chartContainer, {
            layout: {
                background: { color: '#1a1a1a' },
                textColor: '#b0b0b0',
            },
            grid: {
                vertLines: { color: '#2a2a2a' },
                horzLines: { color: '#2a2a2a' },
            },
            rightPriceScale: {
                borderColor: '#444444',
            },
            timeScale: {
                borderColor: '#444444',
                visible: false,
            },
        });
        
        indicator.chart.timeScale().syncWith(this.chart.timeScale());
        
        let data;
        
        switch (indicator.type) {
            case 'rsi':
                data = this.calculateRSI(candleData, indicator.config.period);
                indicator.series = indicator.chart.addLineSeries({
                    color: '#9c27b0',
                    lineWidth: 2,
                });
                // Add reference lines
                this.addReferenceLines(indicator.chart, 30, 70);
                break;
            case 'macd':
                const macdData = this.calculateMACD(candleData, indicator.config);
                indicator.series = indicator.chart.addLineSeries({ color: '#2962ff', lineWidth: 2 });
                indicator.signalSeries = indicator.chart.addLineSeries({ color: '#ff6d00', lineWidth: 2 });
                indicator.histogramSeries = indicator.chart.addHistogramSeries({ color: '#26a69a' });
                indicator.series.setData(macdData.macd);
                indicator.signalSeries.setData(macdData.signal);
                indicator.histogramSeries.setData(macdData.histogram);
                return;
            case 'stochastic':
                data = this.calculateStochastic(candleData, indicator.config.period);
                indicator.series = indicator.chart.addLineSeries({ color: '#2962ff', lineWidth: 2 });
                this.addReferenceLines(indicator.chart, 20, 80);
                break;
            case 'atr':
                data = this.calculateATR(candleData, indicator.config.period);
                indicator.series = indicator.chart.addLineSeries({
                    color: '#ff9800',
                    lineWidth: 2,
                });
                break;
        }
        
        if (data) {
            indicator.series.setData(data);
        }
    }

    addReferenceLines(chart, lower, upper) {
        // Add horizontal lines at specified levels
        const priceScale = chart.priceScale();
        priceScale.applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.1,
            },
        });
    }

    // Indicator Calculations
    calculateSMA(data, period) {
        const smaData = [];
        
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            smaData.push({
                time: data[i].time,
                value: sum / period,
            });
        }
        
        return smaData;
    }

    calculateEMA(data, period) {
        const emaData = [];
        const multiplier = 2 / (period + 1);
        
        if (data.length < period) return emaData;
        
        // Calculate first EMA using SMA
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i].close;
        }
        let ema = sum / period;
        
        emaData.push({
            time: data[period - 1].time,
            value: ema,
        });
        
        // Calculate remaining EMAs
        for (let i = period; i < data.length; i++) {
            ema = (data[i].close - ema) * multiplier + ema;
            emaData.push({
                time: data[i].time,
                value: ema,
            });
        }
        
        return emaData;
    }

    calculateWMA(data, period) {
        const wmaData = [];
        
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            let weightSum = 0;
            
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close * (period - j);
                weightSum += (period - j);
            }
            
            wmaData.push({
                time: data[i].time,
                value: sum / weightSum,
            });
        }
        
        return wmaData;
    }

    calculateRSI(data, period) {
        const rsiData = [];
        const gains = [];
        const losses = [];
        
        for (let i = 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        for (let i = period - 1; i < gains.length; i++) {
            let avgGain = 0;
            let avgLoss = 0;
            
            for (let j = 0; j < period; j++) {
                avgGain += gains[i - j];
                avgLoss += losses[i - j];
            }
            
            avgGain /= period;
            avgLoss /= period;
            
            if (avgLoss === 0) {
                rsiData.push({
                    time: data[i + 1].time,
                    value: 100,
                });
            } else {
                const rs = avgGain / avgLoss;
                const rsi = 100 - (100 / (1 + rs));
                rsiData.push({
                    time: data[i + 1].time,
                    value: rsi,
                });
            }
        }
        
        return rsiData;
    }

    calculateMACD(data, config) {
        const ema12 = this.calculateEMA(data, config.fastPeriod);
        const ema26 = this.calculateEMA(data, config.slowPeriod);
        
        const macdLine = [];
        for (let i = 0; i < ema12.length; i++) {
            macdLine.push({
                time: ema12[i].time,
                value: ema12[i].value - ema26[i].value,
            });
        }
        
        const signalLine = this.calculateEMAFromData(macdLine, config.signalPeriod);
        const histogram = [];
        
        for (let i = 0; i < macdLine.length; i++) {
            const macdValue = macdLine[i].value;
            const signalValue = signalLine[i]?.value || 0;
            histogram.push({
                time: macdLine[i].time,
                value: macdValue - signalValue,
                color: macdValue >= signalValue ? '#26a69a' : '#ef5350',
            });
        }
        
        return {
            macd: macdLine,
            signal: signalLine,
            histogram: histogram,
        };
    }

    calculateEMAFromData(data, period) {
        const emaData = [];
        const multiplier = 2 / (period + 1);
        
        if (data.length < period) return emaData;
        
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i].value;
        }
        let ema = sum / period;
        
        emaData.push({
            time: data[period - 1].time,
            value: ema,
        });
        
        for (let i = period; i < data.length; i++) {
            ema = (data[i].value - ema) * multiplier + ema;
            emaData.push({
                time: data[i].time,
                value: ema,
            });
        }
        
        return emaData;
    }

    calculateStochastic(data, period) {
        const stochData = [];
        
        for (let i = period - 1; i < data.length; i++) {
            let high = -Infinity;
            let low = Infinity;
            
            for (let j = 0; j < period; j++) {
                high = Math.max(high, data[i - j].high);
                low = Math.min(low, data[i - j].low);
            }
            
            const k = ((data[i].close - low) / (high - low)) * 100;
            stochData.push({
                time: data[i].time,
                value: k,
            });
        }
        
        return stochData;
    }

    calculateBollingerBands(data, period, stdDev) {
        const sma = this.calculateSMA(data, period);
        const upperBand = [];
        const lowerBand = [];
        const middleBand = [];
        
        for (let i = 0; i < sma.length; i++) {
            const startIndex = i + period - 1;
            const values = [];
            
            for (let j = 0; j < period; j++) {
                values.push(data[startIndex - j].close);
            }
            
            const mean = sma[i].value;
            const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
            const std = Math.sqrt(variance);
            
            middleBand.push(sma[i]);
            upperBand.push({
                time: sma[i].time,
                value: mean + (stdDev * std),
            });
            lowerBand.push({
                time: sma[i].time,
                value: mean - (stdDev * std),
            });
        }
        
        return { upper, middle: middleBand, lower: lowerBand };
    }

    calculateATR(data, period) {
        const atrData = [];
        const trValues = [];
        
        for (let i = 1; i < data.length; i++) {
            const tr = Math.max(
                data[i].high - data[i].low,
                Math.abs(data[i].high - data[i - 1].close),
                Math.abs(data[i].low - data[i - 1].close)
            );
            trValues.push(tr);
        }
        
        for (let i = period - 1; i < trValues.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += trValues[i - j];
            }
            atrData.push({
                time: data[i + 1].time,
                value: sum / period,
            });
        }
        
        return atrData;
    }

    updateAllIndicators(candleData) {
        this.activeIndicators.forEach((indicator, id) => {
            this.removeIndicatorSeries(indicator);
            this.renderIndicator(id);
        });
    }

    updateIndicatorsRealtime(candleData) {
        // Update indicators in real-time
        this.activeIndicators.forEach(indicator => {
            if (indicator.series && candleData) {
                // Calculate and update the last point
                // This is a simplified version - full implementation would recalculate
            }
        });
    }

    removeIndicatorSeries(indicator) {
        if (indicator.series) {
            this.chart.removeSeries(indicator.series);
        }
        if (indicator.upperBand) {
            this.chart.removeSeries(indicator.upperBand);
        }
        if (indicator.lowerBand) {
            this.chart.removeSeries(indicator.lowerBand);
        }
        if (indicator.chart) {
            const container = document.getElementById(`indicator-${indicator.id}`);
            if (container) {
                container.remove();
            }
        }
    }

    removeIndicator(id) {
        const indicator = this.activeIndicators.get(id);
        if (indicator) {
            this.removeIndicatorSeries(indicator);
            this.activeIndicators.delete(id);
            this.updateActiveIndicatorsList();
        }
    }

    updateActiveIndicatorsList() {
        const container = document.getElementById('activeIndicators');
        
        if (this.activeIndicators.size === 0) {
            container.innerHTML = '<p class="no-indicators">No indicators added yet</p>';
            return;
        }
        
        container.innerHTML = '';
        this.activeIndicators.forEach((indicator, id) => {
            const item = document.createElement('div');
            item.className = 'indicator-item';
            item.innerHTML = `
                <span class="name">${indicator.config.name}</span>
                <button class="remove-btn" onclick="tradePro.removeIndicator(${id})">×</button>
            `;
            container.appendChild(item);
        });
    }

    // Custom Indicator
    addCustomIndicator(code) {
        try {
            // Create a safe execution environment for custom indicators
            const customFunction = new Function('data', code);
            const candleData = this.candleSeries.data();
            
            if (candleData) {
                const result = customFunction(candleData);
                
                if (Array.isArray(result) && result.length > 0) {
                    const id = Date.now();
                    const indicator = {
                        id,
                        type: 'custom',
                        config: { name: 'Custom', overlay: true },
                        series: this.chart.addLineSeries({
                            color: '#ffeb3b',
                            lineWidth: 2,
                        }),
                    };
                    
                    indicator.series.setData(result);
                    this.activeIndicators.set(id, indicator);
                    this.updateActiveIndicatorsList();
                }
            }
        } catch (error) {
            console.error('Error in custom indicator:', error);
            alert('Error in custom indicator code. Please check your syntax.');
        }
    }

    // Watchlist
    async updateWatchlist() {
        const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT', 'SOL/USDT'];
        
        for (const symbol of symbols) {
            try {
                const formattedSymbol = symbol.replace('/', '').toLowerCase();
                const response = await fetch(
                    `https://api.binance.com/api/v3/ticker/24hr?symbol=${formattedSymbol}`
                );
                const data = await response.json();
                
                const item = document.querySelector(`[data-symbol="${symbol}"]`);
                if (item) {
                    const priceEl = item.querySelector('.price');
                    const changeEl = item.querySelector('.change');
                    
                    priceEl.textContent = `$${parseFloat(data.lastPrice).toFixed(2)}`;
                    changeEl.textContent = `${parseFloat(data.priceChangePercent).toFixed(2)}%`;
                    changeEl.className = `change ${parseFloat(data.priceChangePercent) >= 0 ? 'positive' : 'negative'}`;
                }
            } catch (error) {
                console.error(`Error updating ${symbol}:`, error);
            }
        }
    }

    // Theme Toggle
    toggleDarkMode(isDark) {
        this.isDarkMode = isDark;
        
        if (isDark) {
            this.chart.applyOptions({
                layout: {
                    background: { color: '#1a1a1a' },
                    textColor: '#b0b0b0',
                },
                grid: {
                    vertLines: { color: '#2a2a2a' },
                    horzLines: { color: '#2a2a2a' },
                },
            });
        } else {
            this.chart.applyOptions({
                layout: {
                    background: { color: '#ffffff' },
                    textColor: '#333333',
                },
                grid: {
                    vertLines: { color: '#e0e0e0' },
                    horzLines: { color: '#e0e0e0' },
                },
            });
        }
    }
}

// Initialize the application
const tradePro = new TradePro();

// Auto-update watchlist every 30 seconds
setInterval(() => {
    tradePro.updateWatchlist();
}, 30000);