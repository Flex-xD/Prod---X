import { userAppStore } from "@/store";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
    const accessToken = userAppStore((state) => state.accessToken);
    const isAuthenticated = !!accessToken;

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth"
                replace
            />
        );
    }

    return children;
};