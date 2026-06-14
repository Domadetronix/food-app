import type { Recipe } from "./types";

// Демо-данные для каркаса. На этапе 1 заменим на данные из Supabase.
export const demoRecipes: Recipe[] = [
  {
    id: "1",
    name: "Паста карбонара",
    cookTimeMinutes: 25,
    mealTypes: ["lunch", "dinner"],
    tags: ["обед", "ужин", "мясное"],
    description:
      "Отварить спагетти аль денте. Обжарить гуанчале до хруста. Смешать желтки с тёртым пекорино, добавить горячую пасту вне огня, влить немного воды от варки. Заметка: не перегревать, иначе яйцо свернётся.",
    ingredients: [
      { name: "Спагетти", amount: "200 гр" },
      { name: "Гуанчале", amount: "100 гр" },
      { name: "Желток", amount: "3 шт" },
      { name: "Пекорино", amount: "50 гр" },
      { name: "Чёрный перец", amount: "по вкусу" },
    ],
  },
  {
    id: "2",
    name: "Сырники",
    cookTimeMinutes: 20,
    mealTypes: ["breakfast"],
    tags: ["завтрак"],
    description: "Творог размять с яйцом и сахаром, добавить муку, сформировать и обжарить до румяной корочки.",
    ingredients: [
      { name: "Творог", amount: "400 гр" },
      { name: "Яйцо", amount: "1 шт" },
      { name: "Мука", amount: "3 ст. л." },
      { name: "Сахар", amount: "2 ст. л." },
    ],
  },
  {
    id: "3",
    name: "Куриный суп",
    cookTimeMinutes: 60,
    mealTypes: ["lunch"],
    tags: ["обед", "мясное"],
    description: "Сварить бульон на курице, добавить картофель, морковь и вермишель. Посолить по вкусу.",
    ingredients: [
      { name: "Куриное филе", amount: "300 гр" },
      { name: "Картофель", amount: "3 шт" },
      { name: "Морковь", amount: "1 шт" },
      { name: "Вермишель", amount: "50 гр" },
    ],
  },
  {
    id: "4",
    name: "Овсянка с ягодами",
    cookTimeMinutes: 10,
    mealTypes: ["breakfast"],
    tags: ["завтрак"],
    description: "Сварить овсянку на молоке, добавить ягоды и ложку мёда.",
    ingredients: [
      { name: "Овсяные хлопья", amount: "60 гр" },
      { name: "Молоко", amount: "200 мл" },
      { name: "Ягоды", amount: "горсть" },
    ],
  },
  {
    id: "5",
    name: "Греческий салат",
    cookTimeMinutes: 15,
    mealTypes: ["lunch", "dinner"],
    tags: ["обед", "ужин"],
    description: "Нарезать овощи крупно, добавить фету и оливки, заправить оливковым маслом и орегано.",
    ingredients: [
      { name: "Помидоры", amount: "2 шт" },
      { name: "Огурец", amount: "1 шт" },
      { name: "Фета", amount: "150 гр" },
      { name: "Оливки", amount: "горсть" },
    ],
  },
  {
    id: "6",
    name: "Плов",
    cookTimeMinutes: 90,
    mealTypes: ["dinner"],
    tags: ["ужин", "мясное"],
    description: "Обжарить мясо с луком и морковью, добавить рис и воду, томить под крышкой до готовности.",
    ingredients: [
      { name: "Рис", amount: "400 гр" },
      { name: "Баранина", amount: "500 гр" },
      { name: "Морковь", amount: "3 шт" },
      { name: "Лук", amount: "2 шт" },
    ],
  },
];

export function getDemoRecipe(id: string): Recipe {
  return demoRecipes.find((r) => r.id === id) ?? demoRecipes[0];
}
