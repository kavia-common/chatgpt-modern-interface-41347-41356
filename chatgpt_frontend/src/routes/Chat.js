import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Chat.css';
import '../App.css';
import { apiPost } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Chat route: a simple chat interface with alternating user/AI bubbles, auto-scroll,
 * sticky composer, keyboard a11y (Enter to send, Shift+Enter new line), and optional
 * sessionStorage message persistence.
 */
function Chat() {
  // Initialize from sessionStorage if present
  const initialMessages = (() => {
    try {
      const raw = sessionStorage.getItem('chat_messages_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [{ id: 'm1', role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }];
  })();

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const composerRegionRef = useRef(null);

  // Persist messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('chat_messages_v1', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // Keep scroll pinned to bottom when resizing (mobile keyboards, etc.)
  useEffect(() => {
    const handler = () => {
      if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  // PUBLIC_INTERFACE
  /**
   * Send the current input text. Focus management:
   * - On success: focus input for continued typing
   * - On error: announce error and move focus to the composer region for screen readers
   */
  async function sendMessage() {
    if (!canSend) return;
    const userText = input.trim();
    setInput('');
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    const { data, error } = await apiPost('/chat', {
      messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
    });

    if (error) {
      const errMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I could not reach the server. Please check your configuration and try again.',
        error: true
      };
      setMessages(prev => [...prev, errMsg]);
      setSending(false);

      // Move focus to composer region and announce error for a11y
      if (composerRegionRef.current) {
        composerRegionRef.current.focus();
      }
      return;
    }

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

    // Return focus to input for continuous chatting
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleKeyDown(e) {
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <section className="chat-page" aria-label="Chat interface">
      <div className="chat-container" role="application" aria-roledescription="chat">
        <div className="chat-header">
          <h1 className="chat-title">Chat</h1>
          <p className="chat-subtitle">Talk with your AI assistant</p>
        </div>

        <div
          className="chat-messages"
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Conversation messages"
        >
          {messages.map((m) => (
            <div key={m.id} className={`msg-row ${m.role === 'user' ? 'from-user' : 'from-ai'}`}>
              <div className="avatar" aria-hidden="true">
                {m.role === 'user' ? '🧑' : '🤖'}
              </div>
              <div className={`bubble ${m.role}`} aria-label={m.role === 'user' ? 'User message' : 'Assistant message'}>
                <pre className="bubble-text">{m.content}</pre>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div
          className="chat-inputbar"
          role="group"
          aria-label="Message composer"
          aria-live="assertive"
          tabIndex={-1}
          ref={composerRegionRef}
        >
          <label htmlFor="chat-input" className="visually-hidden">Type your message</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            className="chat-input"
            placeholder={sending ? 'Sending...' : 'Type a message. Press Enter to send, Shift+Enter for a new line.'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Message input. Press Enter to send. Shift plus Enter adds a new line."
            disabled={sending}
          />
          <button
            className="chat-send"
            onClick={sendMessage}
            disabled={!canSend}
            aria-label="Send message"
            title="Send (Enter)"
          >
            ➤
          </button>
        </div>
      </div>
    </section>
  );
}

export default Chat;
