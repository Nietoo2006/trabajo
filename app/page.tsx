'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const questions = [
  {
    id: 3,
    tag: '// módulo: entretenimiento.exe',
    text: '🎬 Noche de películas — ¿qué genero seleccionas?',
    options: [
      '🚀 Sci-Fi — universos paralelos',
      '🕵️ Thriller psicológico — glitches en la matrix',
      '🧪 Documental de ciencia — IRL tutorials 😂',
      '🎭 Comedia romántica — el bug más predecible',
    ],
  },
  {
    id: 4,
    tag: '// módulo: actividades_sociales.config',
    text: '📍 Primera cita — ¿qué instancia ejecutamos?',
    options: [
      '☕ Café + código — pair programming romántico',
      '🔭 Planetario — explorar el universo juntos',
      '🎮 Arcade vintage — retro & chill',
      '📚 Librería + helado — the OG nerd date',
    ],
  },
  {
    id: 5,
    tag: '// módulo: nutrición_social.dat',
    text: '🍽 Escoge el stack gastronómico de la noche',
    options: [
      '🍕 Pizza — el stack más sólido de la gastronomía 🍕',
      '🍣 Sushi — raw data sin procesar 🍣',
      '🍔 Burger — arquitectura en capas de sabor 🍔',
      '🌮 Tacos — open source & altamente customizable 🌮',
    ],
  },
  {
    id: 6,
    tag: '// módulo: nivel_compromiso.final',
    text: '✨ Después de la cita... ¿qué hacemos? (hypothetically 👀)',
    options: [
      '🌙 Paseo nocturno con debate filosófico',
      '🎵 Playlist compartida en bucle infinito',
      '🎲 Board game maratón — ganador elige la próxima cita',
      '🌠 Ver las estrellas — con o sin telescopio',
    ],
  },
];

const questionHeaderImages: Record<number, string> = {
  3: '/memes/gatito3.png',
  4: '/memes/gatito4.png',
  5: '/memes/gatito5.png',
  6: '/memes/gatito6.png',
};
const catHeaderImg = '/memes/gatito7.png';
const catImagesStep1 = ['/memes/1.png', '/memes/2.png', '/memes/5.png'];
const catImagesStep2 = ['/memes/3.jpg', '/memes/4.png'];

const floatCatSrcs = [
  '/memes/1.png',
  '/memes/2.png',
  '/memes/3.jpg',
  '/memes/4.png',
  '/memes/5.png',
];

