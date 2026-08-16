import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AIMentor() {
  // API Key state (saved in localStorage so you only enter it once)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cyber_mentor_api_key') || '');
  const [showSettings, setShowSettings] = useState(!apiKey);
  
  // Selected model (default to OpenRouter models)
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-chat');

  // Chat messages state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello Vasu! I am your Cyber AI Mentor. Ask me anything about penetration testing, networking, Linux commands, or your career roadmap!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // ==========================================
  // LOAD CHAT HISTORY FROM DATABASE
  // ==========================================

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) return;

      const { data, error } = await supabase
        .from('mentor_messages')
        .select('role, content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveMessagesToDb = async (messagesToSave) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('mentor_messages')
        .insert(
          messagesToSave.map((m) => ({
            user_id: user.id,
            role: m.role,
            content: m.content,
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('cyber_mentor_api_key', apiKey);
    setShowSettings(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Cyber Tracker AI Mentor'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: 'You are an expert cybersecurity mentor and coach. Help Vasu (a cyber student targeting top product companies with 12+ LPA by 2030 ) with practical, accurate, and encouraging cybersecurity knowledge, lab explanations, and career advice.'
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }

      const aiReply = data.choices[0]?.message?.content || 'No response received.';
      const finalMessages = [...newMessages, { role: 'assistant', content: aiReply }];
      setMessages(finalMessages);
      saveMessagesToDb([
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiReply }
      ]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ Error: ${error.message}. Please check your Router API key.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto text-white h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
            Cyber AI Mentor
          </h1>
          <p className="text-gray-400 text-sm">Your personal cybersecurity guide powered by your Router API.</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-rose-950/60 border border-pink-500/30 hover:border-pink-300 text-pink-300 px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          ⚙️ {showSettings ? 'Close Settings' : 'API Settings'}
        </button>
      </div>

      {/* Settings Modal / Banner */}
      {showSettings && (
        <form onSubmit={handleSaveKey} className="glass-card p-5 rounded-2xl mb-6">
          <h3 className="text-lg font-semibold mb-3 text-pink-300">Router API Configuration</h3>
          <p className="text-xs text-gray-300 mb-3">
            Enter your OpenRouter (or OpenAI-compatible router) API key. It is saved securely in your browser's local storage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="flex-1 bg-black/50 border border-pink-400/30 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300 text-sm"
              required
            />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-black/50 border border-pink-400/30 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-pink-300"
            >
              <option value="deepseek/deepseek-chat">DeepSeek V3</option>
              <option value="deepseek/deepseek-r1">DeepSeek R1 (Reasoning)</option>
              <option value="google/gemini-flash-1.5">Gemini 1.5 Flash</option>
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
            </select>
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-medium px-5 py-2 rounded-xl text-sm transition-all shadow-lg cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </form>
      )}

      {/* Chat Container */}
     <div className="flex-1 glass-card rounded-2xl p-4 md:p-6 flex flex-col justify-between overflow-hidden">
        {/* Messages List */}
        <div className="overflow-y-auto space-y-4 pr-2 flex-1 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                    : 'bg-black/40 border border-pink-500/20 text-gray-200 shadow-inner'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-black/40 border border-pink-500/20 rounded-2xl px-4 py-3 text-sm text-pink-300 animate-pulse">
                AI Mentor is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-3 pt-3 border-t border-pink-500/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI mentor anything about cybersecurity..."
            className="flex-1 bg-black/40 border border-pink-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg text-sm disabled:opacity-50 cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

