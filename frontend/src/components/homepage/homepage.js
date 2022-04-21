import "./homepage.css";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/custom-animations/cube-animation.css";
import { useState } from "react";
import { Login } from "./login";
import { Signup } from "./signup";
import { useSelector } from "react-redux";
export const Homepage = () => {
  const [flag, setflag] = useState(false);
  const userstatus = useSelector((state) => state.account.UserStatus);

  return (
    <div className="homepage">
      <div className="homepage-1">
        <video className="bg-video" autoPlay loop muted>
          <source
            src={
              "https://res.cloudinary.com/cloudyimg/video/upload/v1634667182/choco4k_xfrzou.mp4"
            }
            type="video/mp4"
          />
        </video>

        <div className="intro">
          {/* <img src={require("../../media/logo.png").default}></img> */}
          <div>
            <h1 style={{ color: "white" }}>
              Taste the magic spell of the finest cocoa cast by your CHOCO
              WIZARD
            </h1>
          </div>

          <div>
            {userstatus ? (
              ""
            ) : (
              <div className="flip-card">
                <div
                  className="flip-card-inner"
                  id={flag ? "flip" : "flip-reverse"}
                >
                  <Login setflag={setflag} flag={flag} />
                  <Signup setflag={setflag} flag={flag} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="homepage-2">
        <CarouselDiv />
      </div>
      <div className="homepage-3"></div>
    </div>
  );
};

const CarouselDiv = () => {
  const AutoplaySlider = withAutoplay(AwesomeSlider);

  let slides = [
    "https://res.cloudinary.com/cloudyimg/image/upload/v1635148147/sprinklecups_eacktb.jpg",
    "https://res.cloudinary.com/cloudyimg/image/upload/v1635148145/gingerbread_nd1uz1.jpg",
    "https://res.cloudinary.com/cloudyimg/image/upload/v1635148145/sandwich_xcfazb.jpg",
    "https://res.cloudinary.com/cloudyimg/image/upload/v1635148145/macaroons_d8u7li.jpg",
    "https://res.cloudinary.com/cloudyimg/image/upload/v1635148145/darkcorners_h3btvq.jpg",
    "https://res.cloudinary.com/cloudyimg/image/upload/v1635148140/chocopie_kpqrte.jpg",
    "https://res.cloudinary.com/cloudyimg/image/upload/v1635148145/strawberrydips_wqz0yv.jpg",
  ];

  return (
    <div>
      <AutoplaySlider
        play={true}
        cancelOnInteraction={false} // should stop playing on user interaction
        interval={3000}
        className="auto-slide"
      >
        {slides.map((item, index) => {
          return (
            <div key={index}>
              <img src={item} className="slide-image"></img>
            </div>
          );
        })}
      </AutoplaySlider>
    </div>
  );
};
