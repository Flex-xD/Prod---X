import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

type RegisterFormProps = {
    formData: { email: string; username: string; password: string; confirmPassword: string };
    showPassword: boolean;
    togglePassword: () => void;
    onChange: (field: string, value: string) => void;
};

export const RegisterForm = ({ formData, showPassword, togglePassword, onChange }: RegisterFormProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-4 mt-6"
    >
        {/* Email */}
        <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 rounded-xl h-12"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
            <Label htmlFor="register-username">Username</Label>
            <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                    id="register-username"
                    type="text"
                    placeholder="Choose a username"
                    className="pl-10 rounded-xl h-12"
                    value={formData.username}
                    onChange={(e) => onChange('username', e.target.value)}
                />
            </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 rounded-xl h-12"
                    value={formData.password}
                    onChange={(e) => onChange('password', e.target.value)}
                />
                <button type="button" onClick={togglePassword} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="rounded-xl h-12"
                value={formData.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
            />
        </div>

        <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
            Start Your Journey
            <Sparkles className="w-4 h-4 ml-2" />
        </Button>
    </motion.div>
);