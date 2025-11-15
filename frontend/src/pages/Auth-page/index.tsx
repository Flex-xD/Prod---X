'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Zap,
    Brain,
    Target,
    Clock,
    Trophy,
    Users,
    Sparkles,
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,

    Flame
} from 'lucide-react';

const ProdXAuth = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    // Mock data for the gamified elements
    const motivationalQuotes = [
        "Every focused hour brings you closer to your goals 🎯",
        "Great things are done by a series of small things brought together 🏆",
        "Productivity is never an accident. It's the result of commitment to excellence 🚀",
        "The secret of getting ahead is getting started ⚡",
        "Don't count the days, make the days count 💪"
    ];

    const features = [
        { icon: Target, text: "Set daily focus goals" },
        { icon: Clock, text: "Track deep work hours" },
        { icon: Trophy, text: "Compete with friends" },
        { icon: Users, text: "Join focus challenges" },
        { icon: Brain, text: "AI productivity tips" },
        { icon: Sparkles, text: "Build winning streaks" }
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGoogleAuth = () => {
        // Google OAuth integration would go here
        console.log('Google OAuth triggered');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-blue-50/30 relative overflow-hidden">
            {/* Animated background elements */}
            {/* <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div> */}

            <div className="relative z-10 max-w-7xl mx-auto   px-6 py-8 border-4 border-blue-600">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeIn"
                    }}

                    className="flex items-center justify-between mb-4"
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-12 h-12 bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                        >
                            <Zap className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-3xl font-bold">
                                ProdX
                            </span>
                            <p className="text-xs text-slate-500">Level up your productivity</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="hidden md:flex items-center gap-4"
                    >
                        <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
                            <Flame className="w-3 h-3 mr-1 text-orange-500" />
                            Join 10k+ focused users
                        </Badge>
                    </motion.div>
                </motion.header>

                <div className="grid grid-cols-1 lg:mr-16  lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                    {/* Left Column - Auth Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
                            <CardHeader className="text-center pb-8">
                                <CardTitle className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {activeTab === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                                </CardTitle>
                                <p className="text-slate-600 mt-2">
                                    {activeTab === 'login'
                                        ? 'Ready to crush your focus goals?'
                                        : 'Join the productivity revolution'
                                    }
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100/50 p-1">
                                        <TabsTrigger
                                            value="login"
                                            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                        >
                                            Sign In
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="register"
                                            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                        >
                                            Register
                                        </TabsTrigger>
                                    </TabsList>

                                    <AnimatePresence mode="wait">
                                        <TabsContent value="login" className="space-y-4 mt-6">
                                            <motion.div
                                                key="login-form"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="login-email" className="text-slate-700">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="login-email"
                                                            type="email"
                                                            placeholder="your.email@example.com"
                                                            className="pl-10 rounded-xl h-12 border-slate-200"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="login-password" className="text-slate-700">Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="login-password"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Enter your password"
                                                            className="pl-10 pr-10 rounded-xl h-12 border-slate-200"
                                                            value={formData.password}
                                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                                        >
                                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <Button className="w-full rounded-xl h-12 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                                                    Sign In
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </motion.div>
                                        </TabsContent>

                                        <TabsContent value="register" className="space-y-4 mt-6">
                                            <motion.div
                                                key="register-form"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="register-email" className="text-slate-700">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="register-email"
                                                            type="email"
                                                            placeholder="your.email@example.com"
                                                            className="pl-10 rounded-xl h-12 border-slate-200"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="register-username" className="text-slate-700">Username</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="register-username"
                                                            type="text"
                                                            placeholder="Choose a username"
                                                            className="pl-10 rounded-xl h-12 border-slate-200"
                                                            value={formData.username}
                                                            onChange={(e) => handleInputChange('username', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="register-password" className="text-slate-700">Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="register-password"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Create a strong password"
                                                            className="pl-10 pr-10 rounded-xl h-12 border-slate-200"
                                                            value={formData.password}
                                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                                        >
                                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-password" className="text-slate-700">Confirm Password</Label>
                                                    <Input
                                                        id="confirm-password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Confirm your password"
                                                        className="rounded-xl h-12 border-slate-200"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                    />
                                                </div>

                                                <Button className="w-full rounded-xl h-12 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                                                    Start Your Journey
                                                    <Sparkles className="w-4 h-4 ml-2" />
                                                </Button>
                                            </motion.div>
                                        </TabsContent>
                                    </AnimatePresence>
                                </Tabs>

                                <div className="relative">
                                    <Separator className="my-6" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-white/80 backdrop-blur-sm px-3 text-sm text-slate-500">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl h-12 border-slate-200 hover:bg-slate-50 font-medium"
                                    onClick={handleGoogleAuth}
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column - Gamified Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="hidden lg:block space-y-8"
                    >
                        {/* Motivational Quote */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-linear-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Today's Focus Wisdom</h3>
                                    <p className="text-purple-100 leading-relaxed">
                                        {motivationalQuotes[0]}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                                            <feature.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-800">{feature.text}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm"
                        >
                            <h4 className="font-bold text-slate-800 mb-4">Join Our Community</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-purple-600">10K+</div>
                                    <div className="text-xs text-slate-600">Focused Users</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">250K+</div>
                                    <div className="text-xs text-slate-600">Hours Tracked</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">95%</div>
                                    <div className="text-xs text-slate-600">Goal Success</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Achievement Preview */}

                    </motion.div>
                </div>

                {/* Mobile Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="lg:hidden mt-12 space-y-6"
                >
                    <h3 className="text-center text-xl font-bold text-slate-800">Why Join ProdX?</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {features.slice(0, 4).map((feature, index) => (
                            <div
                                key={feature.text}
                                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 text-center"
                            >
                                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <feature.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-medium text-slate-800">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProdXAuth;