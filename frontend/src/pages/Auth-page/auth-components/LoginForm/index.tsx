import { Eye, EyeOff, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import type { IHandleLogin } from '../Auth-Types';

type LoginFormProps = {
    formData: { email: string; password: string };
    showPassword: boolean;
    togglePassword: () => void;
    onChange: (field: string, value: string) => void;
    isLoginAuthPending: boolean;
    handleLogin: (formData: IHandleLogin) => void;
};

export const LoginForm = ({
    formData,
    showPassword,
    togglePassword,
    onChange,
    handleLogin,
    isLoginAuthPending,
}: LoginFormProps) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={spring}
        className="mt-6"
    >
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin({
                    email: formData.email,
                    password: formData.password,
                });
            }}
        >
            <div className="space-y-1.5">
                <label
                    htmlFor="login-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                >
                    Email
                </label>
                <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-sm border-2 border-ink bg-paper px-3 py-3 text-sm text-ink transition-colors duration-fast placeholder:text-ink-faint focus:bg-surface"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="login-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                >
                    Password
                </label>
                <div className="relative">
                    <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Your password"
                        autoComplete="current-password"
                        className="w-full rounded-sm border-2 border-ink bg-paper py-3 pl-3 pr-11 text-sm text-ink transition-colors duration-fast placeholder:text-ink-faint focus:bg-surface"
                        value={formData.password}
                        onChange={(e) => onChange('password', e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={togglePassword}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors duration-fast hover:text-ink"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <button
                disabled={isLoginAuthPending}
                type="submit"
                aria-busy={isLoginAuthPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-ink px-4 text-sm font-bold text-paper shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs disabled:pointer-events-none disabled:opacity-50"
            >
                {isLoginAuthPending ? (
                    <>
                        <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
    </motion.div>
);