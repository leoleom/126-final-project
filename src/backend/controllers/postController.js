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
      views,
      author:users (display_name, username, avatar_url),
      post_tags (tags (name)),
      votes (id, vote_type, author_id),
      comments (id)
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

  if (error) {return res.status(500).json({error: error.message,});}

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
    return res.status(400).json({error: "Missing required fields",});
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
    return res.status(500).json({error: postError?.message ?? "Failed to create post",});
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

  const tagDelete = await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", postId);

  const postDelete = await supabase
    .from("posts")
    .update({
      status: "deleted"
    })
    .eq("id", postId)
    .select();

  if (postDelete.error) {
    return res.status(500).json({
      error: postDelete.error.message,
    });
  }

  if (!postDelete.data || postDelete.data.length === 0) {
    return res.status(403).json({
      error: "Delete blocked or post not found",
    });
  }

  res.json({success: true,});
};

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
      views,
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
      votes (id, vote_type, author_id)
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
};

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

const toggleVote = async (req, res) => {
  const { postId } = req.params;
  const { author_id } = req.body;

  if (!author_id) {
    return res.status(400).json({
      error: "Missing author_id",
    });
  }

  // Check if vote already exists
  const { data: existingVote, error: fetchError } = await supabase
    .from("votes")
    .select("id")
    .eq("post_id", postId)
    .eq("author_id", author_id)
    .maybeSingle();

  // If already liked → remove like
  if (existingVote) {
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);

    if (deleteError) {
      return res.status(500).json({
        error: deleteError.message,
      });
    }

    return res.json({
      liked: false,
    });
  }

  // Otherwise create like
  const { error: insertError } = await supabase
    .from("votes")
    .insert({
      post_id: postId,
      author_id,
      vote_type: "upvote",
    });

  if (insertError) {
    return res.status(500).json({
      error: insertError.message,
    });
  }

  return res.json({
    liked: true,
  });
};

const toggleBookmark = async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  const { data: existingBookmark, error: findError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user_id)
    .eq("post_id", postId)
    .maybeSingle();

  if (findError) {
    return res.status(500).json({ error: findError.message });
  }

  if (existingBookmark) {
    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", existingBookmark.id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(200).json({ bookmarked: false });
  }

  const { error: insertError } = await supabase
    .from("bookmarks")
    .insert({
      user_id,
      post_id: postId,
    });

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(200).json({ bookmarked: true });
};

const incrementPostView = async (req, res) => {
  const { postId } = req.params;

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("views")
    .eq("id", postId)
    .single();

  if (fetchError || !post) {
    return res.status(404).json({ error: "Post not found." });
  }

  const currentViews = post.views || 0;

  const { data, error } = await supabase
    .from("posts")
    .update({ views: currentViews + 1 })
    .eq("id", postId)
    .select("id, views")
    .single();

  if (error) {return res.status(500).json({ error: error.message });}

  return res.json({message: "View counted.", views: data.views,});
};

const reportPost = async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  if (!user_id) {return res.status(400).json({error: "user_id is required",});}

  const { data: existingReport, error: checkError } = await supabase
    .from("flags")
    .select("id")
    .eq("post_id", postId)
    .eq("reported_by", user_id)
    .maybeSingle();

  if (checkError) {return res.status(500).json({error: checkError.message,});}

  if (existingReport) {return res.status(400).json({error: "You already reported this post.",});}

  const { error } = await supabase
    .from("flags")
    .insert({
      post_id: postId,
      reported_by: user_id,
      status: "pending",
    });

  if (error) {return res.status(500).json({error: error.message,});}

  return res.status(201).json({message: "Post reported successfully.",});
};

module.exports = {
  getPosts,
  getTags,
  
  createPost,
  deletePost,
  updatePost,
  getPost,

  getComments,
  createComment,

  toggleVote,
  toggleBookmark,
  incrementPostView,
  reportPost,
};