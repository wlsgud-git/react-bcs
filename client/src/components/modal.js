// import { useState } from "react";
import {} from "react-router-dom";
import { useRef, createRef, useState } from "react";

import "../css/modal.css";
import { Videomake } from "./videomake.js";
import { Follows } from "./follows.js";
import { ProfileEdit } from "./profileEdit.js";
import { forwardRef } from "react";

export function Modal({
  IsmodalOpen,
  aboutModal,
  modalControl,
  videoService,
  user,
}) {
  return (
    <section
      className="modal_wrap"
      style={{ display: IsmodalOpen ? "flex" : "none" }}
    >
      <Videomake
        IsmodalOpen={IsmodalOpen}
        aboutModal={aboutModal}
        modalControl={modalControl}
        videoService={videoService}
        user={user}
      />
      <Follows
        IsmodalOpen={IsmodalOpen}
        aboutModal={aboutModal}
        modalControl={modalControl}
      />
      <ProfileEdit
        user={user}
        IsmodalOpen={IsmodalOpen}
        aboutModal={aboutModal}
        modalControl={modalControl}
      />
    </section>
  );
}
