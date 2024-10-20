export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_HOST: string;
            DATABASE_PORT: string;
            DATABASE_USER: string;
            DATABASE_PASSWORD: string;
            DATABASE_NAME: string;

            REST_API_PORT: string;
            WS_PORT: string;
        }
    }
}