const BASE_URL = import.meta.env.VITE_API_BASE_URL;
/* POSTS */
export async function getPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getPostById(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getComments(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function createComment(postId, authorId, content) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST", headers: {"Content-Type": "application/json",},
    body: JSON.stringify({author_id: authorId, content: content,}),
  });
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function incrementPostView(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/view`, {
    method: "PATCH",});

  const data = await response.json();
  return { ok: response.ok, data };

  
}


/* USERS */
export async function getUserPosts(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function updateUserProfile(userId, updates) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function uploadAvatar(userId, file) {
  const formData = new FormData();
  formData.append("avatar", file);
 
  const response = await fetch(`${BASE_URL}/users/${userId}/avatar`, {
    method: "POST", body: formData,});
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function signupUser(email, username, password) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({ email, username, password }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getTags() {
  const response = await fetch(`${BASE_URL}/posts/tags/all`);
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function savePost(postId = null, payload) {
  const url = postId ? `${BASE_URL}/posts/${postId}` : `${BASE_URL}/posts`;
  const method = postId ? "PUT" : "POST";
 
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function deletePost(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {method: "DELETE",});
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function deleteDraft(draftId) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${draftId}`, {method: "DELETE",});
    const data = await response.json();

    return {ok: response.ok, data,};
  } catch (error) {return {ok: false,data: { error: error.message },};}
}

export async function getUserDrafts(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/drafts`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getUserBookmarks(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/bookmarks`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function toggleBookmark(postId, userId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/bookmark`, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({user_id: userId,}),
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function reportPost(postId, userId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/report`, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({user_id: userId,}),
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getUserNotifications(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/notifications`);
  const data = await response.json();
  return {ok: response.ok, data,};
}

export async function markNotificationsAsRead(userId) {
  const response = await fetch(
    `${BASE_URL}/users/${userId}/notifications/read`,
    {method: "PATCH",});

  const data = await response.json();
  return {ok: response.ok, data,};
}



/* ADMIN */
export async function getAdminUsers() {
  const response = await fetch(`${BASE_URL}/admin/users`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getAdminDashboardData() {
  const response = await fetch(`${BASE_URL}/admin/dashboard`);
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function getReportedPosts() {
  const response = await fetch(`${BASE_URL}/admin/reports`);
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function resolveReportKeepPost(reportId) {
  const response = await fetch(`${BASE_URL}/admin/reports/${reportId}/keep`, {
    method: "PATCH",});
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function resolveReportHidePost(reportId, postId) {
  const response = await fetch(`${BASE_URL}/admin/reports/${reportId}/hide/${postId}`, {
    method: "PATCH",});
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function resolveReportDeletePost(reportId, postId) {
  const response = await fetch(`${BASE_URL}/admin/reports/${reportId}/delete/${postId}`, {
    method: "PATCH",});
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function getPendingAnonymousPosts() {
  const response = await fetch(`${BASE_URL}/admin/anonymous`);
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function approveAnonymousPost(postId) {
  try{
    const response = await fetch(`${BASE_URL}/admin/anonymous/${postId}/approve`, {
      method: "PATCH",});
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    return {ok: false, data: { error: error.message },};
  }
}
 
export async function rejectAnonymousPost(postId) {
  try{
    const response = await fetch(`${BASE_URL}/admin/anonymous/${postId}/reject`, {
      method: "PATCH",});
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    return {ok: false, data: { error: error.message },};
  }
}


/* AUTHENTICATION */
export async function loginUser(emailOrUsername, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({ emailOrUsername, password }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function logoutUser() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function toggleVote(postId, authorId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/vote`, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({author_id: authorId,}),
  });

  const data = await response.json();
  return {ok: response.ok,data,};
}