import { useState, useMemo } from 'react';
import ProfileHero from './profilepage-components/profile-hero';
import CollectionsRow from './profilepage-components/collections-row';
import PointsCard from './profilepage-components/points-card';
import ActivityCalendar from './profilepage-components/activity-calendar';
import {
    collectionsData,
    pointsBreakdown,
    generateYearCalendarData,
} from './profilepage-components/profile-dummy-data';
import type { IProfileEditPayload } from './profilepage-components/profile-hero/profile-hero-types';
import { useLogoutMutation } from '@/custom-hooks/auth-mutation/logout';

const DUMMY_USER = {
    username: 'alex_prodx',
    email: 'alex@prodx.dev',
    avatarUrl: '',
    friendsCount: 24,
    productivityPoints: 4820,
    rank: 12,
    totalHours: 287,
};

const ProfilePage = () => {
    const [user, setUser] = useState(DUMMY_USER);

    const {mutateAsync:logout , isPending:isLogoutPending} = useLogoutMutation();
    const calendarData = useMemo(() => generateYearCalendarData(), []);

    const handleProfileSave = (payload: IProfileEditPayload) => {
        // TODO: wire up your updateProfile + uploadAvatar mutations here
        setUser((prev) => ({
            ...prev,
            username: payload.username,
            avatarUrl: payload.avatarPreview || prev.avatarUrl,
        }));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-violet-50/40 to-blue-50/40">

            {/* Background decoration — pointer-events-none so it never blocks clicks */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">

                <ProfileHero
                    username={user.username}
                    email={user.email}
                    avatarUrl={user.avatarUrl}
                    friendsCount={user.friendsCount}
                    productivityPoints={user.productivityPoints}
                    onSave={handleProfileSave}
                    onLogout={logout}
                    isLogoutPending={isLogoutPending}
                />

                <CollectionsRow collections={collectionsData} />

                <PointsCard
                    totalPoints={user.productivityPoints}
                    rank={user.rank}
                    breakdown={pointsBreakdown}
                />

                <ActivityCalendar
                    data={calendarData}
                    totalHours={user.totalHours}
                />

            </div>
        </div>
    );
};

export default ProfilePage;