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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      author_id: authorId,
      content: content,
    }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
}


/* USERS */
export async function getUserPosts(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function updateUserProfile(userId, { display_name, bio, avatar_url }) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ display_name, bio, avatar_url }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
}
 
export async function uploadAvatar(userId, file) {
  const formData = new FormData();
  formData.append("avatar", file);
 
  const response = await fetch(`${BASE_URL}/users/${userId}/avatar`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function signupUser(email, username, password) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getUserDrafts(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/drafts`);
  const data = await response.json();
  return { ok: response.ok, data };
}


/* AUTHENTICATION */
export async function loginUser(emailOrUsername, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emailOrUsername, password }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
}