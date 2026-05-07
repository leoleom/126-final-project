export async function getAdminDashboardData() {
  return {
    users: [
      { id: 1, username: "@leolem", status: "Active" },
      { id: 2, username: "@junel", status: "Active" },
      { id: 3, username: "@admin", status: "Active" },
      { id: 4, username: "@inactive", status: "Inactive" },
    ],

    posts: [
      { id: 1, title: "Lf: kasama habang buhay" },
      { id: 2, title: "Iniwan mo nako sa ere :(" },
      { id: 3, title: "Campus concern" },
    ],

    anonymousPosts: [
      {
        id: "A001",
        post: "Anonymous concern",
        date: "May 02, 2029",
        status: "Pending",
      },

      {
        id: "A002",
        post: "Campus question",
        date: "May 03, 2029",
        status: "Pending",
      },
    ],

    reportedPosts: [
      {
        id: 1,
        post: "Rude comment",
        reportedBy: "@junel",
        reason: "Harassment",
        date: "May 02, 2029",
        status: "Pending",
      },

      {
        id: 2,
        post: "Inappropriate post",
        reportedBy: "@leolem",
        reason: "Inappropriate",
        date: "April 30, 2029",
        status: "Reviewed",
      },
    ],
  };
}