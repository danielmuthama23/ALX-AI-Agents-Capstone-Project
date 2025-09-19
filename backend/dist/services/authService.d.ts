import { IUser } from '../models/User';
export declare class AuthService {
    static register(userData: {
        username: string;
        email: string;
        password: string;
    }): Promise<{
        user: IUser;
        token: string;
    }>;
    static login(credentials: {
        email: string;
        password: string;
    }): Promise<{
        user: IUser;
        token: string;
    }>;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    static verifyToken(token: string): Promise<IUser>;
    static refreshToken(userId: string): Promise<string>;
    static checkEmailAvailability(email: string): Promise<boolean>;
    static checkUsernameAvailability(username: string): Promise<boolean>;
}
//# sourceMappingURL=authService.d.ts.map