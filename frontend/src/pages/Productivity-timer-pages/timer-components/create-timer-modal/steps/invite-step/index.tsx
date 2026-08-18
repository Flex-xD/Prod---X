import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UserPlus, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MAX_GROUP_INVITES, sp } from '../../../constants';
import { Avatar } from '../../../ui';
import type { IUser } from '../../../types';
import UserGetUsersToInvite from '@/custom-hooks/group-productivity-timer/get-users-to-invite';
import { toast } from 'sonner';

interface InviteStepProps {
    invitedUsers: IUser[];
    onToggle: (user: IUser) => void;
    onContinue: () => void;
}

const InviteStep = ({ invitedUsers, onToggle, onContinue }: InviteStepProps) => {
    // * Local State
    const [query, setQuery] = useState('');


    // * Users to invite query
    const { data: usersToInvite, isError: isUsersToInviteError } = UserGetUsersToInvite(query);




    // ? Replace the dummySearchUsers with actual data from the backend
    // if (!usersToInvite?.data.users) {
    //     throw Error("No User found with this username and email !");
    // }


    const filtered = usersToInvite?.data.users ?? usersToInvite?.data.users.filter(
        u =>
            u.username.toLowerCase().includes(query.toLowerCase()) &&
            !invitedUsers.find(i => i._id === u._id),
    );


    console.log("This is the data from : ", usersToInvite);
    // if (!isUsersToInvitePending) {
    //     return <Loader2Icon />;
    // }

    if (isUsersToInviteError) {
        console.log(`There is error while fetching the users to invite : ${isUsersToInviteError}`);
        toast.error("Error while fetching the users !");
    }

    return (
        <motion.div
            key="invite-users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={sp}
            className="space-y-4"
        >
            {/* Invited chips */}
            <AnimatePresence>
                {invitedUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2 p-3 rounded-2xl"
                        style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                    >
                        {invitedUsers.map((u, i) => (
                            <motion.div
                                key={u._id}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={sp}
                                className="flex items-center gap-1.5 bg-white rounded-xl px-2.5 py-1.5"
                                style={{ border: '1px solid #ddd6fe', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                            >
                                <Avatar initials={""} idx={i} size="sm" />
                                <span className="text-xs font-bold text-slate-700">{u.username}</span>
                                <button
                                    onClick={() => onToggle(u)}
                                    className="text-slate-300 hover:text-rose-400 transition-colors ml-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search username…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-violet-400"
                />
            </div>

            {/* Results list */}
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {/* ? Fix the types of user and i below */}
                {filtered && filtered?.map((user: IUser, i: any) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 rounded-2xl"
                        style={{ background: '#f8fafc' }}
                    >
                        <Avatar initials={user.username.split(' ').map(word => word.charAt(0)).join('')} idx={i + 2} size="md" isOnline={user.isOnline} />

                        <div className="flex-1">
                            <div className="font-bold text-slate-800 text-sm">{user.username}</div>
                            <div className={`text-xs font-semibold ${user.isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {user.isOnline ? '● Online' : '○ Offline'}
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onToggle(user)}
                            disabled={invitedUsers.length >= MAX_GROUP_INVITES}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-white disabled:opacity-40"
                            style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}
                        >
                            <UserPlus className="w-3 h-3" /> Invite
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Continue CTA */}
            <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={invitedUsers.length === 0}
                onClick={onContinue}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                style={{
                    background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
                    boxShadow: invitedUsers.length > 0 ? '0 8px 24px rgba(124,58,237,0.3)' : 'none',
                }}
            >
                Continue with {invitedUsers.length} member{invitedUsers.length !== 1 ? 's' : ''}
                <ChevronRight className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
};

export default InviteStep;