import axios, { AxiosResponse } from 'axios';

export abstract class FivemAPI {
  public static async post<T = any>(body: Record<string, any>): Promise<AxiosResponse<T>> {
    const url = process.env.API_URL;
    const secret = process.env.API_SECRET;

    if (!url || !secret) {
      throw new Error("Missing API_URL or API_SECRET in environment variables.");
    }

    const requestBody = { ...body, secret };

    return axios.post<T>(url, requestBody);
  }
}
