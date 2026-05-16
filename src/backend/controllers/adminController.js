const supabase = require("../config/supabaseClient");

// dashboard

const getAdminDashboardData = async (req, res) => {
  const { data: users } = await supabase.from("users").select("*");
  const { data: posts } = await supabase.from("posts").select("id, title");

  const { data: anonymousPosts, error: anonymousError } = await supabase
    .from("posts")
    .select("id, title, content, created_at, status, is_anonymous")
    .eq("is_anonymous", true)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  console.log("dashboard anonymous posts:", anonymousPosts);
  console.log("dashboard anonymous error:", anonymousError);

  const { data: reportedPosts } = await supabase
    .from("flags")
    .select(`
      id,
      created_at,
      status,
      posts!flags_post_id_fkey (
        title
      ),
      users!flags_reported_by_fkey (
        username,
        display_name
      )
    `)
    .eq("status", "pending");

  return res.status(200).json({
    users: users || [],
    posts: posts || [],

    anonymousPosts: (anonymousPosts || []).map((post) => ({
      id: post.id,
      post: post.title || post.content || "Untitled post",
      date: new Date(post.created_at).toLocaleDateString(),
      status: post.status,
    })),

    reportedPosts: (reportedPosts || []).map((flag) => ({
      id: flag.id,
      post: flag.posts?.title || "Untitled post",
      reportedBy:
        flag.users?.username ||
        flag.users?.display_name ||
        "Unknown user",
      reason: "Reported by user",
      date: new Date(flag.created_at).toLocaleDateString(),
      status: flag.status,
    })),
  });
};

// reported posts

const getReportedPosts = async (req, res) => {
  const { data, error } = await supabase
    .from("flags")
    .select(`
      id,
      created_at,
      status,
      post_id,
      reported_by,
      posts!flags_post_id_fkey (
        id,
        title
      ),
      users!flags_reported_by_fkey (
        username,
        display_name
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  console.log("flags data:", data);
  console.log("flags error:", error);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(
    data.map((flag) => ({
      id: flag.id,
      postId: flag.post_id,
      postTitle: flag.posts?.title || "Untitled post",
      reportedBy:
        flag.users?.username ||
        flag.users?.display_name ||
        "Unknown user",
      date: new Date(flag.created_at).toLocaleDateString(),
      status: flag.status,
    }))
  );
};

const resolveReportKeepPost = async (req, res) => {
  const { reportId } = req.params;

  const { data, error } = await supabase
    .from("flags")
    .update({ status: "resolved" })
    .eq("id", reportId)
    .select();

  console.log("keep result:", data);
  console.log("keep error:", error);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
};

const resolveReportHidePost = async (req, res) => {
  const { reportId, postId } = req.params;

  const { data: postData, error: postError } = await supabase
    .from("posts")
    .update({ status: "hidden" })
    .eq("id", postId)
    .select();

  console.log("hide post result:", postData);
  console.log("hide post error:", postError);

  if (postError) return res.status(500).json({ error: postError.message });

  const { data: flagData, error: flagError } = await supabase
    .from("flags")
    .update({ status: "resolved" })
    .eq("id", reportId)
    .select();

  console.log("resolve flag result:", flagData);
  console.log("resolve flag error:", flagError);

  if (flagError) return res.status(500).json({ error: flagError.message });

  return res.status(200).json({ success: true });
};

const resolveReportDeletePost = async (req, res) => {
  const { reportId, postId } = req.params;

  const { error: postError } = await supabase
    .from("posts")
    .update({ status: "deleted" })
    .eq("id", postId);

  if (postError) {
    console.error("Error deleting post:", postError);
    return res.status(500).json({ error: postError.message });
  }

  const { error: reportError } = await supabase
    .from("flags")
    .update({ status: "resolved" })
    .eq("id", reportId);

  if (reportError) {
    console.error("Error resolving report:", reportError);
    return res.status(500).json({ error: reportError.message });
  }

  return res.status(200).json({ success: true });
};

// anonymous posts

const getPendingAnonymousPosts = async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      status,
      is_anonymous
    `)
    .eq("is_anonymous", true)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching anonymous posts:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(
    data.map((post) => ({
      id: post.id,
      user: "Anonymous user",
      time: new Date(post.created_at).toLocaleDateString(),
      title: post.title,
      body: post.content,
      status: post.status,
    }))
  );
};

const approveAnonymousPost = async (req, res) => {
  const { postId } = req.params;

  const { error } = await supabase
    .from("posts")
    .update({ status: "live" })
    .eq("id", postId);

  if (error) {
    console.error("Error approving anonymous post:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
};

const rejectAnonymousPost = async (req, res) => {
  const { postId } = req.params;

  const { error } = await supabase
    .from("posts")
    .update({ status: "rejected" })
    .eq("id", postId);

  if (error) {
    console.error("Error rejecting anonymous post:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
};
1

// users
const getAdminUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, email, display_name, role, created_at")
    .order("created_at", { ascending: false });
 
  if (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: error.message });
  }
 
  return res.status(200).json(
    data.map((user) => ({
      id: user.id,
      username: user.username ? `@${user.username}` : "No username",
      email: user.email || "No email",
      role: user.role || "user",
      status: "Active",
    }))
  );
};

module.exports = {
  getAdminDashboardData,
  getReportedPosts,
  resolveReportKeepPost,
  resolveReportHidePost,
  resolveReportDeletePost,
  getPendingAnonymousPosts,
  approveAnonymousPost,
  rejectAnonymousPost,
  getAdminUsers,
};