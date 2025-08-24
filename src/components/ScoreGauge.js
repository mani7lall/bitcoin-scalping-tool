import React, { useEffect, useRef, useState } from 'react';
import './ScoreGauge.css';

const ScoreGauge = ({ score = 0, maxScore = 100, title = "Trading Score", size = 200 }) => {
  const canvasRef = useRef(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from current to target
    const animationDuration = 1500; // 1.5 seconds
    const frames = 60;
    const scoreIncrement = score / frames;
    let currentFrame = 0;

    const animate = () => {
      if (currentFrame < frames) {
        setAnimatedScore(prevScore => {
          const newScore = Math.min(prevScore + scoreIncrement, score);
          return newScore;
        });
        currentFrame++;
        requestAnimationFrame(animate);
      } else {
        setAnimatedScore(score);
      }
    };

    setAnimatedScore(0);
    animate();
  }, [score]);

  useEffect(() => {
    if (canvasRef.current) {
      drawGauge();
    }
  }, [animatedScore, size]);

  const drawGauge = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate angle (-180 to 0 degrees for semi-circle)
    const startAngle = Math.PI; // 180 degrees
    const endAngle = 0; // 0 degrees
    const scoreAngle = startAngle + (endAngle - startAngle) * (animatedScore / maxScore);

    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw score arc with gradient
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    
    // Color based on score percentage
    const scorePercentage = animatedScore / maxScore;
    if (scorePercentage < 0.3) {
      gradient.addColorStop(0, '#ff4757');
      gradient.addColorStop(1, '#ff6b7a');
    } else if (scorePercentage < 0.7) {
      gradient.addColorStop(0, '#ffa726');
      gradient.addColorStop(1, '#ffcc02');
    } else {
      gradient.addColorStop(0, '#00ff88');
      gradient.addColorStop(1, '#00d4aa');
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, scoreAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw needle
    const needleLength = radius - 10;
    const needleX = centerX + needleLength * Math.cos(scoreAngle);
    const needleY = centerY + needleLength * Math.sin(scoreAngle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw score markers
    const markerCount = 11; // 0, 10, 20, ..., 100
    for (let i = 0; i < markerCount; i++) {
      const markerAngle = startAngle + (endAngle - startAngle) * (i / (markerCount - 1));
      const innerRadius = radius - 30;
      const outerRadius = radius - 15;
      
      const x1 = centerX + innerRadius * Math.cos(markerAngle);
      const y1 = centerY + innerRadius * Math.sin(markerAngle);
      const x2 = centerX + outerRadius * Math.cos(markerAngle);
      const y2 = centerY + outerRadius * Math.sin(markerAngle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw marker labels
      if (i % 2 === 0) { // Show labels for 0, 20, 40, 60, 80, 100
        const labelRadius = radius - 45;
        const labelX = centerX + labelRadius * Math.cos(markerAngle);
        const labelY = centerY + labelRadius * Math.sin(markerAngle);
        const labelValue = (i / (markerCount - 1)) * maxScore;
        
        ctx.fillStyle = '#888888';
        ctx.font = `${size * 0.06}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelValue.toString(), labelX, labelY);
      }
    }
  };

  const getScoreColor = () => {
    const percentage = animatedScore / maxScore;
    if (percentage < 0.3) return '#ff4757';
    if (percentage < 0.7) return '#ffa726';
    return '#00ff88';
  };

  const getScoreLabel = () => {
    const percentage = animatedScore / maxScore;
    if (percentage < 0.3) return 'Poor';
    if (percentage < 0.5) return 'Fair';
    if (percentage < 0.7) return 'Good';
    if (percentage < 0.9) return 'Excellent';
    return 'Outstanding';
  };

  return (
    <div className="score-gauge-container">
      <div className="gauge-header">
        <h3 className="gauge-title">{title}</h3>
      </div>
      
      <div className="gauge-wrapper" style={{ width: size, height: size * 0.6 }}>
        <canvas 
          ref={canvasRef}
          width={size}
          height={size}
          className="gauge-canvas"
        />
        
        <div className="score-display">
          <div 
            className="score-value"
            style={{ color: getScoreColor(), fontSize: size * 0.12 }}
          >
            {Math.round(animatedScore)}
          </div>
          <div className="score-max">/{maxScore}</div>
        </div>
        
        <div className="score-label" style={{ color: getScoreColor() }}>
          {getScoreLabel()}
        </div>
      </div>
      
      <div className="gauge-footer">
        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Technical:</span>
            <span className="breakdown-value">{Math.round(animatedScore * 0.4)}/40</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Momentum:</span>
            <span className="breakdown-value">{Math.round(animatedScore * 0.35)}/35</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Volume:</span>
            <span className="breakdown-value">{Math.round(animatedScore * 0.25)}/25</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
