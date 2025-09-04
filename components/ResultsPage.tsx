import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';
import { LogOut, Users, Trophy, BarChart3, TrendingUp, PieChart as PieChartIcon, Download, RefreshCw, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Vote, Candidate } from '../App';

interface ResultsPageProps {
  votes: Vote[];
  candidates: Candidate[];
  onLogout: () => void;
}

export function ResultsPage({ votes, candidates, onLogout }: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const results = useMemo(() => {
    const candidateVotes: { [key: string]: number } = {};
    candidates.forEach(candidate => {
      candidateVotes[candidate.id] = 0;
    });
    
    votes.forEach(vote => {
      candidateVotes[vote.candidateId]++;
    });

    return candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      votes: candidateVotes[candidate.id],
      percentage: votes.length > 0 ? (candidateVotes[candidate.id] / votes.length * 100) : 0
    })).sort((a, b) => b.votes - a.votes);
  }, [votes, candidates]);

  const winner = results.length > 0 ? results[0] : null;
  const totalVotes = votes.length;

  const chartData = results.map(result => ({
    name: result.name,
    votes: result.votes,
    percentage: result.percentage
  }));

  const pieData = results.map((result, index) => ({
    name: result.name,
    value: result.votes,
    percentage: result.percentage,
    color: getPieColor(index)
  }));

  const votesByUserType = useMemo(() => {
    const typeCount = { student: 0, teacher: 0, supervisor: 0 };
    votes.forEach(vote => {
      // Check for new class-based student format (7A01-9G32)
      if (vote.userId.match(/^[7-9][A-G]\d{2}$/)) {
        typeCount.student++;
      } else if (vote.userId.startsWith('GURU')) {
        typeCount.teacher++;
      } else if (vote.userId === 'PENGAWAS') {
        typeCount.supervisor++;
      }
    });
    return typeCount;
  }, [votes]);

  const timeSeriesData = useMemo(() => {
    const hourlyVotes: { [key: string]: number } = {};
    votes.forEach(vote => {
      const hour = new Date(vote.timestamp).getHours();
      const key = `${hour}:00`;
      hourlyVotes[key] = (hourlyVotes[key] || 0) + 1;
    });
    
    return Object.entries(hourlyVotes).map(([time, count]) => ({
      time,
      votes: count
    }));
  }, [votes]);

  function getPieColor(index: number) {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  }

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

  const handleRefresh = () => {
    toast.success('Data berhasil diperbarui');
  };

  const handleExport = () => {
    toast.success('Data berhasil diekspor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Pengawas</h1>
                <p className="text-gray-600 text-sm sm:text-base">E-VOTING KETUA OSIS 2025-2026 - Monitoring Real-time</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleRefresh} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
              <div className="flex justify-between items-center w-full sm:w-auto gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Pengawas
                </Badge>
                <Button onClick={onLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-1" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Suara</p>
                  <p className="text-3xl font-bold">{totalVotes}</p>
                  <p className="text-blue-200 text-xs mt-1">Suara masuk</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Suara Siswa</p>
                  <p className="text-3xl font-bold">{votesByUserType.student}</p>
                  <p className="text-green-200 text-xs mt-1">Partisipasi siswa</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Suara Guru</p>
                  <p className="text-3xl font-bold">{votesByUserType.teacher}</p>
                  <p className="text-purple-200 text-xs mt-1">Partisipasi guru</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Total Kandidat</p>
                  <p className="text-3xl font-bold">{candidates.length}</p>
                  <p className="text-yellow-200 text-xs mt-1">Calon ketua</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Grafik
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Tren
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Results Table */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Hasil Perolehan Suara
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              {index === 0 && totalVotes > 0 && (
                                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Trophy className="w-3 h-3 text-yellow-800" />
                                </div>
                              )}
                              <div className={`w-10 h-10 bg-gradient-to-br ${getCandidateColor(index)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                {result.name.charAt(0)}
                              </div>
                              <div>
                                <span className={`font-semibold ${index === 0 && totalVotes > 0 ? "text-yellow-700" : "text-gray-800"}`}>
                                  {result.name}
                                </span>
                                <p className="text-xs text-gray-500">Calon {result.id}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold text-gray-800">{result.votes}</span>
                              <span className="text-sm text-gray-600 ml-1">
                                ({result.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <Progress value={result.percentage} className="h-3" />
                        </motion.div>
                      ))}
                      {totalVotes === 0 && (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">Belum ada suara yang masuk</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Grafik Batang Perolehan Suara
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {totalVotes > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            fontSize={12}
                          />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            formatter={(value) => [`${value} suara`, 'Jumlah']}
                            labelStyle={{ color: '#1f2937' }}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar 
                            dataKey="votes" 
                            fill="url(#gradient)"
                            radius={[4, 4, 0, 0]}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">Belum ada data untuk ditampilkan</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      Distribusi Suara
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {totalVotes > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} suara`, 'Jumlah']} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <PieChartIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">Belum ada data untuk ditampilkan</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Voter Demographics */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Demografi Pemilih
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-800">Siswa</p>
                            <p className="text-sm text-blue-600">Partisipasi siswa</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-800">{votesByUserType.student}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-purple-800">Guru</p>
                            <p className="text-sm text-purple-600">Partisipasi guru</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-purple-800">{votesByUserType.teacher}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tren Voting per Jam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timeSeriesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="time" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip 
                          formatter={(value) => [`${value} suara`, 'Jumlah']}
                          labelStyle={{ color: '#1f2937' }}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="votes" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Belum ada data tren untuk ditampilkan</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Winner Announcement */}
        {winner && totalVotes > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white border-0 mt-8">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Trophy className="w-16 h-16" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      🎉 Kandidat dengan Perolehan Suara Tertinggi 🎉
                    </h3>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCandidateColor(parseInt(winner.id) - 1)} rounded-full flex items-center justify-center text-white font-bold border-2 border-white`}>
                        {winner.name.charAt(0)}
                      </div>
                      <p className="text-3xl font-bold">{winner.name}</p>
                    </div>
                    <p className="text-xl opacity-90">
                      {winner.votes} suara ({winner.percentage.toFixed(1)}%) • Calon {winner.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}