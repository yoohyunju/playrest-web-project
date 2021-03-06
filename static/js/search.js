        $(document).ready(function () {
             if(localStorage.getItem('searchKeyword')){
                 let musicKeyword = localStorage.getItem('searchKeyword')
                 document.getElementById("songinfo").value = musicKeyword;
                 searchPlaylists();
                 console.log(musicKeyword)
             }

        });

        // 노래가 들어간 플레이리스트 검색
        // 검색 버튼 눌렀을 때 onclick으로 이 함수 호출해주시면 될 거예요
        function searchPlaylists() {
            let keyword = $('#songinfo').val()
            $.ajax({
                type: 'GET',
                url: '/search/playlists?keyword_give=' + keyword + '',
                success: function (response) {
                    alert('검색!')
                    let playlists = response['data']
                    console.log(playlists)
                    for (let i = 0; i < playlists.length; i++) {
                        let playlist_num = playlists[i]['playlist_num']
                        let playlist_title = playlists[i]["playlist_title"]
                        let temp_html = `<tr>
                                                <td>${playlist_title}</td>
                                                <td></td>
                                                <td></td>
                                         </tr>`
                        $('#list-q1').append(temp_html);
                    }
                    searchMusic()   // 일단은 플레이리스트 목록 뜨고 음악 목록 뜨도록 설정해뒀습니다 나중에 변경하시면 돼요!
                }
            })
        }

        // 음악 검색
        function searchMusic() {
            let musicKeyword = $('#songinfo').val()
            $.ajax({
                type: 'GET',
                url: '/search/musics?musicKeyword=' + musicKeyword,
                success: function (response) {
                    alert("ajax 성공")
                    console.log(response['result'])
                    musics = response['result']
                    console.log(musics[0])
                    for (let i = 0; i < musics.length; i++) {
                        let albumTitle = musics[i]["name"]
                        let albumArtist = musics[i]["artists"][0]['name']
                        // 검색방법 1) 앨범 검색에서 이미지 갖고오기
                        // let albumImg = albums[i]['images'][0]['url']
                        // 검색방법 2) 음악 검색에서 이미지 갖고오기
                        let albumImg = musics[i]['album']['images'][0]['url']
                        let previewMusic = musics[i]["preview_url"]
                        console.log(previewMusic)

                        let temp_html = `<tr>
                                        <td><img src="${albumImg}" width="80px" height="80px"></td>
                                        <td class="Title_css">${albumTitle}</td>
                                        <td class="Artist_css">${albumArtist}</td>
                                        <td><button onclick="addMusic('${albumTitle}','${albumArtist}','${albumImg}')" class="bnt_add">추가</button></td>
                                        <td>
                                            <audio controls>
                                              <source src='${previewMusic}' type="audio/mpeg">
                                            </audio>
                                        </td>
                                 </tr>`
                        $('#list-q1').append(temp_html);
                    }

                }
            })
        }

        // 노래 담을 플레이리스트 선택
        function selectPlaylist(title, artist, album) {
            console.log(title, artist, album)
            $.ajax({
                type: 'GET',
                url: '/search/select',
                data: {},
                success: function (response) {
                    alert('연결!')
                    let myPlaylists = response['data']
                    console.log(myPlaylists)
                    console.log(title)
                    for (let i = 0; i < myPlaylists.length; i++) {
                        let playlist_title = myPlaylists[i]["playlist_title"]
                        let playlist_num = myPlaylists[i]['playlist_num']
                        let temp_html = `<tr>
                                     <td>${playlist_title}</td>
                                     <td></td>
                                     <td><button onclick="addMusic('${playlist_num}','${title}','${artist}','${album}')">추가</button></td>
                                </tr>`
                        $('#list-q1').append(temp_html);
                    }
                }
            });
        }

        // 선택한 플레이리스트에 노래 추가
        function addMusic(num, title, artist, album) {
            console.log(num, title, artist)
            $.ajax({
                type: 'POST',
                url: '/search/select/add',
                data: {num_give: num, title_give: title, artist_give: artist, album_give:album},
                success: function (response) {
                    alert(response['msg']);
                    window.location.reload()
                }
            });
        }

