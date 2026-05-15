const supabase = require("../config/supabaseClient");

const getUserPosts = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      is_anonymous,
      created_at,
      post_tags (tags (name)),
      votes (id, vote_type)
    `)
    .eq("author_id", userId)
    .in("status", ["live", "pending"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
}

const getUserDrafts = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      post_tags (tags (name))
    `)
    .eq("author_id", userId)
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
}

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  const {
    display_name,
    bio,
    avatar_url,
  } = req.body;

  const { data, error } = await supabase
    .from("users")
    .update({
      display_name,
      bio,
      avatar_url,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    return res.status(500).json({
      error:
        error?.message ??
        "Failed to update profile",
    });
  }

  res.json(data);
}

module.exports = {
  getUserPosts,
  getUserDrafts,
  getUserProfile
};