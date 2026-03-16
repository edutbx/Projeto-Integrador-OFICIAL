import React from 'react';
import '../../styles/components/LoadingOverlay.css';

interface Props { ativo: boolean; }

const LoadingOverlay: React.FC<Props> = ({ ativo }) => (
  <div className={`overlay ${ativo ? 'overlay--active' : ''}`}>
    <div className="overlay__box">
      <video autoPlay loop muted playsInline preload="auto" className="overlay__video">
        <source src="/video/icone_loading.mp4" type="video/mp4" />
      </video>
      <p className="overlay__text">Interpretando prontuário com IA...</p>
    </div>
  </div>
);
export default LoadingOverlay;
