import { supabase } from "./supabaseClient";

export async function getTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data.map((tag) => tag.name);
}