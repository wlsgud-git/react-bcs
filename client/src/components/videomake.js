import { forwardRef, useEffect, useRef, useState } from "react";
import "../css/videomake.css";

export function Videomake({
  IsmodalOpen,
  aboutModal,
  user,
  modalControl,
  videoService,
}) {
  let video_file_form = {
    file: null,
    preview_src: "",
    iserror: false,
    isLoading: false,
    errorMessage: "",
    state: false,
  };
  let video_info_form = {
    isError: false,
    isLoading: false,
    title: "",
    release: null,
  };
  let coversong_info_form = {
    query: "",
    state: false,
    valid: false,
    id: "",
    title: "",
    artists: [],
    thumbnail_url: "",
  };

  const videoFileInput = useRef();
  const coversongInput = useRef();
  const videoTitleInput = useRef();

  const [coversongList, SetcoversongList] = useState([]);
  const [coversongInfo, SetcoversongInfo] = useState(coversong_info_form);
  const [videoFile, SetvideoFile] = useState(video_file_form);
  const [videoInfo, SetvideoInfo] = useState(video_info_form);

  function reset() {
    SetvideoInfo(video_info_form);
    SetvideoFile(video_file_form);
    SetcoversongInfo(coversong_info_form);
  }

  function errorHandle(err) {
    let [message, type] = err.split("-");

    switch (type) {
      case "file":
        SetvideoFile((c) => ({
          ...c,
          iserror: true,
          errorMessage: message,
          isLoading: false,
        }));
        break;
      case "title":
        alert(message);
        SetvideoInfo((c) => ({ ...c, title: "" }));
        videoTitleInput.current.focus();
        break;
      case "coversong":
        alert(message);
        SetcoversongInfo((c) => ({ ...c, query: "" }));
        coversongInput.current.focus();
        break;
      case "release":
        alert(message);
        break;

      default:
        console.log("happt");
    }
  }

  async function VideoFileValidate(e) {
    let file = e.target.files[0];

    SetvideoFile((c) => ({ ...c, isLoading: true, iserror: false }));
    await videoService
      .VideoFileValidate(file)
      .then((data) =>
        SetvideoFile((c) => ({
          ...c,
          preview_src: data,
          file,
          isLoading: false,
          state: true,
        }))
      )
      .catch((err) => errorHandle(err));
  }

  async function VideoUpload(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("video", videoFile.file);
    formData.append("title", videoInfo.title);
    formData.append("coversong", JSON.stringify(coversongInfo));
    formData.append("release", videoInfo.release);
    formData.append("user_id", user.id);

    SetvideoInfo((c) => ({ ...c, isLoading: true }));
    await videoService
      .createVideo(formData)
      .then((data) => {
        alert("업로드 되었습니다");
        modalControl("hide", "videomake");
        reset();
      })
      .catch((err) => {
        errorHandle(err.message);
        SetvideoInfo((c) => ({ ...c, isLoading: false }));
      });
  }

  async function Coversongs(e) {
    let query = e.target.value;

    if (query == "") return;

    await videoService
      .getCoversong(query)
      .then((data) => {
        SetcoversongList(data.list);
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
      <div
        className="video_loading_block"
        style={{ display: videoInfo.isLoading ? "flex" : "none" }}
      >
        업로드 중....
      </div>

      {/* <!-- 비디오 윗부분 --> */}
      <div className="md_video_top_section">
        <div className="md_video_user_section">
          <span className="md_upload_text">동영상 업로드</span>
        </div>

        <span
          className="md_video_modal_close"
          onClick={() => {
            modalControl("hide", "videomake");
            reset();
          }}
        >
          X
        </span>
      </div>

      {/* <!-- 비디오 영상 파일 부분 --> */}
      <div
        className="md_video_upload_file_section"
        style={{ display: videoFile.state ? "none" : "flex" }}
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
            style={{ display: videoFile.iserror ? "block" : "none" }}
          >
            {videoFile.iserror && videoFile.errorMessage}
          </p>
        </div>

        <div className="md_video_upload_bottom">
          <button
            className="md_video_file_btn"
            onClick={() => videoFileInput.current.click()}
            style={{ cursor: videoFile.isLoading ? "not-allowed" : "pointer" }}
          >
            파일선택
          </button>
          <input
            ref={videoFileInput}
            type="file"
            accept="video/mp4"
            className="md_video_file_input"
            style={{ display: "none" }}
            onChange={VideoFileValidate}
          />
        </div>
      </div>

      {/* <!-- 이부분 --> */}
      <div
        className="md_video_upload_detail_section"
        style={{ display: videoFile.state ? "flex" : "none" }}
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
                <video
                  className="md_preview_video"
                  controls
                  src={videoFile.preview_src}
                ></video>
              </div>
            </div>

            <div className="md_video_detail_box">
              {/* <!-- 비디오 제목 --> */}
              <div className="md_video_detail_title">
                <div className="md_vd_title_box">
                  <span className="md_vd_title">제목</span>
                  <span
                    className="md_vd_title_len"
                    style={{
                      color: videoInfo.title.length > 20 ? "red" : "black",
                    }}
                  >
                    {videoInfo.title.length} / 20
                  </span>
                </div>

                <textarea
                  value={videoInfo.title}
                  ref={videoTitleInput}
                  spellCheck="off"
                  onChange={(e) =>
                    SetvideoInfo((c) => ({ ...c, title: e.target.value }))
                  }
                  className="md_vd_title_input"
                ></textarea>
              </div>

              {/* <!-- 커버송 --> */}
              <div className="md_video_coversong_container">
                <div className="md_video_coversong_infomation_container">
                  <span className="md_coversong_img_preview">
                    <img
                      style={{ width: "100%", height: "100%" }}
                      src={coversongInfo.thumbnail_url}
                      title={`${
                        coversongInfo.title
                      } - ${coversongInfo.artists.join(",")}`}
                    />
                  </span>
                </div>

                <div className="md_video_detail_cover_song">
                  <div className="md_vd_cover_song_input_box">
                    <ul
                      className="md_vd_cover_song_recommand"
                      style={{ display: coversongInfo.state ? "flex" : "none" }}
                    >
                      {coversongList.map((li, index) => (
                        <li
                          className="md_coversong_list"
                          key={index}
                          onMouseDown={() =>
                            SetcoversongInfo({
                              ...coversongInfo,
                              query: li.title,
                              valid: true,
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
                          <span className="md_coversong_title">
                            {" "}
                            {li.title}{" "}
                          </span>
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
                      ref={coversongInput}
                      spellCheck="false"
                      placeholder="커버송 정보를 입력하세요"
                      value={coversongInfo.query}
                      onBlur={() =>
                        SetcoversongInfo({ ...coversongInfo, state: false })
                      }
                      onChange={(e) => {
                        SetcoversongInfo({
                          ...coversongInfo,
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
                      onClick={() => {
                        SetcoversongInfo({ ...coversongInfo, query: "" });
                        coversongInput.current.focus();
                      }}
                    >
                      X
                    </button>
                  </div>
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
                      onChange={() =>
                        SetvideoInfo((c) => ({ ...c, release: true }))
                      }
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
                      onChange={() =>
                        SetvideoInfo((c) => ({ ...c, release: false }))
                      }
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
