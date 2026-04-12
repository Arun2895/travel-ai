import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import WelcomeState from './components/WelcomeState';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import AgentPanel from './components/AgentPanel';
import LoadingDots from './components/LoadingDots';
import { useChat } from './hooks/useChat';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  
  const { messages, sendMessage, isLoading, toolSteps, setMessages } = useChat();

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    setIsAuthenticated(true);
  };

  const handleGuest = () => {
    setUser({ name: 'Guest Traveller', email: 'guest@travelguide.com' });
    setIsAuthenticated(true);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ name: '', email: '' });
    setMessages([]);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onGuest={handleGuest} />;
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F5F0EB] overflow-hidden font-sans relative">
      {/* Grid background — moved outside chat */}
      <div
        className="absolute inset-0 opacity-100 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Subtle background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(244,96,12,0.06)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(244,96,12,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

      <Sidebar onNewChat={handleNewChat} onLogout={handleLogout} userName={user.name} userEmail={user.email} />
      
      <main className="flex-1 flex flex-col relative w-full h-full max-w-[900px] mx-auto border-x border-[rgba(255,255,255,0.07)] overflow-hidden bg-[#0A0A0A] z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className={`flex-1 ${messages.length === 0 ? 'overflow-hidden' : 'overflow-y-auto'} custom-scrollbar flex flex-col pb-4 relative z-10`}>
          {messages.length === 0 ? (
            <WelcomeState userName={user.name} onSuggestion={sendMessage} />
          ) : (
            <div className="flex-1 w-full max-w-[760px] mx-auto pt-6 pb-20">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <LoadingDots />}
            </div>
          )}
        </div>
        
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </main>

      <AgentPanel steps={toolSteps} />
    </div>
  );
}

export default App;
