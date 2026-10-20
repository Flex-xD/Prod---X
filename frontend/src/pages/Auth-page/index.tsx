import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';
import { AuthHeader } from './auth-components/Auth-Header';
import { AuthFormCard } from './auth-components/AuthForm-Card';
import { LoginForm } from './auth-components/LoginForm';
import { RegisterForm } from './auth-components/RegisterForm';
import { CommunityStats } from './auth-components/Community-Stats';
import { MotivationalQuote } from './auth-components/Motivational-Quote';
import { MobileFeatures } from './auth-components/Mobile-Features';
import { FeaturesGrid } from './auth-components/Features-Grid';
import useGoogleAuth from '@/custom-hooks/auth-mutation/google-auth';
import useLoginMutation from '@/custom-hooks/auth-mutation/login';
import useRegisterMutation from '@/custom-hooks/auth-mutation/register';
import type { IHandleLogin, IHandleRegiser } from './auth-components/Auth-Types';

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const { mutateAsync: handleGoogleAuth, isError: isGoogleAuthError } = useGoogleAuth();
    const {
        mutateAsync: handleLoginAuth,
        isPending: isLoginAuthPending,
        isError: isLoginAuthError,
    } = useLoginMutation();
    const {
        mutateAsync: handleRegisterAuth,
        isPending: isRegisterAuthPending,
        isError: isRegisterAuthError,
    } = useRegisterMutation();

    // Error state is clear and actionable: one banner, no toasts, no drama.
    const isAuthError = isGoogleAuthError || isLoginAuthError || isRegisterAuthError;

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        await handleGoogleAuth(credentialResponse.credential);
    };

    const handleLogin = async (formData: IHandleLogin) => {
        await handleLoginAuth(formData);
    };

    const handleRegister = async (formData: IHandleRegiser) => {
        await handleRegisterAuth(formData);
    };

    return (
        <div className="min-h-screen bg-paper px-6 py-8">
            <div className="relative z-10 mx-auto max-w-7xl">
                <AuthHeader />

                <div className="grid min-h-[70vh] grid-cols-1 items-center gap-12 lg:mr-16 lg:grid-cols-2">
                    {/* Left: Auth Form */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-md space-y-4">
                            {isAuthError && (
                                <div
                                    role="alert"
                                    className="rounded-lg border-2 border-ink bg-alert-tint px-4 py-3 text-sm font-semibold text-ink"
                                >
                                    Authentication failed. Check your details and try again.
                                </div>
                            )}

                            <AuthFormCard
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                onGoogleLogin={handleGoogleLogin}
                            >
                                <AnimatePresence mode="wait">
                                    <>
                                        <TabsContent value="login">
                                            <LoginForm
                                                formData={formData}
                                                showPassword={showPassword}
                                                togglePassword={() => setShowPassword((prev) => !prev)}
                                                onChange={handleInputChange}
                                                handleLogin={handleLogin}
                                                isLoginAuthPending={isLoginAuthPending}
                                            />
                                        </TabsContent>

                                        <TabsContent value="register">
                                            <RegisterForm
                                                formData={formData}
                                                showPassword={showPassword}
                                                togglePassword={() => setShowPassword((prev) => !prev)}
                                                onChange={handleInputChange}
                                                handleRegister={handleRegister}
                                                isRegisterAuthPending={isRegisterAuthPending}
                                            />
                                        </TabsContent>
                                    </>
                                </AnimatePresence>
                            </AuthFormCard>
                        </div>
                    </div>

                    {/* Right Side (Desktop Only) */}
                    <div className="hidden space-y-6 lg:block">
                        <MotivationalQuote />
                        <FeaturesGrid />
                        <CommunityStats />
                    </div>
                </div>

                {/* Mobile Section */}
                <MobileFeatures className="lg:hidden mt-16" />
            </div>
        </div>
    );
}