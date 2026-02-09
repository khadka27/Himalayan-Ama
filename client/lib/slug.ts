
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with -
    .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
}
