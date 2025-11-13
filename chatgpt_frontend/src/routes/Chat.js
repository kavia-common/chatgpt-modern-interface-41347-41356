import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Chat.css';
import '../App.css';
import { apiPost } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Chat route: a simple chat interface with alternating user/AI bubbles, auto-scroll,
 * and an input bar fixed to the bottom of the chat container.
 */
function Chat() {
  const [messages, setMessages] = useState([
    { id: 'm1', role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const endRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  async function sendMessage() {
    if (!canSend) return;
    const userText = input.trim();
    setInput('');
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    // Call backend chat endpoint (placeholder path: /chat)
    const { data, error } = await apiPost('/chat', {
      messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
    });

    if (error) {
      // In case of error, display a friendly assistant response
      const errMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I could not reach the server. Please check your configuration and try again.',
        error: true
      };
      setMessages(prev => [...prev, errMsg]);
      setSending(false);
      return;
    }

    // Data is expected to be { reply: string } or OpenAI-like choices; handle generically
    let replyText = '';
    if (data && typeof data === 'object') {
      if (typeof data.reply === 'string') replyText = data.reply;
      else if (Array.isArray(data.choices) && data.choices[0]?.message?.content) {
        replyText = data.choices[0].message.content;
      } else if (typeof data.content === 'string') {
        replyText = data.content;
      }
    }
    if (!replyText) replyText = 'Thanks for your message! (This is a placeholder response.)';

    const aiMsg = { id: `a-${Date.now()}`, role: 'assistant', content: replyText };
    setMessages(prev => [...prev, aiMsg]);
    setSending(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <section className="chat-page" aria-label="Chat interface">
      <div className="chat-container">
        <div className="chat-header">
          <h1 className="chat-title">Chat</h1>
          <p className="chat-subtitle">Talk with your AI assistant</p>
        </div>

        <div className="chat-messages" ref={listRef} role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((m) => (
            <div key={m.id} className={`msg-row ${m.role === 'user' ? 'from-user' : 'from-ai'}`}>
              <div className="avatar" aria-hidden="true">
                {m.role === 'user' ? '🧑' : '🤖'}
              </div>
              <div className={`bubble ${m.role}`}>
                <pre className="bubble-text">{m.content}</pre>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="chat-inputbar" role="group" aria-label="Message composer">
          <textarea
            className="chat-input"
            placeholder={sending ? 'Sending...' : 'Type a message and press Enter'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Message input"
            disabled={sending}
          />
          <button
            className="chat-send"
            onClick={sendMessage}
            disabled={!canSend}
            aria-label="Send message"
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </section>
  );
}

export default Chat;
