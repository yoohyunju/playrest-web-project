       $(document).ready(function () {
            show_pll();
        });

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
        function show_pll() {
            $("#pll-title").text("음색 깡패! 남자 아이들 솔로")
            $("#nickname").text("수민")
            $("#favorites-num").text("382")
            $("#introduction").text("심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^심화창조 최고^^")

            temp_html = `<tr>
                            <th scope="row">1</th>
                            <td>Black mamba</td>
                            <td>에스파</td>
                            <td>영상버튼+영상링크</td>
                            <td>담기버튼</td>
                            <td>제거버튼</td>
                        </tr>`
            $("#song-tbody").append(temp_html)
        }
        // function add_popup() {
        //     var url = "popUpAdd.html";
        //     var name = "popup test";
        //     var option = "width = 500, height = 500, top = 100, left = 200, location = no"
        //     window.open(url, name, option);
        // }


