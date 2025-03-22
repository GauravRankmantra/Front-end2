import React from "react";
import style from "../assets/css/Style.module.css";
import "swiper/css";
import "swiper/css/navigation";

const Test = () => {
  return (
    <div>
      <div class="ms_fea_album_slider padder_top10 ">
        <div class="ms_heading">
          <h1>Featured Albums</h1>
          <span class="veiw_all">
            <a href="#">view more</a>
          </span>
        </div>
        <div class="ms_album_slider swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="ms_rcnt_box">
                <div class="ms_rcnt_box_img">
                  <img src="https://dummyimage.com/252x252" alt="" />
                  <div class="ms_main_overlay">
                    <div class="ms_box_overlay"></div>
                    <div class="ms_more_icon">
                      <img src="assets/images/svg/more.svg" alt="" />
                    </div>
                    <ul class="more_option">
                      <li>
                        <a href="#">
                          <span class="opt_icon">
                            <span class="icon icon_fav"></span>
                          </span>
                          Add To Favourites
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span class="opt_icon">
                            <span class="icon icon_queue"></span>
                          </span>
                          Add To Queue
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span class="opt_icon">
                            <span class="icon icon_dwn"></span>
                          </span>
                          Download Now
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span class="opt_icon">
                            <span class="icon icon_playlst"></span>
                          </span>
                          Add To Playlist
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span class="opt_icon">
                            <span class="icon icon_share"></span>
                          </span>
                          Share
                        </a>
                      </li>
                    </ul>
                    <div class="ms_play_icon">
                      <img src="assets/images/svg/play.svg" alt="" />
                    </div>
                  </div>
                </div>
                <div class="ms_rcnt_box_text">
                  <h3>
                    <a href="album_single.html">Bloodlust</a>
                  </h3>
                  <p>Ava Cornish & Brian Hill</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div class="swiper-button-next3 slider_nav_next"></div>
        <div class="swiper-button-prev3 slider_nav_prev"></div>
      </div>
    </div>
  );
};

export default Test;
