import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Vote, Shield, GraduationCap, Users, Lock, UserCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [userType, setUserType] = useState<'student' | 'teacher' | 'supervisor'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateCredentials = (type: string, user: string, pass: string): boolean => {
    switch (type) {
      case 'student':
        // Format: 7A01 to 9G32 (class-based format)
        const studentMatch = user.match(/^([7-9])([A-G])(\d{2})$/);
        if (studentMatch) {
          const grade = parseInt(studentMatch[1]); // 7, 8, or 9
          const classLetter = studentMatch[2]; // A-G
          const studentNum = parseInt(studentMatch[3]); // 01-34
          
          // Validate grade (7-9)
          if (grade < 7 || grade > 9) return false;
          
          // Validate class letter (A-G)
          if (classLetter < 'A' || classLetter > 'G') return false;
          
          // Validate student number (01-34, but most classes go up to 32)
          if (studentNum < 1 || studentNum > 34) return false;
          
          return pass === '24';
        }
        return false;
      
      case 'teacher':
        const teacherMatch = user.match(/^GURU(\d+)$/);
        if (teacherMatch) {
          const num = parseInt(teacherMatch[1]);
          return num >= 1 && num <= 75 && pass === '24';
        }
        return false;
      
      case 'supervisor':
        return user === 'PENGAWAS' && pass === 'OSISSPENDAG';
      
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Username dan password harus diisi');
      setIsLoading(false);
      return;
    }

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (validateCredentials(userType, username, password)) {
      const user: User = {
        id: username,
        type: userType,
        hasVoted: false
      };
      toast.success(`Selamat datang, ${getUserTypeLabel(userType)}!`);
      onLogin(user);
    } else {
      setError('Username atau password salah');
      toast.error('Login gagal. Periksa kembali kredensial Anda.');
    }
    setIsLoading(false);
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'student': return 'Siswa';
      case 'teacher': return 'Guru';
      case 'supervisor': return 'Pengawas';
      default: return '';
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'student': return <GraduationCap className="w-4 h-4" />;
      case 'teacher': return <Users className="w-4 h-4" />;
      case 'supervisor': return <Shield className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCredentialHint = (type: string) => {
    switch (type) {
      case 'student':
        return 'Username: 7A01-7A34, 8A01-8G32, 9A01-9G32, Password: 24';
      case 'teacher':
        return 'Username: GURU01-GURU75, Password: 24';
      case 'supervisor':
        return 'Silakan hubungi administrator untuk kredensial login';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl mb-6 border border-white/20"
            >
              <Vote className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">E-VOTING KETUA OSIS</h1>
            <p className="text-blue-100 text-sm sm:text-base">Periode 2025-2026</p>
            <Badge variant="secondary" className="mt-3 bg-white/10 text-white border-white/20">
              Pemilihan Ketua OSIS
            </Badge>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Login Sistem</CardTitle>
                <CardDescription className="text-blue-100">
                  Silakan pilih jenis pengguna dan masukan kredensial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="userType" className="text-white">Jenis Pengguna</Label>
                    <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Pilih jenis pengguna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Siswa
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Guru
                          </div>
                        </SelectItem>
                        <SelectItem value="supervisor">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Pengawas
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toUpperCase())}
                      placeholder={
                        userType === 'student' ? "Contoh: 7A01, 8B15, 9G32" : 
                        userType === 'supervisor' ? "Username pengawas" : 
                        "Masukan username"
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        userType === 'supervisor' ? "Password pengawas" : "Masukan password"
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>

                  {/* Credential Hint */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/10 p-4 rounded-lg border border-white/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getUserTypeIcon(userType)}
                      <span className="text-white font-medium">{getUserTypeLabel(userType)}</span>
                    </div>
                    <p className="text-sm text-blue-100">
                      {getCredentialHint(userType)}
                    </p>
                    {userType === 'student' && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-blue-200 mb-2">Contoh format username siswa:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          <span className="bg-white/10 px-2 py-1 rounded text-white">7A01</span>
                          <span className="bg-white/10 px-2 py-1 rounded text-white">8B15</span>
                          <span className="bg-white/10 px-2 py-1 rounded text-white">9G32</span>
                        </div>
                      </div>
                    )}
                    {userType === 'supervisor' && (
                      <div className="mt-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-4 h-4 text-orange-300" />
                          <p className="text-xs text-orange-200 font-semibold">Akses Terbatas</p>
                        </div>
                        <p className="text-xs text-orange-300">
                          Kredensial pengawas bersifat rahasia dan hanya diberikan kepada petugas yang berwenang.
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Error Alert */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert className="border-red-400/50 bg-red-500/10 backdrop-blur-sm">
                        <AlertDescription className="text-red-200">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 h-12"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Memproses...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Masuk
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-blue-200 text-sm">
              Sistem E-Voting resmi OSIS untuk pemilihan ketua periode 2025-2026
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}