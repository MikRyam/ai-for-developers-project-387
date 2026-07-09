import type { components } from "../types/generated-types.js";

type EventType = components["schemas"]["EventType"];
type Booking = components["schemas"]["Booking"];

const eventTypes = new Map<string, EventType>();
const bookings = new Map<string, Booking>();

export function getEventTypes(): EventType[] {
  return Array.from(eventTypes.values());
}

export function getEventType(id: string): EventType | undefined {
  return eventTypes.get(id);
}

export function addEventType(eventType: EventType): EventType {
  eventTypes.set(eventType.id, eventType);
  return eventType;
}

export function getBookings(): Booking[] {
  return Array.from(bookings.values());
}

export function updateEventType(id: string, patch: Partial<Pick<EventType, "title" | "description" | "durationMinutes">>): EventType | undefined {
  const existing = eventTypes.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  eventTypes.set(id, updated);
  return updated;
}

export function addBooking(booking: Booking): Booking {
  bookings.set(booking.id, booking);
  return booking;
}