const initialAns: Record<number, string> = {};

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(initialAns);
  const [noAttempts, setNoAttempts] = useState(0);
  const [showNoMsg, setShowNoMsg] = useState(false);
  const [pickError, setPickError] = useState<Record<number, boolean>>({});
  const [showFinale, setShowFinale] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ left: string; top: string } | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const noMsgRef = useRef<HTMLParagraphElement | null>(null);
  const floatCatsContainer = useRef<HTMLDivElement | null>(null);

  const summaryValues = useMemo(() => {
    return questions.map((question) => answers[question.id] ?? '—');
  }, [answers]);

  useEffect(() => {
    if (showFinale) {
      spawnCats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFinale]);

  function go(from: number, to: number) {
    if (from >= 3 && !answers[from]) {
      setPickError((prev) => ({ ...prev, [from]: true }));
      return;
    }
    setPickError((prev) => ({ ...prev, [from]: false }));
    setCurrentStep(to);
  }

  function pick(step: number, idx: number, val: string) {
    setAnswers((prev) => ({ ...prev, [step]: val }));
    setPickError((prev) => ({ ...prev, [step]: false }));
  }

  function escapeNo() {
    setNoAttempts((prev) => Math.min(prev + 1, 5));
    setShowNoMsg(true);
    const btnNo = noButtonRef.current;
    const btnSi = yesButtonRef.current;
    const parent = btnNo?.parentElement;
    if (!btnNo || !btnSi || !parent) return;

    const newSize = 18 + (noAttempts + 1) * 4;
    const newPad = 16 + (noAttempts + 1) * 4;
    btnSi.style.fontSize = Math.min(newSize, 42) + 'px';
    btnSi.style.padding = Math.min(newPad, 32) + 'px ' + Math.min(newPad + 24, 64) + 'px';

    const maxX = parent.offsetWidth - btnNo.offsetWidth - 20;
    const maxY = 100;
    const left = Math.random() * Math.max(maxX, 50);
    const top = Math.random() * maxY - 20;
    setSelectedPosition({ left: `${left}px`, top: `${top}px` });
  }

  function pickDate() {
    const fechaInput = document.getElementById('cita-fecha') as HTMLInputElement | null;
    const horaInput = document.getElementById('cita-hora') as HTMLInputElement | null;
    const fecha = fechaInput?.value ?? '';
    const hora = horaInput?.value ?? '';

    if (!fecha || !hora) {
      setPickError((prev) => ({ ...prev, 2: true }));
      return;
    }
    setPickError((prev) => ({ ...prev, 2: false }));
    setAnswers((prev) => ({ ...prev, 2: `${fecha} a las ${hora}` }));
    setCurrentStep(3);
  }

  function celebrate() {
    setShowFinale(true);
  }

  function spawnCats() {
    if (!floatCatsContainer.current) return;
    for (let i = 0; i < 16; i += 1) {
      setTimeout(() => {
        const img = document.createElement('img');
        img.className = 'float-cat';
        img.src = floatCatSrcs[Math.floor(Math.random() * floatCatSrcs.length)];
        img.style.left = `${Math.random() * 95}%`;
        img.style.animationDuration = `${3 + Math.random() * 4}s`;
        if (floatCatsContainer.current) {
          floatCatsContainer.current.appendChild(img);
          setTimeout(() => img.remove(), 8000);
        }
      }, i * 200);
    }
  }

  const noButtonStyles = useMemo(() => {
    if (noAttempts === 0) return {};
    const size = Math.max(14 - noAttempts, 8);
    const pad = Math.max(12 - noAttempts * 2, 4);
    return {
      position: 'absolute' as const,
      left: selectedPosition?.left ?? 'auto',
      top: selectedPosition?.top ?? 'auto',
      fontSize: `${size}px`,
      padding: `${pad}px ${Math.max(24 - noAttempts * 3, 8)}px`,
    };
  }, [noAttempts, selectedPosition]);

  const yesButtonStyles = useMemo(() => {
    if (noAttempts === 0) return {};
    const size = Math.min(18 + noAttempts * 4, 42);
    const pad = Math.min(16 + noAttempts * 4, 32);
    return {
      fontSize: `${size}px`,
      padding: `${pad}px ${Math.min(pad + 24, 64)}px`,
    };
  }, [noAttempts]);

  return (
    <main className="app" style={{ width: '100%', maxWidth: 560, margin: '0 auto', minHeight: '100vh', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div className="header" style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeDown 0.6s ease' }}>
          <img src="/memes/gatito1.png" alt="gatito1" style={{ width: 150, height: 'auto', borderRadius: 16, display: 'block', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>
            ¿Saldrías conmigo?
          </h1>
           <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            // ejecutando: peticion_romantica_v2.0.cat
          </p>
        </div>

        <div className={`step ${currentStep === 0 ? 'active' : ''}`} style={{ display: currentStep === 0 ? 'block' : 'none', animation: 'slideUp 0.4s cubic-bezier(.34,1.56,.64,1)' }} id="s0">
          <div className="plea-card" style={{ background: 'var(--primary-light)', border: '2px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius)', padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <span className="plea-emoji" style={{ fontSize: 40, flexShrink: 0 }}>
              <img src="/memes/gatito2.png" alt="Emoji gato" style={{ width: 80, height: 80, borderRadius: 12 }} />
            </span>
            <div className="plea-text" style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-dark)', lineHeight: 1.4 }}>
              Antes de responder... ¡responde esto primero! 🥺
              <small style={{ display: 'block', fontSize: 12, fontFamily: 'Fira Code, monospace', color: 'var(--primary)', opacity: 0.8, fontWeight: 400, marginTop: 4 }}>
                /* se requiere una respuesta para continuar */
              </small>
            </div>
          </div>
          <button className="btn-next" style={{ width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px 24px', fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }} onClick={() => go(0, 1)}>
            [ INICIAR PROTOCOLO → ]
          </button>
        </div>

        <div className="step" style={{ display: currentStep === 1 ? 'block' : 'none' }} id="s1">
          <div className="q-card" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 24, marginBottom: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              {catImagesStep1.map((src, index) => (
                <img key={index} src={src} alt={`Imagen ${index + 1}`} style={{ width: 120, height: 'auto', borderRadius: 16, animation: 'float 3s ease-in-out infinite', animationDelay: `${index * 0.5}s` }} />
              ))}
            </div>
            <div className="q-text" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4, marginBottom: 20 }}>
              ¿Quieres tener una cita conmigo? 🥺💕
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              minHeight: 80,
              position: 'relative',
            }}>
              <button
                ref={yesButtonRef}
                className="btn-next"
                style={{
                  fontSize: 18,
                  padding: '16px 40px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 24px rgba(124,58,237,0.24)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, all 0.2s ease',
                  ...yesButtonStyles,
                }}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, 1: '¡Sí! 💜' }));
                  go(1, 2);
                }}
              >
                Sí 💜
              </button>
              {noAttempts < 5 && (
                <button
                  ref={noButtonRef}
                  className="btn-next"
                  style={{
                    fontSize: 14,
                    padding: '12px 24px',
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, #ffd5d5, #ff9292)',
                    borderColor: '#f57373',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(75,85,99,0.18)',
                    transition: 'transform 0.2s ease, all 0.2s ease',
                    position: noAttempts === 0 ? 'relative' : 'absolute',
                    left: noAttempts === 0 ? undefined : selectedPosition?.left,
                    top: noAttempts === 0 ? undefined : selectedPosition?.top,
                    ...noButtonStyles,
                  }}
                  onMouseOver={escapeNo}
                  onTouchStart={escapeNo}
                >
                  No
                </button>
              )}
            </div>
            <p ref={noMsgRef} id="no-msg" style={{ display: showNoMsg ? 'block' : 'none', marginTop: 12, fontFamily: 'Fira Code, monospace', fontSize: 12, color: 'var(--accent)' }}>
              {noAttempts >= 5
                ? '// el "No" ya no existe en el sistema 😼💜'
                : '// error: opción no válida 😼'}
            </p>
          </div>
        </div>

        <div className="step" style={{ display: currentStep === 2 ? 'block' : 'none' }} id="s2">
          <div className="q-card" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 24, marginBottom: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <img src={catImagesStep2[0]} alt="Corgi" style={{ marginTop: 50, height: 140, width: 'auto', borderRadius: 16, animation: 'pulse 2s ease-in-out infinite' }} />
              <img src={catImagesStep2[1]} alt="Gatito emocionado" style={{ marginTop: -50, height: 260, width: 200, borderRadius: 16, animation: 'pulse 2s ease-in-out infinite', animationDelay: '0.5s' }} />
            </div>
            <span className="q-tag" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 12, fontWeight: 500 }}>
              // módulo: agenda.sync
            </span>
            <div className="q-text" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4, marginTop: 12, marginBottom: 20 }}>
              ¿Cuándo estás disponible? 📅
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <label style={{ fontFamily: 'Fira Code, monospace', fontSize: 12, color: 'var(--text-muted)', width: '100%', textAlign: 'left' }}>
                Fecha:
              </label>
              <input id="cita-fecha" type="date" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)', background: 'var(--bg)', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
              <label style={{ fontFamily: 'Fira Code, monospace', fontSize: 12, color: 'var(--text-muted)', width: '100%', textAlign: 'left', marginTop: 8 }}>
                Hora:
              </label>
              <input id="cita-hora" type="time" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)', background: 'var(--bg)', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div className="err-msg" style={{ display: pickError[2] ? 'block' : 'none', fontFamily: 'Fira Code, monospace', fontSize: 12, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', marginTop: 8 }}>
              // error: selecciona fecha y hora para continuar 🗓️
            </div>
            <button className="btn-next" style={{ marginTop: 20, width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px 24px', fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }} onClick={pickDate}>
              [ CONFIRMAR FECHA → ]
            </button>
          </div>
        </div>

        {questions.map((question, index) => {
          const stepIndex = question.id;
          const progress = `${(index + 1) * 25}%`;
          const label = `pregunta ${index + 1} / 4`;
          const active = currentStep === stepIndex;
          return (
            <div key={stepIndex} className="step" style={{ display: active ? 'block' : 'none' }} id={`s${stepIndex}`}>
              <span className="progress-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
                {label}
              </span>
              <div className="progress-wrap" style={{ background: 'var(--border)', borderRadius: 100, height: 6, marginBottom: 24, overflow: 'hidden' }}>
                <div className="progress-fill" style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 100, transition: 'width 0.5s cubic-bezier(.34,1.56,.64,1)', width: progress }} />
              </div>
              <div style={{ textAlign: 'center', margin: '12px 0' }}>
                <img src={questionHeaderImages[stepIndex] ?? catHeaderImg} alt="Decoración" style={{ display: 'block', margin: '0 auto', width: 280, maxWidth: '100%', height: 'auto' }} />
              </div>
              <div className="q-card" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 24, marginBottom: 16, border: '1px solid var(--border)' }}>
                <span className="q-tag" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 12, fontWeight: 500 }}>
                  {question.tag}
                </span>
                <div className="q-text" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4 }}>
                  {question.text}
                </div>
              </div>
              <div className="options" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                {question.options.map((option, optionIndex) => {
                  const selected = answers[stepIndex] === option;
                  return (
                    <button key={optionIndex} className={`opt ${selected ? 'selected' : ''}`} style={{
                      background: 'var(--bg)',
                      border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: 14,
                      fontWeight: 600,
                      color: selected ? 'var(--primary-dark)' : 'var(--text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.2s ease',
                      lineHeight: 1.4,
                      boxShadow: selected ? '0 0 0 3px rgba(124,58,237,0.15)' : undefined,
                    }}
                      onClick={() => pick(stepIndex, optionIndex, option)}>
                      <span className="opt-key" style={{ width: 28, height: 28, background: selected ? 'var(--primary)' : 'var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fira Code, monospace', fontSize: 12, fontWeight: 600, color: selected ? 'white' : 'var(--text)' }}>
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className="err-msg" style={{ display: pickError[stepIndex] ? 'block' : 'none', fontFamily: 'Fira Code, monospace', fontSize: 12, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', marginTop: 8 }}>
                ⚠ ¡Elige algo porfa! el algoritmo espera 🙏
              </p>
              <br />
              <button className="btn-next" style={{ width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px 24px', fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }} onClick={() => go(stepIndex, stepIndex + 1)}>
                [ SIGUIENTE PARÁMETRO → ]
              </button>
            </div>
          );
        })}

        <div className="step" style={{ display: currentStep === 7 ? 'block' : 'none' }} id="s7">
          <div className="summary-header" style={{ textAlign: 'center', marginBottom: 24 }}>
            <span className="big-cat" style={{ fontSize: 84, display: 'block', animation: 'pulse 2s ease-in-out infinite', marginBottom: 12 }}>
              <img src={catHeaderImg} alt="Gato grande" style={{ display: 'block', margin: '0 auto', width: 188, height: 188, objectFit: 'contain' }} />
            </span>
            <h2 style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Resumen de compatibilidad
            </h2>
            <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              // análisis completado · match_score: calculando... 💜
            </p>
          </div>
          <div className="summary-table" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16 }}>
            <div className="summary-row" style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, borderBottom: '1px solid var(--border)' }}>
              <span className="s-icon" style={{ fontSize: 22, flexShrink: 0, width: 36, textAlign: 'center' }}>🎬</span>
              <span className="s-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, minWidth: 100 }}>
                película://
              </span>
              <span className="s-value" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                {summaryValues[0]}
              </span>
            </div>
            <div className="summary-row" style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <span className="s-icon" style={{ fontSize: 22, flexShrink: 0, width: 36, textAlign: 'center' }}>📍</span>
              <span className="s-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, minWidth: 100 }}>
                plan://
              </span>
              <span className="s-value" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                {summaryValues[1]}
              </span>
            </div>
            <div className="summary-row" style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, borderBottom: '1px solid var(--border)' }}>
              <span className="s-icon" style={{ fontSize: 22, flexShrink: 0, width: 36, textAlign: 'center' }}>📍</span>
              <span className="s-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, minWidth: 100 }}>
                cita://
              </span>
              <span className="s-value" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                {answers[2] ?? '—'}
              </span>
            </div>
            <div className="summary-row" style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <span className="s-icon" style={{ fontSize: 22, flexShrink: 0, width: 36, textAlign: 'center' }}>🍽</span>
              <span className="s-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, minWidth: 100 }}>
                comida://
              </span>
              <span className="s-value" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                {summaryValues[2]}
              </span>
            </div>
            <div className="summary-row" style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, background: 'var(--bg)' }}>
              <span className="s-icon" style={{ fontSize: 22, flexShrink: 0, width: 36, textAlign: 'center' }}>💫</span>
              <span className="s-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, minWidth: 100 }}>
                después://
              </span>
              <span className="s-value" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                {summaryValues[3]}
              </span>
            </div>
          </div>

          <div className="q-card" style={{ border: '2px solid var(--accent)', textAlign: 'center', padding: 28, borderRadius: 'var(--radius)', background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>
              <img src="/memes/gatito0.png" alt="Pregunta final" style={{ display: 'block', margin: '0 auto', width: 140, height: 140, objectFit: 'contain' }} />
            </span>
            <div className="q-text" style={{ fontSize: 22, lineHeight: 1.4 }}>
              Entonces... ¿saldrías conmigo?
            </div>
            <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              // advertencia: respuesta_incorrecta no existe en este programa
            </p>
          </div>

          <button className="btn-next btn-confirm" style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent), #db2777)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px 24px', fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(236,72,153,0.3)', marginTop: 20, display: showFinale ? 'none' : 'block' }} onClick={celebrate}>
            ✨ [ SÍ, ACEPTO LOS TÉRMINOS Y CONDICIONES ] ✨
          </button>

          <div className="finale" id="fmsg" style={{ display: showFinale ? 'block' : 'none', textAlign: 'center', padding: 24, background: 'var(--green-light)', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius)', animation: 'pop 0.5s cubic-bezier(.34,1.56,.64,1)', marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <img src="/memes/gatito0.png" alt="gatito0" style={{ display: 'block', width: 80, height: 80, objectFit: 'contain' }} />
              <img src="/memes/gatito1.png" alt="gatito1" style={{ display: 'block', width: 140, height: 140, objectFit: 'contain' }} />
              <img src="/memes/gatito0.png" alt="gatito0" style={{ display: 'block', width: 80, height: 80, objectFit: 'contain' }} />
            </div>
         
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', marginBottom: 8 }}>
              ¡Match confirmado!
            </h3>
            <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 12, color: '#065f46', lineHeight: 1.6 }}>
              // status: ÉXITO<br />
              // romance.exe iniciado correctamente<br />
              // nos vemos pronto, mi nerd favorit@ 💜
            </p>
          </div>
          <div ref={floatCatsContainer} />
        </div>
      </div>
    </main>
  );
}
