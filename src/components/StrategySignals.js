import React, { useState, useEffect } from 'react';
import './StrategySignals.css';

const StrategySignals = ({ signals = [], isLoading = false }) => {
  const [activeStrategy, setActiveStrategy] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [filterStrength, setFilterStrength] = useState('all');
  const [visibleSignals, setVisibleSignals] = useState([]);

  // Mock signals if none provided
  const mockSignals = [
    {
      id: 1,
      strategy: 'RSI Scalping',
      type: 'BUY',
      strength: 'Strong',
      price: 67420.50,
      target: 67520.50,
      stopLoss: 67320.50,
      timestamp: Date.now() - 300000, // 5 minutes ago
      confidence: 85,
      description: 'RSI oversold condition with bullish divergence'
    },
    {
      id: 2,
      strategy: 'MACD Momentum',
      type: 'SELL',
      strength: 'Medium',
      price: 67380.25,
      target: 67280.25,
      stopLoss: 67480.25,
      timestamp: Date.now() - 180000, // 3 minutes ago
      confidence: 72,
      description: 'MACD bearish crossover with volume confirmation'
    },
    {
      id: 3,
      strategy: 'Bollinger Bands',
      type: 'BUY',
      strength: 'Strong',
      price: 67390.75,
      target: 67490.75,
      stopLoss: 67290.75,
      timestamp: Date.now() - 120000, // 2 minutes ago
      confidence: 91,
      description: 'Price bouncing off lower Bollinger Band with high volume'
    },
    {
      id: 4,
      strategy: 'Volume Profile',
      type: 'BUY',
      strength: 'Medium',
      price: 67405.00,
      target: 67505.00,
      stopLoss: 67305.00,
      timestamp: Date.now() - 60000, // 1 minute ago
      confidence: 78,
      description: 'Strong volume support at key level'
    },
    {
      id: 5,
      strategy: 'EMA Crossover',
      type: 'SELL',
      strength: 'Weak',
      price: 67415.25,
      target: 67315.25,
      stopLoss: 67515.25,
      timestamp: Date.now() - 30000, // 30 seconds ago
      confidence: 65,
      description: 'Short-term EMA crossing below long-term EMA'
    }
  ];

  const displaySignals = signals.length > 0 ? signals : mockSignals;

  useEffect(() => {
    let filtered = displaySignals;

    // Filter by strategy
    if (activeStrategy !== 'all') {
      filtered = filtered.filter(signal => 
        signal.strategy.toLowerCase().includes(activeStrategy.toLowerCase())
      );
    }

    // Filter by strength
    if (filterStrength !== 'all') {
      filtered = filtered.filter(signal => 
        signal.strength.toLowerCase() === filterStrength.toLowerCase()
      );
    }

    // Sort signals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return b.timestamp - a.timestamp;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'strength':
          const strengthOrder = { 'Strong': 3, 'Medium': 2, 'Weak': 1 };
          return strengthOrder[b.strength] - strengthOrder[a.strength];
        default:
          return b.timestamp - a.timestamp;
      }
    });

    setVisibleSignals(filtered);
  }, [activeStrategy, sortBy, filterStrength, displaySignals]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getSignalTypeColor = (type) => {
    return type === 'BUY' ? '#00ff88' : '#ff4757';
  };

  const getStrengthColor = (strength) => {
    switch (strength.toLowerCase()) {
      case 'strong': return '#00ff88';
      case 'medium': return '#ffa726';
      case 'weak': return '#ff4757';
      default: return '#888888';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#00ff88';
    if (confidence >= 60) return '#ffa726';
    return '#ff4757';
  };

  const calculateProfitLoss = (signal) => {
    const currentPrice = 67400; // Mock current price
    if (signal.type === 'BUY') {
      return ((currentPrice - signal.price) / signal.price) * 100;
    } else {
      return ((signal.price - currentPrice) / signal.price) * 100;
    }
  };

  return (
    <div className="strategy-signals-container">
      <div className="signals-header">
        <h3 className="signals-title">Trading Signals</h3>
        <div className="signals-count">
          {visibleSignals.length} Active Signal{visibleSignals.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="signals-controls">
        <div className="filter-group">
          <label>Strategy:</label>
          <select 
            value={activeStrategy} 
            onChange={(e) => setActiveStrategy(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Strategies</option>
            <option value="rsi">RSI Scalping</option>
            <option value="macd">MACD Momentum</option>
            <option value="bollinger">Bollinger Bands</option>
            <option value="volume">Volume Profile</option>
            <option value="ema">EMA Crossover</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Strength:</label>
          <select 
            value={filterStrength} 
            onChange={(e) => setFilterStrength(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Strengths</option>
            <option value="strong">Strong</option>
            <option value="medium">Medium</option>
            <option value="weak">Weak</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="timestamp">Time</option>
            <option value="confidence">Confidence</option>
            <option value="strength">Strength</option>
          </select>
        </div>
      </div>

      <div className="signals-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>Loading signals...</span>
          </div>
        ) : visibleSignals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>No signals match your current filters</p>
            <button 
              onClick={() => {
                setActiveStrategy('all');
                setFilterStrength('all');
              }}
              className="reset-filters-btn"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          visibleSignals.map((signal) => {
            const profitLoss = calculateProfitLoss(signal);
            return (
              <div key={signal.id} className="signal-card">
                <div className="signal-header">
                  <div className="signal-strategy">{signal.strategy}</div>
                  <div className="signal-time">{formatTime(signal.timestamp)}</div>
                </div>

                <div className="signal-main">
                  <div className="signal-type-section">
                    <div 
                      className={`signal-type ${signal.type.toLowerCase()}`}
                      style={{ backgroundColor: getSignalTypeColor(signal.type) }}
                    >
                      {signal.type}
                    </div>
                    <div className="signal-price">
                      <span className="price-label">Entry:</span>
                      <span className="price-value">{formatPrice(signal.price)}</span>
                    </div>
                  </div>

                  <div className="signal-targets">
                    <div className="target-item">
                      <span className="target-label">Target:</span>
                      <span className="target-value">{formatPrice(signal.target)}</span>
                    </div>
                    <div className="target-item">
                      <span className="target-label">Stop:</span>
                      <span className="target-value">{formatPrice(signal.stopLoss)}</span>
                    </div>
                  </div>
                </div>

                <div className="signal-metrics">
                  <div className="metric">
                    <span className="metric-label">Strength:</span>
                    <span 
                      className="metric-value"
                      style={{ color: getStrengthColor(signal.strength) }}
                    >
                      {signal.strength}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Confidence:</span>
                    <span 
                      className="metric-value"
                      style={{ color: getConfidenceColor(signal.confidence) }}
                    >
                      {signal.confidence}%
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">P&L:</span>
                    <span 
                      className="metric-value"
                      style={{ color: profitLoss >= 0 ? '#00ff88' : '#ff4757' }}
                    >
                      {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="signal-description">
                  {signal.description}
                </div>

                <div className="signal-actions">
                  <button className="action-btn execute-btn">
                    Execute Trade
                  </button>
                  <button className="action-btn watch-btn">
                    Add to Watchlist
                  </button>
                  <button className="action-btn dismiss-btn">
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StrategySignals;
