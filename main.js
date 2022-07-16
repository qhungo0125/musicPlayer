const PLAYER_STORAGE_KEY = 'MY_PLAYER'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2');
const cdThumb = $('.cd-thumb') ;
const audio = $('#audio');

const cd = $('.cd');

const playlist = $('.playlist')

const playBtn = $('.btn-toggle-play')
const nextBtn =$('.btn-next')
const preBtn = $('.btn-prev')
const randBtn= $('.btn-random')
const repeatBtn = $('.btn-repeat')

const player = $('.player')

const progress = $('#progress')

const app ={
    currentIndex: 0,
    isPlaying: false,
    isRand: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) ) || {},
    songs: [
        {
            name: 'Chung ta khong thuoc ve nhau',
            singer: 'Son Tung MTP',
            path: './songs/ChungTaKhongThuocVeNhau-SonTungMTP-4528181.mp3'
        },
        {
            name: 'Dung ve tre',
            singer: 'Son Tung MTP',
            path: './songs/DungVeTreRnbVersion-MTP-2691584.mp3'
        },
        {
            name: 'Khong phai dang vua dau',
            singer: 'Son Tung MTP',
            path: './songs/KhongPhaiDangVuaDau-SonTungMTP-3753840.mp3'
        },
        {
            name: 'Nhu ngay hom qua',
            singer: 'Son Tung MTP',
            path: './songs/NhuNgayHomQuaUpgrade-SonTungMTP-4282962.mp3'
        },
        {
            name: 'Chung ta khong thuoc ve nhau',
            singer: 'Son Tung MTP',
            path: './songs/ChungTaKhongThuocVeNhau-SonTungMTP-4528181.mp3'
        },
        {
            name: 'Dung ve tre',
            singer: 'Son Tung MTP',
            path: './songs/DungVeTreRnbVersion-MTP-2691584.mp3'
        },
        {
            name: 'Khong phai dang vua dau',
            singer: 'Son Tung MTP',
            path: './songs/KhongPhaiDangVuaDau-SonTungMTP-3753840.mp3'
        },
        {
            name: 'Nhu ngay hom qua',
            singer: 'Son Tung MTP',
            path: './songs/NhuNgayHomQuaUpgrade-SonTungMTP-4282962.mp3'
        },
    ],
    setConfig: function(key, value){
        this.config[key]= value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index===this.currentIndex ? 'active': ''}" data-index='${index}'>
                <div class="thumb" style="background-image: url('')">
                </div>

                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>    
            `
        })

        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })

    },

    handleEvent : function(){
        // scroll effect
        const cdWidth = cd.offsetWidth;

        const animate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        animate.pause();

        document.onscroll = function() {
            const srollTop = window.screenY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth-srollTop;
            
            cd.style.width = newCdWidth>0? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth/cdWidth
        }
        
        // end scroll eff

        // play handle

        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }

        audio.onplay = function(){
            app.isPlaying=true;
            player.classList.add('playing');
            animate.play();
        }

        audio.onpause = function(){
            app.isPlaying=false;
            player.classList.remove('playing');
            animate.pause();
        }

        audio.ontimeupdate= function(){

            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime*100/audio.duration);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e){
            const  seekTime = audio.duration/100*e.target.value;
            audio.currentTime= seekTime;
        }

        nextBtn.onclick = function(){
            if(app.isRand){
                app.randSong();
            }else{
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        preBtn.onclick = function(){

            if(app.isRand){
                app.randSong();
            }else{
                app.preSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        randBtn.onclick = function(e){
            app.isRand=!app.isRand;
            app.setConfig('isRand', app.isRand);
            randBtn.classList.toggle('active',app.isRand)
        }
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);
             repeatBtn.classList.toggle('active',app.isRepeat)
        }

        audio.onended = function(){
            if(app.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }


        playlist.onclick = function(e){
            var songNode = e.target.closest('.song:not(.active)');
            if( songNode&&
                !e.target.closest('.option')
            ){
                //songNode.dataset.index === songNode.getAttribute('data-index')
                app.currentIndex=Number(songNode.dataset.index);
                app.loadCurrentSong();
                audio.play(); 
                app.render();
                //console.log(songNode.getAttribute('data-index'))
            }
        }

        // end play handle
        
    },

    loadConfig: function(){
        app.isRand= app.config.isRand;
        app.isRepeat= app.config.isRepeat;
        
    },

    loadCurrentSong: function(){

        heading.textContent = this.currentSong.name;
        // cdThumb.style.backgroundImage = `url('${this.currentSong.name.image}')`
        audio.src = this.currentSong.path;

    },

    scrollToActiveSong: function(){
        var blockPropertive;
        if (app,this.currentIndex===0){
            blockPropertive='center';
        }else{
            blockPropertive='nearest';
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: blockPropertive,
            });
        }, 200); 
    },

    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length){
            this.currentIndex=0;
        }
        this.loadCurrentSong();
    },

    preSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0){
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },

    randSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        } while(newIndex===this.currentIndex)

        this.currentIndex=newIndex;
        this.loadCurrentSong();

    },



    start: function(){
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();

        
        randBtn.classList.toggle('active',app.isRand)
        repeatBtn.classList.toggle('active',app.isRepeat)
    }

}

app.start();

