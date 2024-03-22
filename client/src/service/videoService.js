export class VideoService {
  constructor(http) {
    this.http = http;
  }

  async getVideo() {
    return this.http.fetching("/video", { method: "get" });
  }

  async createVideo(data) {
    for (var key of data.keys()) {
      let val = data.get(key);
      if (key == "title" && (val == "" || val.length == 0 || val.length > 20))
        throw new Error("제목은 1자 이상 20자 이하여야 합니다-title");
      else if (key == "coversong" && !JSON.parse(val).valid)
        throw new Error("커버송은 필수사항 입니다-coversong");
      else if (key == "release" && val == null)
        throw new Error("공개상태는 필수사항 입니다-release");
    }

    return this.http.fetching("/video", {
      method: "post",
      body: data,
      headers: { "Content-type": "multipart/form-data" },
    });
  }

  async modifyVideo(id, data) {
    return this.http.fetching(`/video/${id}`, {
      method: "put",
      body: data,
      headers: { "Content-type": "multipart/form-data" },
    });
  }

  async deleteVideo(id) {}

  async getCoversong(query) {
    return this.http.fetching("/coversong", {
      method: "post",
      body: JSON.stringify({ query }),
    });
  }

  async VideoFileValidate(file) {
    const video = document.createElement("video");
    let file_type = file.type.split("/").pop();
    if (file_type !== "mp4") throw new Error("비디오 파일형식이 아닙니다-file");

    var reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onerror = (err) => reject("로드 중 오류발생-file");
      reader.onload = () => {
        video.src = reader.result;
        video.onloadedmetadata = (e) => {
          let duration = e.target.duration;
          duration > 14 && duration < 960
            ? resolve(reader.result)
            : reject("비디오 영상길이는 15초 이상 15분 이하만 가능합니다-file");
        };
      };
    });
  }
}
