import React, { useEffect, useRef, useState } from 'react';
import './LiveChart.css';

const LiveChart = ({ data, height = 400, width = 800 }) => {
  const canvasRef = useRef(null);
  const [priceData, setPriceData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      const newPrice = data[data.length - 1].price;
      const prevPrice = priceData.length > 0 ? priceData[priceData.length - 1].price : newPrice;
      
      setCurrentPrice(newPrice);
      setPriceChange(newPrice - prevPrice);
      setPriceChangePercent(((newPrice - prevPrice) / prevPrice) * 100);
      setPriceData(data);
    }
  }, [data]);

  useEffect(() => {
    if (priceData.length > 0) {
      drawChart();
    }
  }, [priceData, width, height]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up chart parameters
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Find min and max prices
    const prices = priceData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid lines
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth * i) / 10;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw price line
    if (priceData.length > 1) {
      ctx.strokeStyle = priceChange >= 0 ? '#00ff88' : '#ff4757';
      ctx.lineWidth = 2;
      ctx.beginPath();

      priceData.forEach((point, index) => {
        const x = padding + (chartWidth * index) / (priceData.length - 1);
        const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();

      // Draw current price indicator
      const lastPoint = priceData[priceData.length - 1];
      const lastX = padding + chartWidth;
      const lastY = padding + chartHeight - ((lastPoint.price - minPrice) / priceRange) * chartHeight;
      
      ctx.fillStyle = priceChange >= 0 ? '#00ff88' : '#ff4757';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw price labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange * i) / 5;
      const y = padding + chartHeight - (chartHeight * i) / 5;
      ctx.fillText(`$${price.toFixed(2)}`, padding - 5, y + 4);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <div className="live-chart-container">
      <div className="chart-header">
        <div className="price-info">
          <h2 className="current-price">{formatPrice(currentPrice)}</h2>
          <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            <span className="price-diff">{formatPrice(Math.abs(priceChange))}</span>
            <span className="price-percent">({formatPercent(priceChangePercent)})</span>
          </div>
        </div>
        <div className="chart-controls">
          <button className="timeframe-btn active">1M</button>
          <button className="timeframe-btn">5M</button>
          <button className="timeframe-btn">15M</button>
          <button className="timeframe-btn">1H</button>
        </div>
      </div>
      <div className="chart-wrapper">
        <canvas 
          ref={canvasRef}
          width={width}
          height={height}
          className="price-chart"
        />
      </div>
      <div className="chart-footer">
        <div className="chart-stats">
          <div className="stat">
            <span className="stat-label">24h High:</span>
            <span className="stat-value">{formatPrice(Math.max(...priceData.map(d => d.price)))}</span>
          </div>
          <div className="stat">
            <span className="stat-label">24h Low:</span>
            <span className="stat-value">{formatPrice(Math.min(...priceData.map(d => d.price)))}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Volume:</span>
            <span className="stat-value">1,234,567 BTC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChart;
