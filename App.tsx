import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { VotingPage } from './components/VotingPage';
import { ResultsPage } from './components/ResultsPage';
import { Toaster } from './components/ui/sonner';

export interface User {
  id: string;
  type: 'student' | 'teacher' | 'supervisor';
  hasVoted: boolean;
}

export interface Vote {
  userId: string;
  candidateId: string;
  timestamp: Date;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const candidates: Candidate[] = [
    { id: '1', name: 'RAFAEL', position: 'KETUA' },
    { id: '2', name: 'ZAKA', position: 'KETUA' },
    { id: '3', name: 'JULIA', position: 'KETUA' },
    { id: '4', name: 'FADHIL', position: 'KETUA' },
    { id: '5', name: 'RESTU', position: 'KETUA' },
    { id: '6', name: 'GADIS', position: 'KETUA' }
  ];

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleVote = async (candidateId: string) => {
    if (!currentUser || currentUser.hasVoted) return;
    
    setIsLoading(true);
    
    try {
      const newVote: Vote = {
        userId: currentUser.id,
        candidateId,
        timestamp: new Date()
      };
      
      // For now, store locally. Cloud storage will be implemented with Supabase
      setVotes(prev => [...prev, newVote]);
      setCurrentUser(prev => prev ? { ...prev, hasVoted: true } : null);
      
      // Simulate cloud storage delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error saving vote:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (currentUser.type === 'supervisor') {
    return (
      <>
        <ResultsPage 
          votes={votes} 
          candidates={candidates}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <VotingPage
        user={currentUser}
        candidates={candidates}
        onVote={handleVote}
        onLogout={handleLogout}
        isLoading={isLoading}
      />
      <Toaster />
    </>
  );
}