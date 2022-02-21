         $(document).ready(function () {
             let playlistNum = 0;
             if(localStorage.getItem('playlistNum')){
                 playlistNum = localStorage.getItem('playlistNum')
                 console.log(playlistNum)
             }
             getPlaylist(playlistNum)
        });

        function getPlaylist(num) {
            $.ajax({
                type: 'GET',
                url: '/getPlaylist?playlistNum=' + num,
                data: {},
                success: function (response) {
                    console.log(response)
                    let playlist = response['data']
                    let playlist_title = playlist['playlist_title']
                    let playlist_desc = playlist['playlist_desc']
                    let songs = playlist['playlist_music']
                    let user_name = playlist['user_name']
                    let playlist_img = songs[0]['music_album']

                    console.log(playlist_title, playlist_desc, songs, num)

                    $("#playlist-img").attr("src", playlist_img);
                    $("#playlist-title").text(playlist_title)
                    $("#nickname").text(user_name)
                    // $("#favorites-num").text(playlist_like)
                    $("#description").text(playlist_desc)

                    // 노래 목록 출력
                    for (let i = 0; i < songs.length; i++) {
                        let album_img = playlist['playlist_music'][i]['music_album']
                        let music_artist = songs[i]['music_artist']
                        let music_title = songs[i]['music_title']
                        let song_num = i+1

                        temp_html = `<tr>
                                        <th scope="row" style="width: 10%">${song_num}</th>
                                        <td style="width: 60%; vertical-align: middle">
                                            <div class="flex" >
                                                <div class="img-album-box vertical-align">
                                                    <img class="img-album" src="${album_img}">
                                                </div>
                                                <div class="vertical-align">
                                                     <span style="font-weight: bold">${music_title}</span><br>
                                                     ${music_artist}
                                                </div>
                                            </div>
                                        </td>

                                        <td style="width: 10%"><a href="https://www.youtube.com/watch?v=ZeerrnuLi5E" target="_blank"><i class="fa-brands fa-youtube fa-lg" style="color: red"></i></a></td>
                                        <td style="width: 10%"><i class="fa-solid fa-plus fa-lg imgSelect"></i></td>
                                        <td style="width: 10%"><i class="fa-solid fa-trash fa-sm"></i></td>
                                    </tr>`
                         $("#song-tbody").append(temp_html)
                    }
                }
            });
        }
        function closeLayer(obj) {
            $(obj).parent().parent().hide();
        }
        $(function () {
            /* 클릭 클릭시 클릭을 클릭한 위치 근처에 레이어가 나타난다. */
            $('.imgSelect').click(function (e) {
                var sWidth = window.innerWidth;
                var sHeight = window.innerHeight;

                var oWidth = $('.popupLayer').width();
                var oHeight = $('.popupLayer').height();

                // 레이어가 나타날 위치를 셋팅한다.
                var divLeft = e.clientX + 10;
                var divTop = e.clientY + 5;

                // 레이어가 화면 크기를 벗어나면 위치를 바꾸어 배치한다.
                if (divLeft + oWidth > sWidth) divLeft -= oWidth;
                if (divTop + oHeight > sHeight) divTop -= oHeight;

                // 레이어 위치를 바꾸었더니 상단기준점(0,0) 밖으로 벗어난다면 상단기준점(0,0)에 배치하자.
                if (divLeft < 0) divLeft = 0;
                if (divTop < 0) divTop = 0;

                $('.popupLayer').css({
                    "top": divTop,
                    "left": divLeft,
                    "position": "absolute"
                }).show();
            });

        });
