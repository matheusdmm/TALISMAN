"use client";

import React from "react";
import { events, TalismanEvent } from "@/data/events";
import { ExternalLink } from "lucide-react";

export function EventList() {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    return { day, month };
  };

  return (
    <div className="flex flex-col w-full border-t-4 border-foreground">
      {events.map((event) => {
        const { day, month } = formatDate(event.date);
        const isSoldOut = event.status === "SOLD OUT";

        return (
          <div
            key={event.id}
            className="group flex flex-col md:flex-row items-stretch md:items-center border-b border-border/50 hover:bg-accent/5 transition-all relative overflow-hidden"
          >
            {/* Monumental Date Block */}
            <div className="flex items-center gap-4 px-6 py-6 md:py-10 border-b md:border-b-0 md:border-r border-border/50 min-w-[140px] bg-foreground text-background md:bg-transparent md:text-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
              <span className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
                {day}
              </span>
              <span className="text-xl font-black tracking-widest uppercase rotate-90 md:rotate-90 origin-center whitespace-nowrap ml-2">
                {month}
              </span>
            </div>

            {/* Event Info */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 px-6 py-8 md:py-0">
              <div className="flex-1 space-y-1">
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                  {event.title}
                </h3>
                <p className="text-sm md:text-lg font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <span>{event.venue}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span>{event.city}</span>
                </p>
              </div>

              {/* Status & CTA */}
              <div className="flex items-center gap-6">
                {isSoldOut ? (
                  <span className="text-xs font-black uppercase tracking-[0.2em] px-4 py-2 border-2 border-foreground/20 text-muted-foreground/50 italic">
                    SOLD OUT
                  </span>
                ) : (
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                  >
                    Get Tickets <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Background Accent (Brutalist detail) */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-accent/5 -skew-x-12 translate-x-12 group-hover:translate-x-0 transition-transform duration-700 pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
