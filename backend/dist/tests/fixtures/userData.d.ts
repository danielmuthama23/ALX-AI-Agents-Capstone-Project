import mongoose from 'mongoose';
export interface TestUser {
    _id?: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const testUsers: TestUser[];
export declare const invalidUsers: {
    username: string;
    email: string;
    password: string;
}[];
export declare const registrationData: {
    valid: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    invalid: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    existing: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
};
export declare const loginData: {
    valid: {
        email: string;
        password: string;
    };
    invalid: {
        email: string;
        password: string;
    };
    nonExistent: {
        email: string;
        password: string;
    };
};
export declare const createTestUser: (overrides?: Partial<TestUser>) => TestUser;
export declare const getTestUserTokenData: (user: TestUser) => {
    id: string;
    username: string;
    email: string;
};
//# sourceMappingURL=userData.d.ts.map