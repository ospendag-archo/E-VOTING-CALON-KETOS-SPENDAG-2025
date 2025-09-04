import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, User, LogOut, Vote, Crown, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User as UserType, Candidate } from '../App';

interface VotingPageProps {
  user: UserType;
  candidates: Candidate[];
  onVote: (candidateId: string) => Promise<void>;
  onLogout: () => void;
  isLoading?: boolean;
}

export function VotingPage({ user, candidates, onVote, onLogout, isLoading = false }: VotingPageProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (selectedCandidate && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onVote(selectedCandidate);
        setIsConfirmOpen(false);
        toast.success('Suara Anda berhasil tercatat dan disinkronisasi ke cloud!');
      } catch (error) {
        toast.error('Gagal menyimpan suara. Silakan coba lagi.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'student': return 'Siswa';
      case 'teacher': return 'Guru';
      default: return '';
    }
  };

  const getCandidateColor = (index: number) => {
    const colors = [
      'from-red-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-violet-500',
      'from-orange-500 to-yellow-500',
      'from-indigo-500 to-blue-500'
    ];
    return colors[index % colors.length];
  };

  if (user.hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-yellow-800" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Terima Kasih!</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Suara Anda telah berhasil tercatat dalam sistem e-voting OSIS periode 2025-2026. 
                  Partisipasi Anda sangat berarti untuk masa depan OSIS yang lebih baik.
                </p>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                  <p className="text-green-800 text-sm">
                    ✓ Suara tercatat secara aman dan terenkripsi
                  </p>
                </div>

                <Button onClick={onLogout} variant="outline" className="w-full h-12">
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar dari Sistem
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">E-VOTING KETUA OSIS 2025-2026</h1>
                <p className="text-gray-600 text-sm sm:text-base">Pemilihan Ketua OSIS</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-left sm:text-right">
                <Badge variant="secondary" className="mb-1">
                  <User className="w-3 h-3 mr-1" />
                  {getUserTypeLabel(user.type)}
                </Badge>
                <p className="text-sm text-gray-600">{user.id}</p>
              </div>
              <Button onClick={onLogout} variant="outline" size="sm" className="w-full sm:w-auto">
                <LogOut className="w-4 h-4 mr-1" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
            <Vote className="w-4 h-4" />
            <AlertDescription className="text-blue-800">
              <strong>Petunjuk Voting:</strong> Pilih salah satu kandidat di bawah ini dengan mengklik kartu kandidat. 
              Anda hanya dapat memilih satu kali dan tidak dapat mengubah pilihan setelah konfirmasi.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
                  selectedCandidate === candidate.id 
                    ? 'ring-4 ring-blue-500 shadow-xl scale-105' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCandidateColor(index)} opacity-5`} />
                
                {/* Selection Indicator */}
                <AnimatePresence>
                  {selectedCandidate === candidate.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <CardHeader className="text-center pb-4">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className={`w-24 h-24 bg-gradient-to-br ${getCandidateColor(index)} rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white px-3 py-1 rounded-full shadow-md border">
                        <span className="text-xs font-medium text-gray-600">Calon {candidate.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-600">{candidate.position}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{candidate.name}</h3>
                  </div>
                </CardHeader>

                <CardContent className="text-center pt-0">
                  <div className="space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    
                    <div className={`w-4 h-4 rounded-full border-2 mx-auto transition-all ${
                      selectedCandidate === candidate.id 
                        ? 'bg-blue-500 border-blue-500 scale-125' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`} />
                    
                    <p className="text-sm text-gray-500">
                      Klik untuk memilih kandidat ini
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Vote Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={!selectedCandidate}
                size="lg"
                className="px-12 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500"
              >
                {selectedCandidate ? (
                  <div className="flex items-center gap-2">
                    <Vote className="w-5 h-5" />
                    Konfirmasi Pilihan
                  </div>
                ) : (
                  'Pilih Kandidat Terlebih Dahulu'
                )}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Vote className="w-5 h-5" />
                  Konfirmasi Pilihan Anda
                </DialogTitle>
                <DialogDescription>
                  Pastikan pilihan Anda sudah benar. Setelah dikonfirmasi, Anda tidak dapat mengubah pilihan.
                </DialogDescription>
              </DialogHeader>
              
              {selectedCandidate && (
                <div className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getCandidateColor(parseInt(selectedCandidate) - 1)} rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold`}>
                      {candidates.find(c => c.id === selectedCandidate)?.name.charAt(0)}
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      {candidates.find(c => c.id === selectedCandidate)?.name}
                    </h4>
                    <p className="text-sm text-gray-600">Calon {selectedCandidate}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                  Batal
                </Button>
                <Button 
                  onClick={handleVote} 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Menyimpan...
                    </div>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Ya, Konfirmasi
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {selectedCandidate && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 mt-4"
            >
              Anda akan memilih: <strong>{candidates.find(c => c.id === selectedCandidate)?.name}</strong>
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}