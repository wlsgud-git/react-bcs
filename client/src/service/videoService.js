export class VideoService {
  constructor(http) {
    this.http = http;
  }

  async getVideo() {
    return this.http.fetching("/video", { method: "get" });
  }

  async createVideo(data) {
    // console.log("hi");
    return this.http.fetching("/video", {
      method: "post",
      body: data,
      // JSON.stringify({ hi: "hi" })
    });
  }

  async modifyVideo() {}

  async deleteVideo(id) {}

  async VideoFileValidate(video, file) {
    let file_type = file.type.split("/").pop();
    if (file_type !== "mp4")
      return { status: 400, message: "파일형식이 올바르지 않습니다" };

    var reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onerror = (err) => reject({ status: 400, message: err.message });
      reader.onload = () => {
        video.src = reader.result;
        video.controls = true;
        video.preload = "auto";

        video.onloadedmetadata = (e) => {
          let duration = e.target.duration;
          resolve(
            duration > 14 && duration < 960
              ? { status: 200, message: "ok" }
              : { status: 400, message: "영상 길이가 올바르지 않습니다" }
          );
        };
      };
    });
  }

  async getCoversong(query) {
    return this.http.fetching("/coversong", {
      method: "post",
      body: JSON.stringify({ query }),
    });
  }
}
