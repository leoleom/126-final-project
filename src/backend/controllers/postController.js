// For communication with Supabase database

const supabase = require('../config/supabaseClient');

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content, tags, isAnonymous, authorId } = req.body;

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title,
        content,
        tags,
        is_anonymous: isAnonymous,
        author_id: authorId
      }])
      .select('id')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Post created successfully!",
      postId: data.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing post
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { content, tags, authorId } = req.body;

  try {
    // Verify ownership before updating
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !post) return res.status(404).json({ error: "Post not found" });
    if (post.author_id !== authorId) {
      return res.status(403).json({ error: "Unauthorized: You can only update your own posts" });
    }

    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ content, tags })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json({
      message: "Post updated successfully!",
      data: updatedPost
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      message: "Post successfully deleted."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};