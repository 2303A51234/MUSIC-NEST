const categorySongs = {
  "J-Pop": [
    { name: "Scent of You", file: "songs/scentofyou.mp3", category: "J-Pop", img: "images/jpop.jpg" },
    { name: "Night Dancer", file: "songs/nightdancer.mp3", category: "J-Pop", img: "images/jpop.jpg" },
    { name: "Matsuri", file: "songs/matsuri.mp3", category: "J-Pop", img: "images/jpop.jpg" },
    { name: "Suzume", file: "songs/suzume.mp3", category: "J-Pop", img: "images/jpop.jpg" },
    { name: "The Final Countdown", file: "songs/finalcountdown.mp3", category: "J-Pop", img: "images/jpop.jpg" }
  ],

  "K-Pop": [
    { name: "Wannabe", file: "songs/wannabe.mp3", category: "K-Pop", img: "images/kpop.jpg" },
    { name: "Kill This Love", file: "songs/killthislove.mp3", category: "K-Pop", img: "images/kpop.jpg" },
    { name: "Mic Drop", file: "songs/micdrop.mp3", category: "K-Pop", img: "images/kpop.jpg" },
    { name: "Still With You", file: "songs/stillwithyou.mp3", category: "K-Pop", img: "images/kpop.jpg" },
    { name: "OX1 Lovesong", file: "songs/ox1lovesong.mp3", category: "K-Pop", img: "images/kpop.jpg" }
  ],

  "Indian": [
    { name: "Darshana", file: "songs/darshana.mp3", category: "Indian", img: "images/indian.jpg" },
    { name: "Sahiba", file: "songs/sahiba.mp3", category: "Indian", img: "images/indian.jpg" },
    { name: "Vibe Undi", file: "songs/vibeundi.mp3", category: "Indian", img: "images/indian.jpg" },
    { name: "Aasa Kooda", file: "songs/aasakooda.mp3", category: "Indian", img: "images/indian.jpg" },
    { name: "Kathakaadhey", file: "songs/kathakaadhey.mp3", category: "Indian", img: "images/indian.jpg" }
  ],

  "English": [
    { name: "The Fate of Ophelia", file: "songs/fateofophelia.mp3", category: "English", img: "images/english.jpg" },
    { name: "Woman", file: "songs/woman.mp3", category: "English", img: "images/english.jpg" },
    { name: "We Don't Talk Anymore", file: "songs/wedonttalkanymore.mp3", category: "English", img: "images/english.jpg" },
    { name: "Die With A Smile", file: "songs/diewithasmile.mp3", category: "English", img: "images/english.jpg" },
    { name: "I Wanna Be Yours", file: "songs/iwannabeyours.mp3", category: "English", img: "images/english.jpg" }
  ],

  "T-Pop": [
    { name: "Teedee Tada", file: "songs/teedeetada.mp3", category: "T-Pop", img: "images/tpop.jpg" },
    { name: "Bad Shawty", file: "songs/badshawty.mp3", category: "T-Pop", img: "images/tpop.jpg" },
    { name: "Charm", file: "songs/charm.mp3", category: "T-Pop", img: "images/tpop.jpg" },
    { name: "Dum Dum", file: "songs/dumdum.mp3", category: "T-Pop", img: "images/tpop.jpg" },
    { name: "Only One", file: "songs/onlyone.mp3", category: "T-Pop", img: "images/tpop.jpg" }
  ]
};

let songs = [];
let current = 0;
let audio = new Audio();

function openCategory(name){
  window.location.href = "category.html?name=" + encodeURIComponent(name);
}

function getLikedSongs(){
  return JSON.parse(localStorage.getItem("likedSongs")) || [];
}

function saveLikedSongs(likedSongs){
  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
}

function getPlaylists(){
  return JSON.parse(localStorage.getItem("playlists")) || [];
}

