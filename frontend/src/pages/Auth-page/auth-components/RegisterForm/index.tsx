import { Eye, EyeOff, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import type { IHandleRegiser } from '../Auth-Types';

type RegisterFormProps = {
    formData: { email: string; username: string; password: string; confirmPassword: string };
    showPassword: boolean;
    togglePassword: () => void;
    onChange: (field: string, value: string) => void;
    handleRegister: (FormData: IHandleRegiser) => void;
    isRegisterAuthPending: boolean;
};

export const RegisterForm = ({
    formData,
    showPassword,
    togglePassword,
    onChange,
    handleRegister,
    isRegisterAuthPending,
}: RegisterFormProps) => (
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
                // ? You should remove confirmPassword and add check statements for the credentials weather they are properly filled or not
                handleRegister(formData);
            }}
        >
            {/* Email */}
            <div className="space-y-1.5">
                <label
                    htmlFor="register-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                >
                    Email
                </label>
                <input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-sm border-2 border-ink bg-paper px-3 py-3 text-sm text-ink transition-colors duration-fast placeholder:text-ink-faint focus:bg-surface"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
                <label
                    htmlFor="register-username"
                    className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                >
                    Username
                </label>
                <input
                    id="register-username"
                    type="text"
                    placeholder="Pick a username"
                    autoComplete="username"
                    className="w-full rounded-sm border-2 border-ink bg-paper px-3 py-3 text-sm text-ink transition-colors duration-fast placeholder:text-ink-faint focus:bg-surface"
                    value={formData.username}
                    onChange={(e) => onChange('username', e.target.value)}
                />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <label
                    htmlFor="register-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                >
                    Password
                </label>
                <div className="relative">
                    <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
                <label
                    htmlFor="confirm-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                >
                    Confirm Password
                </label>
                <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full rounded-sm border-2 border-ink bg-paper px-3 py-3 text-sm text-ink transition-colors duration-fast placeholder:text-ink-faint focus:bg-surface"
                    value={formData.confirmPassword}
                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                />
            </div>

            <button
                disabled={isRegisterAuthPending}
                type="submit"
                aria-busy={isRegisterAuthPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-ink px-4 text-sm font-bold text-paper shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs disabled:pointer-events-none disabled:opacity-50"
            >
                {isRegisterAuthPending ? (
                    <>
                        <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Creating account...
                    </>
                ) : (
                    'Create Account'
                )}
            </button>
        </form>
    </motion.div>
);