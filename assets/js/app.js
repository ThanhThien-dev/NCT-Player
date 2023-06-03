/* 
    1. Render songs
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click 
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// Lấy ra các elements trong DOM
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const getProgress = $('#progress')
const cdThumb = $('.cd-thumb')
const heading = $('header h2')
const audio = $('#audio')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const musicCurrentTime = $('.current-time')
const musicDuration = $('.max-duration')
const icon = document.getElementById("icon");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    playedSongs: [],
    isRepeat: false,

    songs: [
        {
            name: 'Shape Of You',
            single: 'Ed Sheeran',
            path: './assets/music/ShapeOfYou.mp3',
            image: './assets/img/ShapeOfYou.jpg'
        },
        {
            name: 'Wellerman',
            single: 'Nathan Evans',
            path: './assets/music/Wellerman.mp3',
            image: './assets/img/Wellerman.jpg'
        },
        {
            name: 'Faded',
            single: 'Alan Walker',
            path: './assets/music/Faded.mp3',
            image: './assets/img/Faded.jpg'
        },
        {
            name: 'Attention',
            single: 'Charlie puth',
            path: './assets/music/Attention.mp3',
            image: './assets/img/Attention.jpg'
        },
        {
            name: 'Thunder',
            single: 'Imagine dragons',
            path: './assets/music/Thunder.mp3',
            image: './assets/img/Thunder.jpg'
        },
        {
            name: 'Believer',
            single: 'Imagine dragons',
            path: './assets/music/Believer.mp3',
            image: './assets/img/Believer.jpg'
        },
        {
            name: 'Nevada',
            single: 'Vicetone ft Cozi Zuehlsdorff',
            path: './assets/music/Nevada.mp3',
            image: './assets/img/Nevada.jpg'
        },
        {
            name: 'Despacito',
            single: 'Luis Fonsi',
            path: './assets/music/Despacito.mp3',
            image: './assets/img/Despacito.jpg'
        },
        {
            name: 'Ngày mai người ta lấy chồng',
            single: 'Thành Đạt',
            path: './assets/music/NgayMaiNguoiTaLayChong.mp3',
            image: './assets/img/NgayMaiNguoiTaLayChong.jpg'
        },
        {
            name: 'Kẻ Viết Ngôn Tình',
            single: 'Châu Khải Phong',
            path: './assets/music/KeVietNgonTinh.mp3',
            image: './assets/img/KeVietNgonTinh.jpg'
        },
        {
            name: 'Chốn phồn hoa',
            single: 'Châu Khải Phong',
            path: './assets/music/ChonPhonHoa.mp3',
            image: './assets/img/ChonPhonHoa.jpg'
        },
        {
            name: 'Đừng chờ anh nữa',
            single: 'Tăng Phúc',
            path: './assets/music/DungChoAnhNua.mp3',
            image: './assets/img/DungChoAnhNua.jpg'
        },
        {
            name: 'Em là kẻ đáng thương',
            single: 'Phát Huy T4',
            path: './assets/music/EmLaKeDangThuong.mp3',
            image: './assets/img/EmLaKeDangThuong.jpg'
        },
        {
            name: 'Hoa Cưới',
            single: 'Đạt Long Vinh',
            path: './assets/music/HoaCuoi.mp3',
            image: './assets/img/HoaCuoi.jpg'
        },
        {
            name: 'Ôm em được không',
            single: 'DICKSON',
            path: './assets/music/OmEmDuocKhong.mp3',
            image: './assets/img/OmEmDuocKhong.jpg'
        },
        {
            name: 'Phố Hoa Lệ',
            single: 'Chu Bin',
            path: './assets/music/PhoHoaLe.mp3',
            image: './assets/img/PhoHoaLe.jpg'
        },
        {
            name: 'Sao Cũng Được',
            single: 'Thành Đạt',
            path: './assets/music/SaoCungDuoc.mp3',
            image: './assets/img/SaoCungDuoc.jpg'
        },
        {
            name: 'Thay duyên đổi phận',
            single: 'Đỗ Thành Duy',
            path: './assets/music/ThayDuyenDoiPhan.mp3',
            image: './assets/img/ThayDuyenDoiPhan.jpg'
        },
    ],

    // Hàm khởi tạo thời lượng bài hát
    loadSongDurations: function () {
        this.songs.forEach(song => {
            const audio = new Audio(song.path)
            audio.addEventListener('loadedmetadata', () => {
                song.duration = audio.duration
                this.render()
            })
        })
    },

    // Hàm hiển thị các phần tử trong playlist
    render: function () {
        const htmls = this.songs.map((song, index) => {
            const duration = song.duration ? this.formatTime(song.duration) : '--:--'
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.single}</p>
                        </div>
                        <div class="option active">
                            <p class="song-duration">${duration}</p>
                        </div>
                    </div>
                    `
        })
        playlist.innerHTML = htmls.join('')
    },

    // Định nghĩa hàm getter để lấy bài hát hiện tại
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Hàm format thời gian hiển thị
    formatTime: function (time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },

    // Hàm load thông tin bài hát hiện tại
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        // Set tiêu đề Website thành tên bài hát và ca sĩ hiện tại
        document.title = `${this.currentSong.name} - ${this.currentSong.single}`
    },

    // Tạo hàm xử lý sự kiện
    handleEvents: function (e) {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý sự kiện phóng to, thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY
            const newWidth = cdWidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        // Xử lý sự kiện nút PLAY
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        // Khi song Play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Thanh tiến trình khi bài hát đang phát
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressValue = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressValue;
                const width = progress.clientWidth;
                const leftOffset = (progressValue / 100) * width;
                icon.style.left = `${leftOffset}px`;
            }
        }

        // Xử lý khi tua bài hát
        getProgress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lý đĩa CD xoay vòng vòng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý nút bật / tắt random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý nút bật / tắt repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi ended và repeat
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lý sự kiện lắng nghe khi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            // Xử lý khi click vào song
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }

        // Hiển thị tổng thời gian bài hát trước khi đếm ngược (Playing)
        audio.addEventListener('loadedmetadata', function () {
            const duration = audio.duration
            const minutes = Math.floor(duration / 60)
            const seconds = Math.floor(duration % 60)
            const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

            // Lấy phần tử .song-duration của bài hát đang active
            const songDurationElement = document.querySelector('.song.active .song-duration')
            if (songDurationElement) {
                songDurationElement.textContent = formattedDuration
            }
        })

        // Đếm ngược thời gian bài hát ở Playlist
        audio.addEventListener('timeupdate', function () {
            const duration = audio.duration
            const currentTime = audio.currentTime
            const timeLeft = duration - currentTime
            const minutes = Math.floor(timeLeft / 60)
            const seconds = Math.floor(timeLeft % 60)
            const formattedTimeLeft = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            // Lấy phần tử .song-duration của bài hát đang active
            const songDurationElement = document.querySelector('.song.active .song-duration')
            if (songDurationElement) {
                songDurationElement.textContent = formattedTimeLeft
            }
        })

        // Cập nhật thanh progress-bar theo thời gian hiện tại của bài hát
        audio.addEventListener('timeupdate', (e) => {
            const currentTime = e.target.currentTime
            const duration = e.target.duration

            // Cập nhật tổng thời lượng bài hát
            if (!isNaN(duration)) {
                let totalMin = Math.floor(duration / 60)
                let totalSec = Math.floor(duration % 60)
                if (totalMin < 10) {
                    totalMin = `0${totalMin}`
                }
                if (totalSec < 10) {
                    totalSec = `0${totalSec}`
                }
                musicDuration.innerText = `${totalMin}:${totalSec}`
            }

            // Cập nhật thời gian hiện tại của bài hát
            let currentMin = Math.floor(currentTime / 60)
            let currentSec = Math.floor(currentTime % 60)
            if (currentMin < 10) {
                currentMin = `0${currentMin}`
            }
            if (currentSec < 10) {
                currentSec = `0${currentSec}`
            }
            musicCurrentTime.innerText = `${currentMin}:${currentSec}`
        })

        // Cập nhật tổng thời lượng bài hát khi metadata được tải về
        audio.addEventListener('loadedmetadata', (e) => {
            const duration = e.target.duration

            // Cập nhật tổng thời lượng bài hát
            if (!isNaN(duration)) {
                let totalMin = Math.floor(duration / 60)
                let totalSec = Math.floor(duration % 60)
                if (totalMin < 10) {
                    totalMin = `0${totalMin}`
                }
                if (totalSec < 10) {
                    totalSec = `0${totalSec}`
                }
                musicDuration.innerText = `${totalMin}:${totalSec}`
            }
        })

        // Cập nhật thời gian còn lại của bài hát trong sự kiện timeupdate
        audio.addEventListener('timeupdate', function () {
            const duration = audio.duration
            if (!isNaN(duration)) {
                const currentTime = audio.currentTime
                const timeLeft = duration - currentTime
                const minutes = Math.floor(timeLeft / 60)
                const seconds = Math.floor(timeLeft % 60)
                const formattedTimeLeft = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                // Cập nhật thời gian còn lại vào phần tử hiển thị tổng thời lượng của bài hát
                musicDuration.innerText = formattedTimeLeft
            } else {
                // Hiển thị giá trị mặc định hoặc không hiển thị gì cả
                musicDuration.innerText = '--:--'
            }
        })
    },

    // Hàm xử lý nút next song
    nextSong: function () {
        this.currentIndex += 1
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    // Hàm xử lý nút prev song
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    // Hàm Random bài hát ngẫu nhiên không trùng với bài cũ
    randomSong: function () {
        if (this.playedSongs.length === this.songs.length) {
            this.playedSongs = []
        }
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.playedSongs.includes(newIndex))
        this.playedSongs.push(newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    // Hàm xử lý scroll khi khuất khỏi màn hình
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: "nearest"
            })
        }, 300)
    },

    start: function () {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM Events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong();

        // Tải thông tin duration bài hát đầu tiên khi chạy ứng dụng
        this.loadSongDurations()

        //Render playlist
        this.render();
    },
}
app.start();