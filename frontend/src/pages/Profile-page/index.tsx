import { useState } from 'react';
import { collectionsData, generateYearCalendarData, pointsBreakdown } from './profilepage-components/profile-dummy-data';
import type { IProfileEditPayload } from './profilepage-components/profile-hero/profile-hero-types';
import ProfileHero from './profilepage-components/profile-hero';
import CollectionsRow from './profilepage-components/collections-row';
import PointsCard from './profilepage-components/points-card';
import ActivityCalendar from './profilepage-components/activity-calendar';
import { useUserData } from '@/custom-hooks/user-related-fetching/user-data';

const DUMMY_USER = {
    username: 'alex_prodx',
    email: 'alex@prodx.dev',
    avatarUrl: '',
    friendsCount: 24,
    productivityPoints: 4820,
    rank: 12,
    totalHours: 287,
};

const calendarData = generateYearCalendarData();

const ProfilePage = () => {
    const {data:userProfileData , isPending:userProfileDataPending} = useUserData();
    console.log("This is the user-data : ", userProfileData ,"and isPending : ", userProfileDataPending);
    const [user, setUser] = useState(DUMMY_USER);

    const handleProfileSave = (payload: IProfileEditPayload) => {
        //  TODO: call your updateProfile mutation here, pass payload.avatarFile for upload
        setUser((prev) => ({
            ...prev,
            username: payload.username,
            avatarUrl: payload.avatarPreview || prev.avatarUrl,
        }));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                <ProfileHero
                    username={user.username}
                    email={user.email}
                    avatarUrl={user.avatarUrl}
                    friendsCount={user.friendsCount}
                    productivityPoints={user.productivityPoints}
                    onSave={handleProfileSave}
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