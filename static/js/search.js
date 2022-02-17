function searchMusic() {
    let musicKeyWord = $('#songinfo').val()
    $.ajax({
        type: 'GET',
        url: 'http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + musicKeyWord + '&api_key=36e6ecdb6e67403d6448be2bca4e77ce&format=json',
        success: function (response) {
            alert("ajax success")
            let musicList = response["results"]["trackmatches"]["track"];
            for (let i = 0; i < musicList.length; i++) {
                let albumTitle = musicList[i]["name"]
                let albumArtist = musicList[i]["artist"]

                let temp_html = `<div class="list-group">
                                            <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                                            <div class="d-flex w-100 justify-content-between">
                                                <h5 class="mb-1"> ${albumTitle} </h5>
                                            </div>
                                            <p class="mb-1"> ${albumArtist} </p>
                                            </a>
                                        </div>`
                $('#list-q1').append(temp_html);
            }
        }
    })
}

function addMusic(title, artist) {
    console.log(title, artist)
    $.ajax({
        type: 'POST',
        url: '/addMusic',
        data: {title_give: title, artist_give: artist},
        success: function (response) {
            alert(response['msg']);
            window.location.reload()
        }
    });
}