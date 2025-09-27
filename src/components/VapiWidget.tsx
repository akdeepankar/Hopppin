import React, { useState, useEffect } from 'react';
import MicLoader from './MicLoader';
import Vapi from '@vapi-ai/web';
import Start from './start';
interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  config?: Record<string, unknown>;
  fixed?: boolean; // if true, widget is fixed at bottom right
}
const VapiWidget: React.FC<VapiWidgetProps> = ({
  apiKey,
  assistantId,
  config = {},
  fixed = true,
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState<
    { role: string; text: string }[]
  >([]);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);
    vapiInstance.on('call-start', () => {
      setIsConnected(true);
      setIsLoading(false);
    });
    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsSpeaking(false);
      setIsLoading(false);
    });
    vapiInstance.on('speech-start', () => setIsSpeaking(true));
    vapiInstance.on('speech-end', () => setIsSpeaking(false));
    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript((prev) => [
          ...prev,
          { role: message.role, text: message.transcript },
        ]);
      }
    });
    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
    });
    return () => {
      vapiInstance?.stop();
    };
  }, [apiKey]);

  const startCall = () => {
    if (vapi) {
      setIsLoading(true);
      vapi.start(assistantId);
    }
  };
  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return (
    <div
      style={{
        ...(fixed
          ? {
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 1000,
            }
          : {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }),
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {!isConnected ? (
        <div
          style={{
            width: 200,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: isLoading ? 'wait' : 'pointer',
            margin: 8,
            transition: 'all 0.3s ease',
            userSelect: 'none',
          }}
          onClick={!isLoading ? startCall : undefined}
        >
          <MicLoader active={isLoading} />
          {!isLoading && (
            <div className="">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: 100,
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  <Start />
                </span>
                <div
                  style={{
                    fontSize: 18,
                    color: '#fff',
                    marginTop: 12,
                    fontWeight: 300,
                    textShadow: '0 2px 8px #0008',
                    fontStyle: 'italic',
                  }}
                >
                  Click to Start
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '18px',
            padding: '24px',
            width: '340px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            border: '1.5px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            transition: 'background 0.3s',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: isSpeaking ? '#ff4444' : '#12A594',
                  animation: isSpeaking ? 'pulse 1s infinite' : 'none',
                }}
              ></div>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>
                {isSpeaking ? 'Assistant Speaking...' : 'Listening...'}
              </span>
            </div>
            <button
              onClick={endCall}
              style={{
                background: '#ff4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              End Call
            </button>
          </div>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              marginBottom: '12px',
              padding: '8px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
            }}
          >
            {transcript.length === 0 ? (
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                Conversation will appear here...
              </p>
            ) : (
              transcript.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: '8px',
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}
                >
                  <span
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'rgba(18, 165, 148, 0.02)'
                          : 'rgba(255,255,255,0.02)',
                      color: msg.role === 'user' ? '#fff' : '#fff',
                      padding: '10px 16px',
                      borderRadius: '14px',
                      display: 'inline-block',
                      fontSize: '15px',
                      maxWidth: '80%',
                      boxShadow:
                        msg.role === 'user'
                          ? '0 2px 8px 0 rgba(18,165,148,0.10)'
                          : '0 2px 8px 0 rgba(31,38,135,0.10)',
                      backdropFilter:
                        msg.role !== 'user' ? 'blur(8px)' : undefined,
                      WebkitBackdropFilter:
                        msg.role !== 'user' ? 'blur(8px)' : undefined,
                      border:
                        msg.role !== 'user'
                          ? '1px solid rgba(255,255,255,0.18)'
                          : undefined,
                      transition: 'background 0.3s',
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <style>{`
        .assistant-chat-scroll::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        .assistant-chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(80,80,80,0.18);
          border-radius: 6px;
        }
        .assistant-chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(80,80,80,0.18) transparent;
        }
        @keyframes pulse {
          0% { opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
export default VapiWidget;
