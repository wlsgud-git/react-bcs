import { forwardRef, useEffect, useRef, useState } from "react";
import "../css/videomake.css";
// import { HttpClient } from "./network/http.js";

// let httpClient = new HttpClient();

export function Videomake({
  IsmodalOpen,
  aboutModal,
  user,
  modalControl,
  videoService,
}) {
  const videoFileInput = useRef();

  const [videoFileDisplay, SetvideoFileDisplay] = useState(true);
  const [videoFileError, SetvideoFileError] = useState({
    state: false,
    message: "",
  });

  const [videoFile, SetvideoFile] = useState(null);
  const [videoTitle, SetvideoTitle] = useState("");
  const [coversongList, SetcoversongList] = useState([]);
  const [coversonginfo, Setcoversonginfo] = useState({
    query: "",
    state: false,
    id: "",
    title: "",
    artists: [],
    thumbnail_url: "",
  });
  const [release, Setrelease] = useState(false);

  async function VideoFileValidate(e) {
    let video = document.querySelector(".md_preview_video");
    let file = e.target.files[0];

    const result = await videoService.VideoFileValidate(video, file);

    if (result.status == 400) {
      SetvideoFileError((err) => ({
        ...err,
        state: true,
        message: result.message,
      }));
    } else {
      SetvideoFile(file);
      SetvideoFileDisplay(false);
    }
  }

  async function VideoUpload(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("video", videoFile);
    formData.append("title", videoTitle);
    formData.append("coversong", JSON.stringify(coversonginfo));
    formData.append("release", release);
    formData.append("user_id", user.id);

    // await videoService
    //   .createVideo(formData)
    //   .then((data) => console.log(data))
    //   .catch((err) => console.log(err));
  }

  async function Coversongs(e) {
    let query = e.target.value;

    if (query == "") return;

    await videoService
      .getCoversong(query)
      .then((data) => {
        SetcoversongList(data.data.list);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div
      className="md_bcs_video_modal"
      style={{
        display: IsmodalOpen && aboutModal == "videomake" ? "flex" : "none",
      }}
    >
      {/* <!-- 비디오 윗부분 --> */}
      <div className="md_video_top_section">
        <div className="md_video_user_section">
          <span className="md_upload_text">동영상 업로드</span>
        </div>

        <span
          className="md_video_modal_close"
          onClick={() => modalControl("hide", "videomake")}
        >
          X
        </span>
      </div>

      {/* <!-- 비디오 영상 파일 부분 --> */}
      <div
        className="md_video_upload_file_section"
        style={{ display: videoFileDisplay ? "flex" : "none" }}
      >
        <div className="md_video_upload_top">
          <button className="md_video_file_upload_btn">
            <i className="fa-solid fa-upload"></i>
          </button>
        </div>

        <div className="md_video_upload_mid">
          <p className="md_video_file_recommend">동영상 파일을 업로드하세요</p>
          <p className="md_video_file_caution">
            영상길이는 최소 15초 최대 15분 59초이며 파일형식은 mp4형식입니다
          </p>
          <p
            className="md_video_file_err"
            style={{ display: videoFileError.state ? "block" : "none" }}
          >
            {videoFileError.message}
          </p>
        </div>

        <div className="md_video_upload_bottom">
          <button
            className="md_video_file_btn"
            onClick={() => videoFileInput.current.click()}
          >
            파일선택
          </button>
          <input
            ref={videoFileInput}
            type="file"
            className="md_video_file_input"
            style={{ display: "none" }}
            onChange={VideoFileValidate}
          />
        </div>
      </div>

      {/* <!-- 이부분 --> */}
      <div
        className="md_video_upload_detail_section"
        style={{ display: !videoFileDisplay ? "flex" : "none" }}
      >
        {/* <!-- 비디오 가운데 부분 --> */}
        <div className="md_video_infomation_section">
          <form
            action="#"
            method="post"
            className="md_video_make_form"
            onSubmit={VideoUpload}
          >
            <div className="md_video_preview_box">
              <div className="md_video_preview">
                <video className="md_preview_video"></video>
              </div>
            </div>

            <div className="md_video_detail_box">
              {/* <!-- 비디오 제목 --> */}
              <div
                className="md_video_detail_title"
                style={{
                  borderColor: videoTitle.length <= 20 ? "black" : "red",
                }}
              >
                <div className="md_vd_title_box">
                  <span className="md_vd_title">제목</span>
                  <span className="md_vd_title_len">
                    {videoTitle.length} / 20
                  </span>
                </div>

                <textarea
                  value={videoTitle}
                  spellCheck="off"
                  onChange={(e) => {
                    SetvideoTitle(e.target.value);
                  }}
                  className="md_vd_title_input"
                ></textarea>
              </div>

              {/* <!-- 커버송 --> */}
              <div className="md_video_detail_cover_song">
                <div className="md_vd_cover_song_input_box">
                  <ul
                    className="md_vd_cover_song_recommand"
                    style={{ display: coversonginfo.state ? "flex" : "none" }}
                  >
                    {coversongList.map((li, index) => (
                      <li
                        className="md_coversong_list"
                        key={index}
                        onMouseDown={() =>
                          Setcoversonginfo({
                            ...coversonginfo,
                            query: li.title,
                            id: li.id,
                            title: li.title,
                            artists: li.artists,
                            thumbnail_url: li.thumbnail_url,
                          })
                        }
                      >
                        <span className="md_coversong_image">
                          {" "}
                          <img src={li.thumbnail_url}></img>{" "}
                        </span>
                        <span className="md_coversong_title"> {li.title} </span>
                        <span className="md_coversong_artists">
                          {li.artists.map((man, idx) => (
                            <span className="artist_name" key={idx}>
                              {man}{" "}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <input
                    type="text"
                    spellCheck="false"
                    placeholder="커버송 정보를 입력하세요"
                    value={coversonginfo.query}
                    onBlur={() =>
                      Setcoversonginfo({ ...coversonginfo, state: false })
                    }
                    onChange={(e) => {
                      Setcoversonginfo({
                        ...coversonginfo,
                        query: e.target.value,
                        state: true,
                      });
                      Coversongs(e);
                    }}
                    className="md_vd_cover_song_input"
                  />
                </div>

                <div className="md_vd_cover_song_clear">
                  <button
                    className="md_vd_cover_song_clear_btn"
                    onClick={() =>
                      Setcoversonginfo({ ...coversonginfo, query: "" })
                    }
                  >
                    X
                  </button>
                </div>
              </div>

              {/* <!-- 비디오 공개여부 --> */}
              <div className="md_vd_release_choice">
                <span className="md_vd_release_text">공개 상태</span>

                <div className="md_vd_release_box">
                  <div className="md_release_on">
                    <input
                      type="radio"
                      name="release_c"
                      className="md_release_radio"
                      value="release"
                      onChange={() => Setrelease(true)}
                    />

                    <div className="md_release_intro">
                      <span className="md_release">공개</span>
                      <span>모든 사용자가 영상을 볼 수 있습니다</span>
                    </div>
                  </div>

                  <div className="md_release_no">
                    <input
                      type="radio"
                      name="release_c"
                      className="md_release_radio"
                      value="norelease"
                      onChange={() => Setrelease(false)}
                    />

                    <div className="md_release_intro">
                      <span className="md_norelease">비공개</span>
                      <span>팔로우된 사용자만 영상을 볼 수 있습니다</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* <!-- 비디오 아래 부분 --> */}
        <div className="md_video_bottom_section">
          <button
            className="md_video_upload_btn"
            type="submit"
            onClick={VideoUpload}
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
}
