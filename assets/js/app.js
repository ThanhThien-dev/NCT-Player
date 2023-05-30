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
const icon = document.getElementById("icon");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
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

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.single}</p>
                        </div>
                        <div class="option">
                            <img src="https://static.thenounproject.com/png/868078-200.png" alt="Lyric">
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

    // Tạo hàm xử lý sự kiện
    handleEvents: function () {
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

        //Khi prev bài hát
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
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào nút option
                if (e.target.closest('.option')) {
                    alert('Chức năng đang được bổ sung')
                }
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.currentIndex += 1
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    // Hàm Random bài hát ngẫu nhiên không trùng với bài cũ
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)
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

        //Render playlist
        this.render();
    },
}
app.start();