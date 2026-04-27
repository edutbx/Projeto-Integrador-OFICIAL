import React, { useState, useEffect, useRef, useCallback } from 'react';
import { logoutGestor, getGestorToken } from '../../services/authService';
import { listarNotificacoes, contarNaoLidas, marcarComoLida, Notificacao } from '../../services/notificacaoService';
import Logo from '../Logo/Logo';
import '../../styles/components/GestorHeader.css';

interface GestorHeaderProps {
  nome?: string;
  sobrenome?: string;
}

const GestorIcon: React.FC = () => (
  <div className="gestor-avatar">
    <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
      <circle cx="28" cy="28" r="28" fill="#FFF3D0" stroke="#F4A623" strokeWidth="2.5"/>
      <circle cx="28" cy="20" r="8" fill="#3b6bc8"/>
      <path d="M12 46c0-8.837 7.163-14 16-14s16 5.163 16 14" fill="#3b6bc8"/>
    </svg>
  </div>
);

const GestorHeader: React.FC<GestorHeaderProps> = ({ nome = 'Gestor', sobrenome = '' }) => {
  const [naoLidas, setNaoLidas]   = useState(0);
  const [notifs, setNotifs]       = useState<Notificacao[]>([]);
  const [aberto, setAberto]       = useState(false);
  const dropRef                   = useRef<HTMLDivElement>(null);
  const token                     = getGestorToken() ?? '';

  const carregarCount = useCallback(async () => {
    if (!token) return;
    const count = await contarNaoLidas(token);
    setNaoLidas(count);
  }, [token]);

  const abrirPanel = async () => {
    if (!aberto && token) {
      const lista = await listarNotificacoes(token);
      setNotifs(lista);
    }
    setAberto(v => !v);
  };

  const handleLida = async (id: string) => {
    await marcarComoLida(id, token);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    setNaoLidas(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    carregarCount();
    const interval = setInterval(carregarCount, 30000);
    return () => clearInterval(interval);
  }, [carregarCount]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatarData = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <header className="gestor-header">
      <Logo size="sm" />
      <div className="gestor-header__right">

        {/* Sino de notificações */}
        <div ref={dropRef} className="gestor-notif-wrap">
          <button
            className={`gestor-bell${naoLidas > 0 ? ' gestor-bell--active' : ''}`}
            onClick={abrirPanel}
            title="Notificações"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {naoLidas > 0 && (
              <span className="gestor-bell__badge">{naoLidas > 99 ? '99+' : naoLidas}</span>
            )}
          </button>

          {aberto && (
            <div className="gestor-notif-panel">
              <div className="gestor-notif-panel__header">
                <span>Notificações</span>
                {naoLidas > 0 && (
                  <span className="gestor-notif-panel__count">{naoLidas} nova{naoLidas > 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="gestor-notif-panel__list">
                {notifs.length === 0 ? (
                  <p className="gestor-notif-panel__empty">Nenhuma notificação.</p>
                ) : (
                  notifs.map(n => (
                    <div key={n.id} className={`gestor-notif-item${n.lida ? ' gestor-notif-item--lida' : ''}`}>
                      <div className="gestor-notif-item__top">
                        <strong>{n.nomeRemetente}</strong>
                        <span className="gestor-notif-item__time">{formatarData(n.dataHora)}</span>
                      </div>
                      <p className="gestor-notif-item__email">
                        {n.emailRemetente}{n.crm ? ` · CRM: ${n.crm}` : ''}
                      </p>
                      {n.mensagem && <p className="gestor-notif-item__msg">"{n.mensagem}"</p>}
                      {!n.lida && (
                        <button className="gestor-notif-item__btn" onClick={() => handleLida(n.id)}>
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="gestor-header__info">
          <p className="gestor-header__name">{nome} {sobrenome}</p>
          <p className="gestor-header__role">Gestor do Sistema</p>
        </div>
        <GestorIcon />
        <button className="gestor-header__sair" onClick={logoutGestor}>Sair</button>
      </div>
    </header>
  );
};

export default GestorHeader;
