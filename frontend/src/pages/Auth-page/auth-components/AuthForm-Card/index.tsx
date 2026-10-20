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
        <Card className="w-full max-w-md rounded-lg border-2 border-ink bg-surface shadow-hard-lg">
            <CardHeader className="pb-6 text-center">
                <CardTitle className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                    {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <p className="mt-1.5 text-xs font-medium text-ink-faint">
                    {activeTab === 'login' ? 'Sign in to pick up your record.' : 'Start building your record today.'}
                </p>
            </CardHeader>

            <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
                    <TabsList className="grid w-full grid-cols-2 rounded-lg p-1">
                        <TabsTrigger value="login" className="rounded-lg font-bold uppercase tracking-wider">
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger value="register" className="rounded-lg font-bold uppercase tracking-wider">
                            Register
                        </TabsTrigger>
                    </TabsList>

                    {children}
                </Tabs>

                <div className="relative">
                    <Separator className="my-6 bg-line" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-surface px-3 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                            Or continue with
                        </span>
                    </div>
                </div>

                <GoogleAuthButton onSuccess={onGoogleLogin} />
            </CardContent>
        </Card>
    );
};