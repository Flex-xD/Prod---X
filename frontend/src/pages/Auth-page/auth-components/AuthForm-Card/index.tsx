import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { GoogleAuthButton } from '../GoogleAuth-Button';

type AuthFormCardProps = {
    activeTab: 'login' | 'register';
    setActiveTab: (tab: 'login' | 'register') => void;
    children: React.ReactNode;
    onGoogleLogin: (credential: any) => void;
};

export const AuthFormCard = ({ activeTab, setActiveTab, children, onGoogleLogin }: AuthFormCardProps) => {
    return (
        <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {activeTab === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                </CardTitle>
                <p className="text-slate-600 mt-2">
                    {activeTab === 'login' ? 'Ready to crush your focus goals?' : 'Join the productivity revolution'}
                </p>
            </CardHeader>

            <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100/50 p-1">
                        <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            Register
                        </TabsTrigger>
                    </TabsList>

                    {children}
                </Tabs>

                <div className="relative">
                    <Separator className="my-6" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white/80 backdrop-blur-sm px-3 text-sm text-slate-500">Or continue with</span>
                    </div>
                </div>

                <GoogleAuthButton onSuccess={onGoogleLogin} />
            </CardContent>
        </Card>
    );
};