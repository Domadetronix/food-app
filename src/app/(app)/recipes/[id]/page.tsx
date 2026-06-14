import { RecipeDetailsPage } from "@/views/recipe-details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RecipeDetailsPage id={id} />;
}
