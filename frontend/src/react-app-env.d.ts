/// <reference types="react-scripts" />

// Add type declarations for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API_URL: string;
    readonly REACT_APP_VERSION: string;
    readonly REACT_APP_NAME: string;
    readonly REACT_APP_ENV: 'development' | 'production' | 'test';
    readonly REACT_APP_SENTRY_DSN?: string;
    readonly REACT_APP_GA_TRACKING_ID?: string;
  }
}

// Declare types for imported assets
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.m4a' {
  const src: string;
  export default src;
}

declare module '*.aac' {
  const src: string;
  export default src;
}

declare module '*.oga' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.styl' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Global type declarations
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  gtag?: (...args: any[]) => void;
}

// Declare global types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

// Utility types for React
type FCProps<T = {}> = React.PropsWithChildren<T>;
type FC<T = {}> = React.FC<FCProps<T>>;

// Event handler types
type MouseHandler = React.MouseEventHandler<HTMLElement>;
type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
type SubmitHandler = React.FormEventHandler<HTMLFormElement>;
type KeyHandler = React.KeyboardEventHandler<HTMLElement>;

// API response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}