export type MealType = "breakfast" | "lunch" | "dinner";

export type Ingredient = {
  name: string;
  amount: string;
};

export type Recipe = {
  id: string;
  name: string;
  /** Рецепт и заметки. */
  description?: string;
  photoUrl?: string;
  cookTimeMinutes?: number;
  mealTypes: MealType[];
  /** Свободные теги, включая «мясное». Фильтрация в т.ч. по тегам. */
  tags: string[];
  ingredients: Ingredient[];
};
