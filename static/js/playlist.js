$(document).ready(function () {
    let playlistNum = 0;

    if (localStorage.getItem('playlistNum')) {
        playlistNum = localStorage.getItem('playlistNum')
        console.log(playlistNum)
    }

    getPlaylist(playlistNum)
    checkMyPlaylist(playlistNum)

    // 좋아요 여부 갖고옴 -> 좋아요 아이콘 설정을 위함
    getLike(playlistNum)

    $(".heart").click(function () {
        $(this).toggleClass("fa-regular fa-solid");

        like = $(this).hasClass("fa-solid"); //like눌려있으면 true 반환
        // console.log('like여부:' + like);
        likePlaylist(playlistNum, like);
    });

    $(".visible")

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
});
// 내 플리면 휴지통 아이콘을 숨김
function checkMyPlaylist(playlistNum) {
    $.ajax({
        type: 'GET',
        url: '/playlist/checkMyPlaylist?playlistNum=' + playlistNum,
        data: {},
        success: function (response) {
            console.log("플리번호:" + playlistNum)
            console.log("like:" + response['msg'])

            if (response['msg'] == 'true') { //좋아요 O -> 하트 채움
                console.log('내플리')
                // $('.visible').show();
                // jQuery('.visible').css("display", "block");

            } else { //좋아요 X -> 하트 비움
                console.log('내플리X')
                // $('.visible').hide();
                jQuery('.visible').css("display", "none");

            }
        }
    });

}
function getLike(playlistNum) {
    $.ajax({
        type: 'GET',
        url: '/playlist/getPlaylist/getLike?playlistNum=' + playlistNum,
        data: {},
        success: function (response) {
            console.log("플리번호:"+playlistNum)
            console.log("like:"+response['msg'])

            if (response['msg']==true) { //좋아요 O -> 하트 채움
                console.log('좋아요O')
                $('.heart').attr('class', 'mybtn heart fa-solid fa-heart');
            } else { //좋아요 X -> 하트 비움
                console.log('좋아요X')
                $('.heart').attr('class', 'mybtn heart fa-regular fa-heart');
            }
        }
    });
}


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
            let playlist_like = playlist['playlist_like']
            let songs = playlist['playlist_music']
            let user_name = playlist['user_name']
            let playlist_img = songs[0]['music_album']

            console.log(playlist_title, playlist_desc, songs, num)

            $("#playlist-img").attr("src", playlist_img)
            $("#playlist-title").text(playlist_title)
            $("#nickname").text(user_name)
            $("#favorites-num").text(playlist_like)

            if (localStorage.getItem('currentUserName')) {
                let playListOwnerName = $("#nickname").text()
                let currentUserName = localStorage.getItem('currentUserName')
                let temp_html = `<button type="button" class="btn" id="openModalBtn" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal" data-bs-whatever="" onclick="modalControl()">✏️</button>`

                console.log("플리 주인:", playListOwnerName, "현재 사용자:", currentUserName)

                if (playListOwnerName == currentUserName) { // 현재 사용자의 플레이리스트이면
                    // 수정 버튼 추가
                    $('#title').append(temp_html)
                }
            }

            // 소개 없을 시 기본 문구 출력
            if(playlist_desc.length == 0){
                $("#description").text("플레이리스트 소개를 적어주세요.")
            }else { // 기존 소개 문구 출력
                $("#description").text(playlist_desc)
            }

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
                                            <button class="btn mybtn back-color-transparent" type="button" onclick="getYoutube('${music_title}', '${music_artist}')">
                                                <i class="myicon fa-brands fa-youtube fa-lg btn-light" style="color: red"></i></a>
                                            </button>
                                        </td>
                                        <td style="width: 10%">
                                            <div class="dropdown">
                                                <button class="btn mybtn back-color-transparent add-btn" type="button"
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
                                        <td style="width: 10%" class="visible">
                                            <button class="btn mybtn back-color-transparent" type="button" onclick="deleteMusic(${num}, ${i})">
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
    $.ajax({
        type: "POST",
        url: "/search/select/create",
        data: {title_give:title, artist_give:artist, album_give:album},
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

// 플레이리스트 좋아요 버튼 클릭시 호출
function likePlaylist(num, like) {
    let likeNum = parseInt($("#favorites-num").text());
    if (like == true)
        $("#favorites-num").text(likeNum + 1);
    else
        $("#favorites-num").text(likeNum - 1);

    $.ajax({
        type: 'POST',
        url: '/playlist/getPlaylist/like',
        data: {num_give:num, like_give:like},
        success: function (response) {
        }
    });
}

// 플레이리스트 제목, 설명 수정
function editList(num) {
    let playlist_title = $('#edit-playlist-title').val()
    let playlist_desc = $('#edit-playlist-desc').val()
    $.ajax({
        type: 'POST',
        url: '/playlist/getPlaylist/edit',
        data: {num_give:num, title_give: playlist_title, desc_give: playlist_desc},
        success: function (response) {
            alert(response['msg']);
            window.location.reload();
        }
    });
}

// 좋아요
function myFunction(x) {
  // x.classList.toggle("fa-thumbs-down");
  x.classList.toggle("fa-regular fa-heart");
}

//모달(팝업)창
function modalControl() {
    //기존 데이터 셋팅
    let preTitle = $('#playlist-title').text()
    let preDesc = $('#description').text()

    $('#edit-playlist-title').val(preTitle)
    $('#edit-playlist-desc').text(preDesc)

    jQuery.noConflict(); // jquery 충돌 방지

    // 버튼 클릭 시 모달창 여는 이벤트
    $('#openModalBtn').on('click', function () {
        $('#modalBox').modal('show');
    });

}

function getYoutube(title, artist) {
    $.ajax({
        type: "GET",
        dataType: "JSON",
        url: 'https://www.googleapis.com/youtube/v3/search?key=APIKEY&part=id&maxResults=1&q='+title+'%27'+artist,
        success: function (response) {
            let videoID = response['items'][0]['id']['videoId']
            window.open('https://www.youtube.com/watch?v='+videoID)
        }
    })
}
