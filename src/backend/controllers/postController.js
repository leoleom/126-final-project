const supabase = require("../config/supabaseClient");

const getPosts = async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      is_anonymous,
      status,
      created_at,
      author_id,
      author:users (
        display_name,
        username,
        avatar_url
      ),
      post_tags (
        tags (name)
      ),
      votes (id, vote_type)
    `)
    .eq("status", "live")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({error: error.message,});
  }

  res.json(data);
};

const getTags = async (req, res) => {
  const { data, error } = await supabase
    .from("tags")
    .select("name")
    .order("name", {
      ascending: true,
    });

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data ?? []);
}

const createPost = async (req, res) => {
  const {
    author_id,
    title,
    content,
    is_anonymous,
    status,
    selectedTags,
  } = req.body;

  if (!author_id || !title?.trim()) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const { data: post, error: postError } =
    await supabase
      .from("posts")
      .insert({
        author_id,
        title: title.trim(),
        content: content.trim(),
        is_anonymous,
        status,
      })
      .select()
      .single();

  if (postError || !post) {
    return res.status(500).json({
      error:
        postError?.message ??
        "Failed to create post",
    });
  }

  if (
    selectedTags &&
    selectedTags.length > 0
  ) {
    const {
      data: tagRows,
    } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", selectedTags);

    if (tagRows?.length > 0) {
      await supabase
        .from("post_tags")
        .insert(
          tagRows.map((tag) => ({
            post_id: post.id,
            tag_id: tag.id,
          }))
        );
    }
  }

  res.status(201).json(post);
};

const deletePost = async (req, res) => {
  const { postId } = req.params;

  await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", postId);

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json({
    success: true,
  });
}

const updatePost = async (req, res) => {
  const { postId } = req.params;

  const {
    title,
    content,
    is_anonymous,
    status,
    selectedTags,
  } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      is_anonymous,
      status,
    })
    .eq("id", postId)
    .select()
    .single();

  if (error || !data) {
    return res.status(500).json({
      error: error?.message ?? "Update failed",
    });
  }

  // remove old tags
  await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", postId);

  // add new tags
  if (selectedTags && selectedTags.length > 0) {
    const { data: tagRows, } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", selectedTags);

    if (tagRows?.length > 0) {
      await supabase
        .from("post_tags")
        .insert( tagRows.map((tag) => ({ post_id: postId, tag_id: tag.id, })) );
    }
  }

  res.json(data);
}

const getPost = async (req, res) => {
  const { postId } = req.params;

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      is_anonymous,
      created_at,
      author_id,
      author:users (
        id,
        username,
        display_name,
        avatar_url,
        bio,
        created_at
      ),
      status,
      post_tags (tags (name)),
      votes (id, vote_type)
    `)
    .eq("id", postId)
    .single();

  if (error || !data) {
    return res.status(404).json({
      error: "Post not found",
    });
  }

  const { count } = await supabase
    .from("posts")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("author_id", data.author_id)
    .eq("status", "live");

  res.json({
    post: data,
    authorPostCount: count ?? 0,
  });
}

const getComments = async (req, res) => {
  const { postId } = req.params;

  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      author:users (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("post_id", postId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data ?? []);
}

const createComment = async (req, res) => {
  const { postId } = req.params;

  const {
    author_id,
    content,
  } = req.body;

  if (!author_id || !content?.trim()) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author_id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }

  res.status(201).json(data);
}

module.exports = {
  getPosts,
  getTags,
  
  createPost,
  deletePost,
  updatePost,
  getPost,

  getComments,
  createComment
};