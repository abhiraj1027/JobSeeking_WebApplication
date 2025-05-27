import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; CS2025TID32</div>
      <div>
        <Link to={"https://www.facebook.com/satiengg.in/"} target="_blank">
          <FaFacebookF />
        </Link>
        <Link to={"https://www.youtube.com/@sati.vidisha"} target="_blank">
          <FaYoutube />
        </Link>
        <Link to={"https://www.linkedin.com/school/satiengg/posts/?feedView=all"} target="_blank">
          <FaLinkedin />
        </Link>
        <Link to={"https://www.instagram.com/satiengg.in/"} target="_blank">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
