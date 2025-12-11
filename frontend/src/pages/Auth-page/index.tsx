import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';

import apiClient from '@/utils/Axios-client';
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

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const { mutateAsync: handleGoogleAuth, isPending: isGoogleAuthPending, isError: isGoogleAuthError } = useGoogleAuth();
    const { mutateAsync: handleLoginAuth, isPending: isLoginAuthPending, isError: isLoginAuthError } = useLoginMutation();
    const { mutateAsync: handleRegisterAuth, isPending: isRegisterAuthPending, isError: isRegisterAuthError } = useRegisterMutation();


    // ? Add actual pending and error components
    if (isGoogleAuthError || isLoginAuthError || isRegisterAuthError) return <div>Something went wrong...</div>
    if (isGoogleAuthPending || isLoginAuthPending || isRegisterAuthPending) return <div>Loading...</div>


    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        await handleGoogleAuth(credentialResponse.credential);
    };

    const handleLogin = async () => {

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 relative overflow-hidden px-6 py-8">
            <div className="relative z-10 max-w-7xl mx-auto">
                <AuthHeader />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] lg:mr-16">

                    {/* Left: Auth Form */}
                    <div className="flex justify-center lg:justify-end">
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
                                            togglePassword={() => setShowPassword(prev => !prev)}
                                            onChange={handleInputChange}
                                        />
                                    </TabsContent>

                                    <TabsContent value="register">
                                        <RegisterForm
                                            formData={formData}
                                            showPassword={showPassword}
                                            togglePassword={() => setShowPassword(prev => !prev)}
                                            onChange={handleInputChange}
                                        />
                                    </TabsContent>
                                </>
                            </AnimatePresence>
                        </AuthFormCard>
                    </div>

                    {/* Right Side Marketing (Desktop Only) */}
                    <div className="hidden lg:block space-y-8">
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
