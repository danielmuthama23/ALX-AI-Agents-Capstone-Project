export * from './task';
export * from './user';
export * from './auth';
export * from './api';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Dictionary types
export type Dictionary<T> = Record<string, T>;
export type NumericDictionary<T> = Record<number, T>;

// Function types
export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;
export type Predicate<T> = (value: T) => boolean;
export type Comparator<T> = (a: T, b: T) => number;

// React specific types
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type ComponentProps<T extends React.ComponentType<any>> = 
  React.ComponentProps<T>;

// Form types
export type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

export type FormFields<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// API response types
export type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// Pagination types
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Filter types
export type FilterCondition = 
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'in'
  | 'notIn';

export type Filter<T> = {
  field: keyof T;
  condition: FilterCondition;
  value: any;
};

// Sort types
export type SortDirection = 'asc' | 'desc';

export type Sort<T> = {
  field: keyof T;
  direction: SortDirection;
};