import { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

interface ScoreDialProps {
  score: number; // 0 to 100
  decision: string;
}

export const ScoreDial: React.FC<ScoreDialProps> = ({ score, decision }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simple count-up animation
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Calculate SVG stroke offset
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let statusClass = 'unknown';
  let StatusIcon = HelpCircle;
  let statusText = 'Unknown';
  let strokeColor = 'var(--warning)';

  if (decision.includes('real')) {
    statusClass = 'real';
    StatusIcon = ShieldCheck;
    statusText = 'Authentic Image';
    strokeColor = 'var(--success)';
  } else if (decision.includes('ai') || decision.includes('deepfake') || decision.includes('fake')) {
    statusClass = 'fake';
    StatusIcon = AlertTriangle;
    statusText = 'AI Generated / Manipulated';
    strokeColor = 'var(--danger)';
  }

  return (
    <div className="result-container">
      <div className="dial-wrapper">
        <svg className="dial-svg" viewBox="0 0 200 200">
          <circle className="dial-bg" cx="100" cy="100" r={radius} />
          <circle
            className="dial-progress"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ stroke: strokeColor }}
          />
        </svg>
        <div className="dial-content">
          <span className="dial-score">{animatedScore}</span>
          <span className="dial-label">Trust Score</span>
        </div>
      </div>
      
      <div className={`result-status ${statusClass}`}>
        <StatusIcon size={28} />
        <span>{statusText}</span>
      </div>
    </div>
  );
};
