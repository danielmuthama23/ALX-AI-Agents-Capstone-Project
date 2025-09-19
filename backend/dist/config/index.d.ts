export interface AppConfig {
    NODE_ENV: string;
    PORT: number;
    HOST: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    OPENAI_API_KEY: string;
    LOG_LEVEL: string;
    LOG_DIR: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    CORS_ORIGIN: string;
    BCRYPT_SALT_ROUNDS: number;
}
export declare const getConfig: () => AppConfig;
export declare const validateConfig: (config: AppConfig) => void;
export declare const setupEnvironment: () => void;
export declare const isProduction: () => boolean;
export declare const isDevelopment: () => boolean;
export declare const isTest: () => boolean;
export declare const appConfig: AppConfig;
declare const _default: {
    getConfig: () => AppConfig;
    validateConfig: (config: AppConfig) => void;
    setupEnvironment: () => void;
    isProduction: () => boolean;
    isDevelopment: () => boolean;
    isTest: () => boolean;
    appConfig: AppConfig;
};
export default _default;
//# sourceMappingURL=index.d.ts.map