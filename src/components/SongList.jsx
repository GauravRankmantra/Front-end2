import React, { useState } from "react";
import style from "../assets/css/Style.module.css";

const SongList = ({songs ,artist}) => {

    
  return (
    <>
      <div className={style.ms_album_single_wrapper}>
        {/* <div className="album_single_data">
          <div className="album_single_img">
            <img src="https://dummyimage.com/240x240" alt="" className="img-fluid" />
          </div>
          <div className="album_single_text">
            <h2>Dream Your Moments</h2>
            <p className="singer_name">By - Ava Cornish, Brian Hill</p>
            <div className="album_feature">
              <a href="#" className="album_date">5 song | 25:10</a>
              <a href="#" className="album_date">Released March 23, 2022 | Abc Music Company</a>
            </div>
            <div className="album_btn">
              <a href="#" className="ms_btn play_btn">
                <span className="play_all">
                  <img src="assets/images/svg/play_all.svg" alt="" /> Play All
                </span>
                <span className="pause_all">
                  <img src="assets/images/svg/pause_all.svg" alt="" /> Pause
                </span>
              </a>
              <a href="#" className="ms_btn">
                <span className="play_all">
                  <img src="assets/images/svg/add_q.svg" alt="" /> Add To Queue
                </span>
              </a>
            </div>
          </div>
          <div className="album_more_optn ms_more_icon">
            <span>
              <img src="assets/images/svg/more.svg" alt="" />
            </span>
          </div>
          <ul className="more_option">
            <li><a href="#"><span className="opt_icon"><span className="icon icon_fav"></span></span>Add To Favourites</a></li>
            <li><a href="#"><span className="opt_icon"><span className="icon icon_queue"></span></span>Add To Queue</a></li>
            <li><a href="#"><span className="opt_icon"><span className="icon icon_dwn"></span></span>Download Now</a></li>
            <li><a href="#"><span className="opt_icon"><span className="icon icon_playlst"></span></span>Add To Playlist</a></li>
            <li><a href="#"><span className="opt_icon"><span className="icon icon_share"></span></span>Share</a></li>
          </ul>
        </div> */}

        {/* Song List */}
        <div className={style.album_inner_list}>
          <div className={style.album_list_wrapper}>
            <ul className={style.album_list_name}>
              <li>#</li>
              <li>Song Title</li>
              <li>Artist</li>
              <li className="text-center">Duration</li>
              <li className="text-center">Add To Favourites</li>
              <li className="text-center">More</li>
            </ul>
            {/* Example Song List */}
            {renderSongs(songs,artist)}
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to render song items dynamically
const renderSongs = (songs,artist) => {


  return songs.map((song, index) => (
    <ul key={song.id} >
      <li>
        <a href="#">
          <span className={style.play_no}>{`0${index + 1}`}</span>
          <span className={style.play_hover}></span>
        </a>
      </li>
      <li>
        <a href="#">{song.title}</a>
      </li>
      <li>
        <a href="#">{artist}</a>
      </li>
      <li className="text-center">
        <a href="#">{song.duration}</a>
      </li>
      <li className="text-center">
        <a href="#">
          <span className={`${style.ms_icon1} ${style.ms_fav_icon}`}></span>
        </a>
      </li>
      <li className="text-center ms_more_icon">
        <a href="#">
          <span className="ms_icon1 ms_active_icon"></span>
        </a>
        <ul className={style.more_option}>
          <li>
            <a href="#">
              <span className={style.opt_icon}>
                <span className={`${style.icon} ${style.icon_fav}`}></span>
              </span>
              Add To Favourites
            </a>
          </li>
          <li>
            <a href="#">
              <span className={style.opt_icon}>
                <span className={`${style.icon} ${style.icon_queue}`}></span>
              </span>
              Add To Queue
            </a>
          </li>
          <li>
            <a href="#">
              <span className={style.opt_icon}>
                <span className={`${style.icon} ${style.icon_dwn}`}></span>
              </span>
              Download Now
            </a>
          </li>
          <li>
            <a href="#">
              <span className={style.opt_icon}>
                <span className={`${style.icon} ${style.icon_playlst}`}></span>
              </span>
              Add To Playlist
            </a>
          </li>
          <li>
            <a href="#">
              <span className={style.opt_icon}>
                <span className={`${style.icon} ${style.icon_share}`}></span>
              </span>
              Share
            </a>
          </li>
        </ul>
      </li>
    </ul>
  ));
};

export default SongList;
