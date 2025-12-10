import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type LoginFormProps = {
    formData: { email: string; password: string };
    showPassword: boolean;
    togglePassword: () => void;
    onChange: (field: string, value: string) => void;
};

export const LoginForm = ({ formData, showPassword, togglePassword, onChange }: LoginFormProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-4 mt-6"
    >
        <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 rounded-xl h-12"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 rounded-xl h-12"
                    value={formData.password}
                    onChange={(e) => onChange('password', e.target.value)}
                />
                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>

        <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
            Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
    </motion.div>
);