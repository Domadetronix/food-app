import { CalendarPage } from "@/views/calendar";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  return <CalendarPage month={month} />;
}
