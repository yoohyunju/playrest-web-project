 $(document).ready(function () {
            getPlaylist()
        });

        function getPlaylist() {
            let id = "620e387e355284c12ad50130"; // 플레이리스트 _id값 넣어야함
            $.ajax({
                type: 'GET',
                url: '/getPlaylist?id_give=' + id,
                data: {},
                success: function (response) {
                    console.log(response)
                    let playlist_title = response['playlist_title']
                    let playlist_like = response['playlist_like']
                    let songs = response['playlist_music']
                    let user_id = response['user_id']
                    console.log(playlist_title, playlist_like, songs, id )

                    $("#pll-title").text(playlist_title)
                    $("#nickname").text(user_id)
                    $("#favorites-num").text(playlist_like)
                    $("#introduction").text("심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^")

                    // 노래 목록 출력
                    for (let i = 0; i < songs.length; i++) {
                        let music_artist = songs[i]['music_artist']
                        let music_title = songs[i]['music_title']
                        let song_num = i+1

                        temp_html = `<tr>
                                        <th scope="row">${song_num}</th>
                                        <td>
                                            <div class="song-info">
                                                <div class="img-album">
                                                    <img src="https://w.namu.la/s/48d8d59e536896b00da9365d1532b2051b1931abe47cddeffea696f4f29efa8131d6824f41fb3bd5f65d78c27c5dd95a6183b6a50d9e85f33cc19a612b4143d5fd41ea9dd9c797d08085e64f18042c30f444ffd2a64980477c4095120d288438" width="50px" height="50px">
                                                </div>
                                                <div>
                                                     ${music_title}<br>
                                                     ${music_artist}
                                                </div>
                                            </div>
                                        </td>

                                        <td><a href="https://www.youtube.com/watch?v=ZeerrnuLi5E" target="_blank"><i class="fa-brands fa-youtube fa-lg" style="color: red"></i></a></td>
                                        <td><i class="fa-solid fa-plus fa-lg imgSelect"></i></td>
                                        <td><i class="fa-solid fa-trash fa-sm"></i></td>
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
