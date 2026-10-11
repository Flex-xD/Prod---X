import { AlertTriangle, Loader2 } from 'lucide-react';
import DashboardHeader from '@/pages/Dashboard/dashboard-components/dashboard-header';
import ProfileHero from './profilepage-components/profile-hero';
import FocusSummaryCard from './profilepage-components/points-card';
import CategoryBreakdown from './profilepage-components/collections-row';
import ActivityCalendar from './profilepage-components/activity-calendar';
import useGetProfileData from '@/custom-hooks/profile/get-profile-data';
import useGetCalendar from '@/custom-hooks/dashboard/get-calender';

const SOURCE_LABELS: Record<string, string> = {
    tasks: 'tasks',
    individualTimers: 'individual timers',
    groupTimers: 'group timers',
    streakData: 'streak',
};

const ProfilePage = () => {
    const { data: profile, isLoading, isError, refetch } = useGetProfileData();
    const { data: calendar } = useGetCalendar();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (isError || !profile?.data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <p className="text-sm font-semibold text-slate-600">Could not load your profile.</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                >
                    Try again
                </button>
            </div>
        );
    }

    const { user, stats } = profile.data;
    const unavailable = stats.unavailable ?? [];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
            <DashboardHeader />

            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                {unavailable.length > 0 && (
                    <div
                        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold"
                        style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
                    >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        Some numbers may be incomplete right now:{' '}
                        {unavailable.map((name) => SOURCE_LABELS[name] ?? name).join(', ')}.
                    </div>
                )}
                <ProfileHero user={user} currentStreak={stats.streakData.currentStreak} />
                <FocusSummaryCard stats={stats} />
                <CategoryBreakdown stats={stats} />
                <ActivityCalendar calendarData={calendar?.data ?? []} />
            </div>
        </div>
    );
};

export default ProfilePage;