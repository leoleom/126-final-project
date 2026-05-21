const supabase = require('../config/supabaseClient');

exports.searchPosts = async (req, res) => {
  const searchQuery = req.query.q;

  const selectQuery = `
    id, title, content, is_anonymous, status, created_at, author_id,
    author:users (display_name, username, avatar_url),
    post_tags (tags (name)),
    votes (id, vote_type)
  `;

  try {
    let query = supabase
      .from('posts')
      .select(selectQuery)
      .eq('status', 'live')
      .order('created_at', { ascending: false });

    // If there is a search term, add the backend filter
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return res.status(200).json(data);

  } catch (error) {
    console.error('Search API Error:', error.message);
    res.status(500).json({ error: 'Internal server error while searching posts.' });
  }
};