function savePlaylists(playlists){
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

function getPlaylistSongs(){
  return JSON.parse(localStorage.getItem("playlistSongs")) || {};
}

function savePlaylistSongs(data){
  localStorage.setItem("playlistSongs", JSON.stringify(data));
}

function getRecentSongs(){
  return JSON.parse(localStorage.getItem("recentSongs")) || [];
}

function saveRecentSongs(recentSongs){
  localStorage.setItem("recentSongs", JSON.stringify(recentSongs));
}

function addToRecent(song){
  let recentSongs = getRecentSongs();
  recentSongs = recentSongs.filter(item => item.file !== song.file);
  recentSongs.unshift(song);

  if(recentSongs.length > 4){
    recentSongs = recentSongs.slice(0, 4);
  }

  saveRecentSongs(recentSongs);
}

function loadRecentSongs(){
  const container = document.getElementById("recentSongs");
  if(!container) return;

  const recentSongs = getRecentSongs();
  container.innerHTML = "";

  if(recentSongs.length === 0){
    container.innerHTML = `<div class="empty-box">No recently played songs yet.</div>`;
    return;
  }

  recentSongs.forEach(song => {
    container.innerHTML += `
      <div class="recent-card" onclick="openCategory('${song.category}')">
        <img src="${song.img}" alt="${song.name}">
        <div class="recent-overlay">
          <h3>${song.name}</h3>
          <p>${song.category}</p>
        </div>
      </div>
    `;
  });
}

function escapeQuotes(text){
  return text.replace(/'/g, "\\'");
}

function createPlaylist(){
  const input = document.getElementById("playlistName");
  if(!input) return;

  const name = input.value.trim();
  if(name === "") return;

  const playlists = getPlaylists();

  if(playlists.includes(name)){
    alert("Playlist already exists");
    return;
  }

  playlists.push(name);
  savePlaylists(playlists);

  let playlistSongs = getPlaylistSongs();
  if(!playlistSongs[name]){
    playlistSongs[name] = [];
    savePlaylistSongs(playlistSongs);
  }

  input.value = "";
  loadPlaylistPage();
}

function openPlaylist(name){
  window.location.href = "myplaylist.html?name=" + encodeURIComponent(name);
}

function loadPlaylistPage(){
  const list = document.getElementById("playlistList");
  if(!list) return;

  const playlists = getPlaylists();
  list.innerHTML = "";

  if(playlists.length === 0){
    list.innerHTML = `<div class="empty-box">No playlist yet. Create one above.</div>`;
    return;
  }

  playlists.forEach((playlist, index) => {
    list.innerHTML += `
      <li class="song" onclick="openPlaylist('${escapeQuotes(playlist)}')" style="cursor:pointer;">
        <div class="song-info">
          <img src="images/playlist.jpg" class="song-img" alt="playlist">
          <span style="font-size:22px; font-weight:700;">${playlist}</span>
        </div>
        <div class="song-actions">
          <button onclick="event.stopPropagation(); deletePlaylist(${index}, '${escapeQuotes(playlist)}')">Delete</button>
        </div>
      </li>
    `;
  });
}

function deletePlaylist(index, playlistName){
  const playlists = getPlaylists();
  playlists.splice(index, 1);
  savePlaylists(playlists);

  let playlistSongs = getPlaylistSongs();
  delete playlistSongs[playlistName];
  savePlaylistSongs(playlistSongs);

  loadPlaylistPage();
}

function loadPlaylistOptions(){
  const select = document.getElementById("playlistSelect");
  if(!select) return;

  const playlists = getPlaylists();
  select.innerHTML = "";

  if(playlists.length === 0){
    select.innerHTML = `<option value="">No playlists available</option>`;
    return;
  }

  playlists.forEach(name => {
    select.innerHTML += `<option value="${name}">${name}</option>`;
  });
}

function addSongToSelectedPlaylist(index){
  const select = document.getElementById("playlistSelect");
  if(!select || !songs[index]) return;

  const playlistName = select.value;
  if(!playlistName){
    alert("Create a playlist first");
    return;
  }

  let playlistSongs = getPlaylistSongs();

  if(!playlistSongs[playlistName]){
    playlistSongs[playlistName] = [];
  }

  const alreadyExists = playlistSongs[playlistName].some(song => song.file === songs[index].file);

  if(!alreadyExists){
    playlistSongs[playlistName].push(songs[index]);
    savePlaylistSongs(playlistSongs);
    alert("Song added to " + playlistName);
  } else {
    alert("Song already in playlist");
  }
}

function loadMyPlaylistPage(){
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  if(!name) return;

  const title = document.getElementById("playlistTitle");
  const bannerTitle = document.getElementById("playlistBannerTitle");
  const container = document.getElementById("playlistSongs");

  if(title) title.innerText = name;
  if(bannerTitle) bannerTitle.innerText = name;

  const playlistSongs = getPlaylistSongs();
  const songsInPlaylist = playlistSongs[name] || [];

  if(!container) return;
  container.innerHTML = "";

  if(songsInPlaylist.length === 0){
    container.innerHTML = `<div class="empty-box">No songs in this playlist yet.</div>`;
    setupPlayer();
    return;
  }

  songs = songsInPlaylist;
  current = 0;

  songsInPlaylist.forEach((song, index) => {
    container.innerHTML += `
      <div class="song">
        <div class="song-info">
          <img src="${song.img}" class="song-img" alt="${song.name}">
          <span>${song.name}</span>
        </div>
        <div class="song-actions">
          <button onclick="playSong(${index})">Play</button>
          <button onclick="playRemix(${index})">🎧 Remix</button>
          <button onclick="removeFromPlaylist('${escapeQuotes(name)}', ${index})">Remove</button>
        </div>
      </div>
    `;
  });

  setupPlayer();
}

function removeFromPlaylist(playlistName, index){
  let playlistSongs = getPlaylistSongs();
  if(!playlistSongs[playlistName]) return;

  playlistSongs[playlistName].splice(index, 1);
  savePlaylistSongs(playlistSongs);
  loadMyPlaylistPage();
}

function loadCategory(){
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  if(!name) return;

  const title = document.getElementById("title");
  const bannerTitle = document.getElementById("bannerTitle");
  const container = document.getElementById("songs");

  if(title) title.innerText = name;
  if(bannerTitle) bannerTitle.innerText = name;
  if(!container) return;

  songs = categorySongs[name] || [];
  current = 0;
  container.innerHTML = "";

  songs.forEach((song, index) => {
    const likedSongs = getLikedSongs();
    const isLiked = likedSongs.some(item => item.file === song.file);

    container.innerHTML += `
      <div class="song">
        <div class="song-info">
          <img src="${song.img}" class="song-img" alt="${song.name}">
          <span>${song.name}</span>
        </div>
        <div class="song-actions">
          <button onclick="playSong(${index})">Play</button>
          <button onclick="playRemix(${index})">🎧 Remix</button>
          <button onclick="addSongToSelectedPlaylist(${index})">Add to Playlist</button>
          <button onclick="toggleLike(${index}, this)">${isLiked ? "❤️" : "🤍"}</button>
        </div>
      </div>
    `;
  });

  loadPlaylistOptions();
  setupPlayer();
}

function toggleLike(index, button){
  const selectedSong = songs[index];
  if(!selectedSong) return;

  let likedSongs = getLikedSongs();
  const existingIndex = likedSongs.findIndex(song => song.file === selectedSong.file);

  if(existingIndex === -1){
    likedSongs.push(selectedSong);
    if(button) button.innerText = "❤️";
  } else {
    likedSongs.splice(existingIndex, 1);
    if(button) button.innerText = "🤍";
  }

  saveLikedSongs(likedSongs);

  if(document.getElementById("likedSongsList")){
    loadLikedSongsPage();
  }
}

function loadLikedSongsPage(){
  const container = document.getElementById("likedSongsList");
  if(!container) return;

  const likedSongs = getLikedSongs();
  songs = likedSongs;
  current = 0;

  container.innerHTML = "";

  if(likedSongs.length === 0){
    container.innerHTML = `<div class="empty-box">No liked songs yet.</div>`;
    setupPlayer();
    return;
  }

  likedSongs.forEach((song, index) => {
    container.innerHTML += `
      <div class="song">
        <div class="song-info">
          <img src="${song.img}" class="song-img" alt="${song.name}">
          <span>${song.name}</span>
        </div>
        <div class="song-actions">
          <button onclick="playSong(${index})">Play</button>
          <button onclick="playRemix(${index})">🎧 Remix</button>
          <button onclick="removeLiked(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  setupPlayer();
}

function removeLiked(index){
  let likedSongs = getLikedSongs();
  likedSongs.splice(index, 1);
  saveLikedSongs(likedSongs);
  loadLikedSongsPage();
}

function updatePlayerUI(){
  const nowPlaying = document.getElementById("nowPlaying");
  const nowCategory = document.getElementById("nowCategory");
  const playerImg = document.getElementById("playerImg");
  const visualizer = document.getElementById("visualizer");

  if(songs.length > 0 && songs[current]){
    if(nowPlaying) nowPlaying.innerText = songs[current].name;
    if(nowCategory) nowCategory.innerText = songs[current].category || "Music Nest";
    if(playerImg) playerImg.src = songs[current].img || "images/playlist.jpg";
  } else {
    if(nowPlaying) nowPlaying.innerText = "No song playing";
    if(nowCategory) nowCategory.innerText = "Select a song";
    if(playerImg) playerImg.src = "images/playlist.jpg";
  }

  if(visualizer){
    visualizer.style.display = audio.paused ? "none" : "flex";
  }
}

function highlightActiveSong(index){
  document.querySelectorAll(".song").forEach(s => s.classList.remove("active"));
  const allSongs = document.querySelectorAll(".song");
  if(allSongs[index]) allSongs[index].classList.add("active");
}

function playSong(index){
  current = index;
  if(!songs[current]) return;

  audio.src = songs[current].file;
  audio.playbackRate = 1;
  audio.play();

  addToRecent(songs[current]);
  highlightActiveSong(index);

  const nowPlaying = document.getElementById("nowPlaying");
  if(nowPlaying){
    nowPlaying.innerText = songs[current].name;
  }

  const nowCategory = document.getElementById("nowCategory");
  if(nowCategory){
    nowCategory.innerText = songs[current].category || "Music Nest";
  }

  const playerImg = document.getElementById("playerImg");
  if(playerImg && songs[current].img){
    playerImg.src = songs[current].img;
  }

  const visualizer = document.getElementById("visualizer");
  if(visualizer){
    visualizer.style.display = "flex";
  }
}

function playRemix(index){
  if(songs.length === 0) return;

  let remixIndex = (index + 1) % songs.length;

  current = remixIndex;
  audio.src = songs[current].file;
  audio.playbackRate = 1;
  audio.play();

  addToRecent(songs[current]);
  highlightActiveSong(remixIndex);

  const nowPlaying = document.getElementById("nowPlaying");
  if(nowPlaying){
    nowPlaying.innerText = songs[current].name + " (Remix 🎧)";
  }

  const nowCategory = document.getElementById("nowCategory");
  if(nowCategory){
    nowCategory.innerText = "Vibe Switch Remix";
  }

  const playerImg = document.getElementById("playerImg");
  if(playerImg && songs[current].img){
    playerImg.src = songs[current].img;
  }

  const visualizer = document.getElementById("visualizer");
  if(visualizer){
    visualizer.style.display = "flex";
  }
}

function playCurrent(){
  if(songs.length === 0) return;

  if(!audio.src){
    playSong(current);
    return;
  }

  audio.play();
  updatePlayerUI();
}

function pauseSong(){
  audio.pause();
  updatePlayerUI();
}

function nextSong(){
  if(songs.length === 0) return;
  current = (current + 1) % songs.length;
  playSong(current);
}

function prevSong(){
  if(songs.length === 0) return;
  current = (current - 1 + songs.length) % songs.length;
  playSong(current);
}

function setupPlayer(){
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");

  if(progress){
    audio.ontimeupdate = function(){
      progress.max = audio.duration || 0;
      progress.value = audio.currentTime || 0;
    };

    progress.oninput = function(){
      audio.currentTime = progress.value;
    };
  }

  if(volume){
    audio.volume = volume.value;
    volume.oninput = function(){
      audio.volume = volume.value;
    };
  }

  audio.onended = function(){
    nextSong();
  };

  audio.onplay = function(){
    updatePlayerUI();
  };

  audio.onpause = function(){
    updatePlayerUI();
  };

  updatePlayerUI();
}

function searchCategories(){
  const input = document.getElementById("searchCategories");
  if(!input) return;

  const value = input.value.toLowerCase();
  const cards = document.querySelectorAll("#categoryCards .card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(value) ? "block" : "none";
  });
}

function searchSongs(){
  const input = document.getElementById("searchSongs");
  if(!input) return;

  const value = input.value.toLowerCase();
  const songItems = document.querySelectorAll("#songs .song");

  songItems.forEach(song => {
    const text = song.innerText.toLowerCase();
    song.style.display = text.includes(value) ? "flex" : "none";
  });
}

window.onload = function(){
  const path = window.location.pathname.toLowerCase();

  if(path.includes("home.html")){
    loadRecentSongs();
  }

  if(path.includes("category.html")){
    loadCategory();
  }

  if(path.includes("liked.html")){
    loadLikedSongsPage();
  }

  if(path.includes("playlist.html")){
    loadPlaylistPage();
  }

  if(path.includes("myplaylist.html")){
    loadMyPlaylistPage();
  }

  setupPlayer();
};

function signUp(){
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if(name === "" || email === "" || password === ""){
    alert("Please fill all fields");
    return;
  }

  const userData = { name, email, password };
  localStorage.setItem("musicNestUser", JSON.stringify(userData));

  alert("Signup successful");
  window.location.href = "login.html";
}

function loginUser(){
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const savedUser = JSON.parse(localStorage.getItem("musicNestUser"));

  if(!savedUser){
    alert("No account found. Please sign up first.");
    return;
  }

  if(email === savedUser.email && password === savedUser.password){
    alert("Login successful");
    window.location.href = "home.html";
  } else {
    alert("Invalid email or password");
  }
}