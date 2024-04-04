export class CommentService {
  constructor(http) {
    this.http = http;
  }

  async createComment(body, video_id, user_id) {
    if (body == "") return;
    return this.http.fetching("/comment", {
      method: "post",
      body: JSON.stringify({ body, video_id, user_id }),
    });
  }

  async modifyComment(id, body) {
    return this.http.fetching(`/comment/${id}`, {
      method: "put",
      body: JSON.stringify({ body }),
    });
  }

  async DeleteComment(id) {
    return this.http.fetching(`/comment/${id}`, { method: "delete" });
  }
}
