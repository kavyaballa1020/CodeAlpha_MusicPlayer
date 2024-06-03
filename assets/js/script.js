'use strict';

/**
 * all music information
 */
const ncsTracks = [
  {
    backgroundImage: "https://i1.sndcdn.com/artworks-000198573644-ayznj3-t500x500.jpg",
    posterUrl: "https://i1.sndcdn.com/artworks-000198573644-ayznj3-t500x500.jpg",
    title: "Warriyo - Mortals (feat. Laura Brehm) [NCS Release]",
    album: "NCS",
    year: 2016,
    artist: "Warriyo",
    musicPath: "./assets/music/Warriyo - Mortals (feat. Laura Brehm) [NCS Release].mp3"
  },
  {
    backgroundImage: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/378/1000x0/dreamer-1680825643-xI8uIuthxk.jpg",
    posterUrl: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/378/1000x0/dreamer-1680825643-xI8uIuthxk.jpg",
    title: "Alan Walker - Dreamer [NCS Release]",
    album: "NCS",
    year: 2023,
    artist: "Alan Walker",
    musicPath: "./assets/music/Alan Walker - Dreamer [NCS Release].mp3"
  },
  {
    backgroundImage: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/107/1000x0/rubik-1586946615-pjMMuCVdoZ.jpg",
    posterUrl: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/107/1000x0/rubik-1586946615-pjMMuCVdoZ.jpg",
    title: "Distrion & Electro-Light - Rubik [NCS Release]",
    album: "NCS",
    year: 2015,
    artist: "Distrion & Electro-Light",
    musicPath: "./assets/music/Distrion & Electro-Light - Rubik [NCS Release].mp3"
  },
  {
    backgroundImage: "https://linkstorage.linkfire.com/medialinks/images/b89f7721-6c29-4b24-9eb5-d520be4b9887/artwork-440x440.jpg",
    posterUrl: "https://linkstorage.linkfire.com/medialinks/images/b89f7721-6c29-4b24-9eb5-d520be4b9887/artwork-440x440.jpg",
    title: "Janji - Heroes Tonight (feat. Johnning) [NCS Release]",
    album: "NCS",
    year: 2015,
    artist: "Janji",
    musicPath: "./assets/music/Janji - Heroes Tonight (feat. Johnning) [NCS Release].mp3"
  },
  {
    backgroundImage: "https://i1.sndcdn.com/artworks-000175505526-iwx2m4-t500x500.jpg",
    posterUrl: "https://i1.sndcdn.com/artworks-000175505526-iwx2m4-t500x500.jpg",
    title: "JPB - High [NCS Release]",
    album: "NCS",
    year: 2016, 
    artist: "JPB",
    musicPath: "./assets/music/JPB - High [NCS Release].mp3"
  }
];

/**
 * add eventListnere on all elements that are passed
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

/**
 * PLAYLIST
 * add all music in playlist, from 'ncsTracks'
 */
const playlist = document.querySelector("[data-music-list]");

for (let i = 0, len = ncsTracks.length; i < len; i++) {
  playlist.innerHTML += `
  <li>
    <button class="music-item ${i === 0 ? "playing" : ""}" data-playlist-toggler data-playlist-item="${i}">
      <img src="${ncsTracks[i].posterUrl}" width="800" height="800" alt="${ncsTracks[i].title} Album Poster"
        class="img-cover">
      <div class="item-icon">
        <span class="material-symbols-rounded">equalizer</span>
      </div>
    </button>
  </li>
  `;
}

/**
 * PLAYLIST MODAL SIDEBAR TOGGLE
 * show 'playlist' modal sidebar when click on playlist button in top app bar
 * and hide when click on overlay or any playlist-item
 */
const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
}

addEventOnElements(playlistTogglers, "click", togglePlaylist);

/**
 * PLAYLIST ITEM
 * remove active state from last time played music
 * and add active state in clicked music
 */
const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
}

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});

/**
 * PLAYER
 * change all visual information on player, based on current music
 */
const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const audioSource = new Audio(ncsTracks[currentMusic].musicPath);

const changePlayerInfo = function () {
  playerBanner.src = ncsTracks[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${ncsTracks[currentMusic].title} Album Poster`);
  document.body.style.backgroundImage = `url(${ncsTracks[currentMusic].backgroundImage})`;
  playerTitle.textContent = ncsTracks[currentMusic].title;
  playerAlbum.textContent = ncsTracks[currentMusic].album;
  playerYear.textContent = ncsTracks[currentMusic].year;
  playerArtist.textContent = ncsTracks[currentMusic].artist;

  audioSource.src = ncsTracks[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
}

addEventOnElements(playlistItems, "click", changePlayerInfo);

/** update player duration */
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/** pass seconds and get timecode format */
const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - (minutes * 60));
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
}

const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
}

audioSource.addEventListener("loadeddata", updateDuration);

/**
 * PLAY MUSIC
 * play and pause music when click on play button
 */
const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
}

playBtn.addEventListener("click", playMusic);

/** update running time while playing music */
const playerRunningTime = document.querySelector("[data-running-time]");

const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
}

/**
 * RANGE FILL WIDTH
 * change 'rangeFill' width, while changing range value
 */
const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
}

addEventOnElements(ranges, "input", updateRangeFill);

/**
 * SEEK MUSIC
 * seek music while changing player seek range
 */
const seek = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
}

playerSeekRange.addEventListener("input", seek);

/**
 * END MUSIC
 */
const isMusicEnd = function () {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
}

/**
 * SKIP TO NEXT MUSIC
 */
const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= ncsTracks.length - 1 ? currentMusic = 0 : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipNextBtn.addEventListener("click", skipNext);

/**
 * SKIP TO PREVIOUS MUSIC
 */
const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? currentMusic = ncsTracks.length - 1 : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipPrevBtn.addEventListener("click", skipPrev);

/**
 * SHUFFLE MUSIC
 */
/** get random number for shuffle */
const getRandomMusic = () => Math.floor(Math.random() * ncsTracks.length);

const shuffleMusic = () => {
  let randomMusic = getRandomMusic();

  while (currentMusic === randomMusic) {
    randomMusic = getRandomMusic();
  }
  currentMusic = randomMusic;
}

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  playerShuffleBtn.classList.toggle("active");
  isShuffled = isShuffled ? false : true;
}

playerShuffleBtn.addEventListener("click", shuffle);

/**
 * REPEAT MUSIC
 */
const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
}

playerRepeatBtn.addEventListener("click", repeat);

/**
 * MUSIC VOLUME
 * increase or decrease music volume when change the volume range
 */
const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
}

playerVolumeRange.addEventListener("input", changeVolume);

/**
 * MUTE MUSIC
 */
const muteVolume = function () {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
}

playerVolumeBtn.addEventListener("click", muteVolume);
