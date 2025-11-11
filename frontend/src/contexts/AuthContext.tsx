import { useSelector, useDispatch } from 'react-redux';
import { LoginUser as loginAction, LogoutUser as logoutAction } from '@/AuthStore/slice';
import type { AppDispatch, RootState } from '@/AuthStore/store';
import type { User } from '@/models/AuthModels';

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user, isAuth } = useSelector((state: RootState) => state.auth);

    const LoginUser = (user: User) => {
        dispatch(loginAction({ user }));
    };

    const LogoutUser = () => {
        dispatch(logoutAction());
    };

    return {
        user,
        isAuth,
        LoginUser,
        LogoutUser,
        role: user?.role
    };
};