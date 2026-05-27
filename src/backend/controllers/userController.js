const supabase = require("../config/supabaseClient");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

  if (error) {console.error(error); return res.status(500).json({ error: error.message });}
  res.json(data);
};

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

  if (error) {console.error(error); return res.status(500).json({ error: error.message });}
  res.json(data);
};

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      username,
      display_name,
      avatar_url,
      bio,
      role,
      private_account,
      hide_activity
    `)
    .eq("id", userId)
    .maybeSingle();

  if (error) {return res.status(500).json({ error: error.message });}
  if (!data) {return res.status(404).json({ error: "User not found." });}

  res.json(data);
};

const uploadAvatar = async (req, res) => {
  const { userId } = req.params;
  const file = req.file;

  if (!file) {return res.status(400).json({ error: "No file provided." });}

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file.buffer, {contentType: file.mimetype, upsert: true,});

  if (uploadError) { console.error(uploadError);
    return res.status(500).json({ error: "Upload failed." });
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  return res.status(200).json({ publicUrl: data.publicUrl });
};

const getUserBookmarks = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("bookmarks")
    .select(`
      id,
      post:posts (
        id,
        title,
        content,
        created_at,
        author_id,
        is_anonymous,
        status,
        author:users (username, display_name, avatar_url),
        post_tags (tags (name)),
        votes (id,author_id)
      )
    `)
    .eq("user_id", userId);

  if (error) {return res.status(500).json({error: error.message,});}
  res.json(data ?? []);
};

const getUserNotifications = async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {return res.status(500).json({error: error.message,});}
  return res.status(200).json(data || []);
};

const markNotificationsAsRead = async (req, res) => {
  const { userId } = req.params;
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {return res.status(500).json({error: "Failed to mark notifications as read.",});}
  res.json({message: "Notifications marked as read.",});
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;

  const {
    display_name,
    bio,
    avatar_url,
    private_account,
    hide_activity,
  } = req.body;

  const updates = {};

  if (display_name !== undefined) updates.display_name = display_name;
  if (bio !== undefined) updates.bio = bio;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url;
  if (private_account !== undefined) updates.private_account = private_account;
  if (hide_activity !== undefined) updates.hide_activity = hide_activity;

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .maybesingle();

  if (error || !data) {
    return res.status(500).json({error: error?.message ?? "Failed to update profile",});
  }
  
  if (!data) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.json(data);
};

module.exports = {
  getUserPosts,
  getUserDrafts,
  getUserProfile,
  updateUserProfile,
  getUserBookmarks,
  getUserNotifications,
  markNotificationsAsRead,
  uploadAvatar, upload
};