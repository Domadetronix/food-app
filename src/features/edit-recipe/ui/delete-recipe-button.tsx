"use client";

import { deleteRecipeAction } from "../api/actions";

export function DeleteRecipeButton({ id }: { id: string }) {
  return (
    <form
      action={deleteRecipeAction}
      onSubmit={(e) => {
        if (!window.confirm("Удалить блюдо? Действие нельзя отменить.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-full border border-ink/15 px-5 text-sm font-medium text-ink/50 transition-colors hover:border-terracotta hover:text-terracotta"
      >
        Удалить блюдо
      </button>
    </form>
  );
}
