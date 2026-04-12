import { useState, useCallback, useRef } from 'react';
import { Message, ToolStep } from '../types';

const TOOL_LABELS: Record<string, { label: string; desc: string }> = {
  search_places: { label: 'Discovering Places', desc: 'Searching for top attractions, landmarks & hidden gems...' },
  search_restaurants: { label: 'Finding Restaurants', desc: 'Locating the best local food spots & dining options...' },
  search_hotels: { label: 'Analyzing Hotels', desc: 'Scanning hotels, hostels & stays for your budget...' },
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toolSteps, setToolSteps] = useState<ToolStep[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const stepTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Clear any old timers
    stepTimers.current.forEach(t => clearTimeout(t));
    stepTimers.current = [];

    // Animate steps progressively
    setToolSteps([
      { id: '1', name: 'Connecting', description: 'Initializing TravelGuide pipeline...', status: 'active' },
    ]);

    stepTimers.current.push(setTimeout(() => {
      setToolSteps([
        { id: '1', name: 'Connecting', description: 'Pipeline initialized', status: 'done' },
        { id: '2', name: 'Understanding Query', description: 'Extracting destination, budget & preferences...', status: 'active' },
      ]);
    }, 800));

    stepTimers.current.push(setTimeout(() => {
      setToolSteps([
        { id: '1', name: 'Connecting', description: 'Pipeline initialized', status: 'done' },
        { id: '2', name: 'Understanding Query', description: 'Destination & intent extracted', status: 'done' },
        { id: '3', name: 'Discovering Places', description: 'Searching for top attractions & landmarks...', status: 'active' },
      ]);
    }, 2500));

    stepTimers.current.push(setTimeout(() => {
      setToolSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' as const })),
        { id: '4', name: 'Finding Restaurants', description: 'Locating best local food spots...', status: 'active' },
      ]);
    }, 5000));

    stepTimers.current.push(setTimeout(() => {
      setToolSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' as const })),
        { id: '5', name: 'Analyzing Hotels', description: 'Scanning budget-matched accommodations...', status: 'active' },
      ]);
    }, 8000));

    stepTimers.current.push(setTimeout(() => {
      setToolSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' as const })),
        { id: '6', name: 'Building Itinerary', description: 'Crafting your personalized travel plan...', status: 'active' },
      ]);
    }, 12000));

    try {
      const payload: any = { message: content };
      if (threadId) {
        payload.thread_id = threadId;
      }

      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!data.answer) {
        throw new Error("Invalid response");
      }

      setThreadId(data.thread_id);

      // Clear pending timers
      stepTimers.current.forEach(t => clearTimeout(t));

      // Build final step list from actual server response
      const finalSteps: ToolStep[] = [
        { id: '1', name: 'Pipeline Ready', description: 'Connected to MCP servers', status: 'done' },
        { id: '2', name: 'Query Analyzed', description: 'Destination & preferences extracted', status: 'done' },
      ];

      data.tool_calls.forEach((t: any, idx: number) => {
        const info = TOOL_LABELS[t.tool] || { label: t.tool, desc: `Called ${t.tool}` };
        finalSteps.push({
          id: `tool-${idx}`,
          name: info.label,
          description: `${info.desc.replace('...', '')} ✓`,
          status: 'done',
        });
      });

      finalSteps.push({
        id: 'final',
        name: 'Plan Complete',
        description: 'Your travel plan is ready!',
        status: 'done',
      });

      setToolSteps(finalSteps);

      const aiMsg: Message = {
        id: data.thread_id + Date.now(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      stepTimers.current.forEach(t => clearTimeout(t));
      setToolSteps([
        { id: 'error', name: 'Error', description: 'Could not reach the backend.', status: 'done' },
      ]);
      const errMsg: Message = {
        id: 'error' + Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I hit an error while planning your trip. The backend might not be reachable at http://localhost:8000.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [threadId]);

  return {
    messages,
    sendMessage,
    isLoading,
    toolSteps,
    setMessages
  };
}
