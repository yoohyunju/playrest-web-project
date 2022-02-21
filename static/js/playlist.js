$(document).ready(function () {
    let playlistNum = 0;
    if (localStorage.getItem('playlistNum')) {
        playlistNum = localStorage.getItem('playlistNum')
        console.log(playlistNum)
    }
    getPlaylist(playlistNum)
});

$(".add-btn").click(function () {
    alert('버튼 클릭');
    // function getMyPlaylists() {
    // 서버의 데이터를 받아오기
    $.ajax({
        type: "GET",
        url: "/mylist",
        data: {},
        success: function (response) {
            alert('성공');
            console.log(response['data'])
        }
    })
    // }
});

function getPlaylist(num) {
    $.ajax({
        type: 'GET',
        url: '/playlist/getPlaylist?playlistNum=' + num,
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
            $("#song-count").text(songs.length)

            // 노래 목록 출력
            for (let i = 0; i < songs.length; i++) {
                let album_img = playlist['playlist_music'][i]['music_album']
                let music_artist = songs[i]['music_artist']
                let music_title = songs[i]['music_title']
                let song_num = i + 1
                let temp_html = `
                                    <tr>
                                        <th scope="row" style="width: 10%">${song_num}</th>
                                        <td style="width: 60%; vertical-align: middle">
                                            <div class="flex">
                                                <div class="img-album-box vertical-align">
                                                    <img class="img-album" src="${album_img}">
                                                </div>
                                                <div class="vertical-align">
                                                    <span style="font-weight: bold">${music_title}</span><br>
                                                    ${music_artist}
                                                </div>
                                            </div>
                                        </td>
                                        <td style="width: 10%">
                                            <button class="btn mybtn" type="button" onclick="window.open('https://www.youtube.com/watch?v=ZeerrnuLi5E');">
                                                <i class="fa-brands fa-youtube fa-lg btn-light" style="color: red"></i></a>
                                            </button>
                                        </td>
                                        <td style="width: 10%">
                                            <div class="dropdown">
                                                <button class="btn mybtn add-btn" type="button"
                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                                        onclick="selectPlaylist('${music_title}', '${music_artist}', '${album_img}')">
                                                    <i class="fa-solid fa-plus fa-lg"></i>
                                                </button>
                                                <div class="dropdown-menu append-playlist" aria-labelledby="dropdownMenuButton">
                                                    <a class="dropdown-item" onclick="createPlaylist('${music_title}', '${music_artist}', '${album_img}')">새 플레이리스트</a>
                                                    <div class="dropdown-divider"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style="width: 10%">
                                            <button class="btn mybtn" type="button" onclick="deleteMusic(${num}, ${i})">
                                                <i class="fa-solid fa-trash fa-sm"></i></a>
                                            </button>
                                        </td>
                                    </tr>`

                $("#song-tbody").append(temp_html)
            }
            let tableHeight = $("#mytable").height();
            $("hr").height(tableHeight)
        }
    });
}

function deleteMusic(playlistNumber, songNumber) {
    $.ajax({
            type: "POST",
            url: "/playlist/deleteMusic",
            data: {
                playlist_num_give: playlistNumber,
                song_num_give: songNumber,
            },
            success: function (response) {
                alert(response["msg"]);
                window.location.reload();
            }
        })

}

function createPlaylist(title, artist, album) {
    let playlist_desc = '' //초기화 후 나중에 플리 수정

    $.ajax({
        type: "POST",
        url: "/search/select/create",
        data: {
            playlist_give: title,
            desc_give: playlist_desc,
            title_give: title,
            artist_give: artist,
            album_give: album
        },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 노래 담을 플레이리스트 선택
function selectPlaylist(title, artist, album) {
    $.ajax({
        type: 'GET',
        url: '/search/select',
        data: {},
        success: function (response) {
            let myPlaylists = response['data']
            console.log(myPlaylists)
            console.log(title)

            $('.my-playlist').remove(); // 이전에 append 한 플리 이름 초기화

            for (let i = 0; i < myPlaylists.length; i++) {
                let playlist_title = myPlaylists[i]["playlist_title"]
                let playlist_num = myPlaylists[i]['playlist_num']

                let temp_html = `<a class="dropdown-item my-playlist" onclick="addMusic('${playlist_num}', '${title}', '${artist}', '${album}')">${playlist_title}</a>`

                $('.append-playlist').append(temp_html);
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
        data: {num_give: num, title_give: title, artist_give: artist, album_give: album},
        success: function (response) {
            window.location.reload()
            console.log('성공');
        }
    });
}