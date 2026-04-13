import data from "./events.json";

export interface TalismanEvent {
  id: string;
  date: string; // ISO format
  title: string;
  venue: string;
  city: string;
  link?: string;
  status: "UPCOMING" | "SOLD OUT" | "CANCELLED";
}

export const events: TalismanEvent[] = data as TalismanEvent[];
