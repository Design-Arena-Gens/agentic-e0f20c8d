'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Send welcome message on load
    setMessages([
      {
        role: 'assistant',
        content: 'Namaste 😊 Weight kam karne ke liye help chahiye? Main aapko simple diet guide kar sakta hoon.'
      }
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, kuch technical problem aa gayi. Kripya dubara try karein.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-header">
          <h1>🥗 Diet Coach AI</h1>
          <p>आपका Personal Nutrition Guide</p>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-screen">
              <h2>स्वागत है! 🙏</h2>
              <p>Main aapki weight loss journey mein madad karunga</p>
              <div className="features">
                <div className="feature-card">
                  <h3>🏠 Ghar ka Khana</h3>
                  <p>Simple Indian recipes</p>
                </div>
                <div className="feature-card">
                  <h3>💪 Bina Gym</h3>
                  <p>Gym jaane ki zarurat nahi</p>
                </div>
                <div className="feature-card">
                  <h3>💰 Affordable</h3>
                  <p>Mehnga supplement nahi</p>
                </div>
                <div className="feature-card">
                  <h3>📱 Easy to Follow</h3>
                  <p>Beginners ke liye perfect</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna message yahan likhein..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
