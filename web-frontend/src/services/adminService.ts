import axios from 'axios';
import { ADMIN_API } from '../config/api';

console.log('Admin API base:', ADMIN_API);

// --- Type Definitions for API Responses ---

export interface CrackResult {
    algorithm: string;
    hash: string;
    cracked: boolean;
    timeTakenMs: number;
    attempts: number;
    crackedPassword?: string;
}

export interface CrackDemoResponse {
    originalPassword: string;
    results: CrackResult[];
}

export interface CrackDemoHistory {
    id: number;
    originalPassword: string;
    algorithm: string;
    hashValue: string;
    cracked: boolean;
    timeTakenMs: number;
    attempts: number;
    crackedPassword?: string;
    testTimestamp: string; // ISO 8601 date string
}

// --- API Functions ---

/**
 * Runs the crack demo by sending a password to the backend.
 * @param password The password to test (should be 6 chars or less).
 * @returns A promise that resolves to the crack demo results.
 */
export const runCrackDemo = async (password: string): Promise<CrackDemoResponse> => {
    try {
        const response = await axios.post<CrackDemoResponse>(`${ADMIN_API}/crack-demo`, { password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Throw the error message from the backend if available
            throw new Error(error.response.data.message || 'An error occurred while running the demo.');
        }
        throw new Error('An unexpected error occurred.');
    }
};

/**
 * Fetches the history of all crack demo tests.
 * @returns A promise that resolves to an array of history records.
 */
export const getCrackDemoHistory = async (): Promise<CrackDemoHistory[]> => {
    try {
        const response = await axios.get<CrackDemoHistory[]>(`${ADMIN_API}/crack-demo/history`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'An error occurred while fetching the history.');
        }
        throw new Error('An unexpected error occurred.');
    }
};
