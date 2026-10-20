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
            <div className="flex min-h-screen items-center justify-center" role="status">
                <Loader2 className="h-6 w-6 animate-spin text-ink-soft" aria-hidden="true" />
                <span className="sr-only">Loading profile</span>
            </div>
        );
    }

    if (isError || !profile?.data) {
        return (
            <div
                role="alert"
                className="flex min-h-screen flex-col items-center justify-center gap-3 px-6"
            >
                <span className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-ink bg-alert-tint text-alert-deep">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-bold text-ink">Could not load your profile.</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="press-hard rounded-lg border-2 border-ink bg-ink px-4 py-2.5 text-sm font-bold text-paper"
                >
                    Try again
                </button>
            </div>
        );
    }

    const { user, stats } = profile.data;
    const unavailable = stats.unavailable ?? [];

    return (
        <div className="min-h-screen bg-paper">
            <DashboardHeader />

            <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
                {unavailable.length > 0 && (
                    /* Partial data = attention banner in focus amber, not an
                       error: "incomplete" is not "broken" (red stays for failures). */
                    <div
                        role="status"
                        className="flex items-center gap-2.5 rounded-lg border-2 border-focus bg-focus-tint px-4 py-3 text-xs font-semibold text-focus-deep"
                    >
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        <span>
                            Some numbers may be incomplete right now:{' '}
                            {unavailable.map((name) => SOURCE_LABELS[name] ?? name).join(', ')}.
                        </span>
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
