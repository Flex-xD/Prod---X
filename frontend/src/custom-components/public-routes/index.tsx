import { userAppStore } from "@/store";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoutes = ({
    children
}: {
    children: ReactNode
}) => {

    const isAuthenticated =
        userAppStore(
            (state) => state.isAuthenticated
        );

    if (isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
};