const supabase = require('../config/supabaseClient');

// Handles search requests from the feed's search bar.
// Expects a query parameter: ?q=keyword
exports.searchPosts = async (req, res) => {
  const searchQuery = req.query.q;

  try {
    // Fallback: If the user clears the search bar or sends an empty request, 
    // we return the default feed (all posts, newest first).
    if (!searchQuery || searchQuery.trim() === '') {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    // Keyword search logic.
    // Use of  .ilike() instead of .like() here. 
    // ILIKE is case-insensitive, so searching "cmsc" will successfully match "CMSC".
    // The % symbols act as wildcards to find the word anywhere inside the string.
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    // Log the raw error for backend debugging, but return a clean 500 to the frontend
    console.error('Search API Error:', error.message);
    res.status(500).json({ error: 'Internal server error while searching posts.' });
  }
};