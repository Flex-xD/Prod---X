import { Loader2 } from 'lucide-react';
import DashboardHeader from '@/pages/Dashboard/dashboard-components/dashboard-header';
import ProfileHero from './profilepage-components/profile-hero';
import FocusSummaryCard from './profilepage-components/points-card';
import CategoryBreakdown from './profilepage-components/collections-row';
import ActivityCalendar from './profilepage-components/activity-calendar';
import useGetProfileData from '@/custom-hooks/profile/get-profile-data';
import useGetCalendar from '@/custom-hooks/dashboard/get-calender';

const ProfilePage = () => {
    const { data: profile, isLoading } = useGetProfileData();
    const { data: calendar } = useGetCalendar();

    if (isLoading || !profile?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            </div>
        );
    }

    const { user, stats } = profile.data;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
            <DashboardHeader />

            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                <ProfileHero user={user} currentStreak={stats.streakData.currentStreak} />
                <FocusSummaryCard stats={stats} />
                <CategoryBreakdown stats={stats} />
                <ActivityCalendar calendarData={calendar?.data ?? []} />
            </div>
        </div>
    );
};

export default ProfilePage;