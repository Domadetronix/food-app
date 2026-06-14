import { RecipeFormPage } from "@/views/recipe-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params; // на этапе 1 загрузим блюдо по id
  return <RecipeFormPage mode="edit" />;
}
