import { getSession } from "@/shared/lib/auth/session";
import { getMonthPlan } from "@/entities/meal-plan/api/queries";
import { getFamilyRecipeOptions } from "@/entities/recipe/api/queries";
import { CalendarBoard } from "@/features/plan-meals";

const pad = (n: number) => String(n).padStart(2, "0");

function monthBounds(month?: string) {
  const now = new Date();
  let year = now.getFullYear();
  let m0 = now.getMonth();
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    year = y;
    m0 = m - 1;
  }
  const monthStr = `${year}-${pad(m0 + 1)}`;
  const lastDay = new Date(year, m0 + 1, 0).getDate();
  return { monthStr, start: `${monthStr}-01`, end: `${monthStr}-${pad(lastDay)}` };
}

export async function CalendarPage({ month }: { month?: string }) {
  const session = await getSession();
  const { monthStr, start, end } = monthBounds(month);

  const [entries, recipes] = session
    ? await Promise.all([
        getMonthPlan(session.familyId, start, end),
        getFamilyRecipeOptions(session.familyId),
      ])
    : [[], []];

  return <CalendarBoard month={monthStr} entries={entries} recipes={recipes} />;
}
