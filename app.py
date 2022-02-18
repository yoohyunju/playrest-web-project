from flask import Flask, render_template, jsonify, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'super secret key'     # 세션 때문에 있는 건데 아무키나 넣어도 괜찮습니다

from pymongo import MongoClient
# client = MongoClient('mongodb://test:test@localhost', 27017)  # id:password
client = MongoClient('localhost', 27017)
db = client.makingproject

from bson.objectid import ObjectId  # mongodb object id 값 갖고오기
import json # dict타입을 json으로 변환하기 위한 라이브러리
from bson import json_util

## spotify 관련
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from static.credential_key import SpotifyKey


## HTML 화면 보여주기
@app.route('/')
def homework():
    return render_template('/home/index.html')

@app.route('/playlist')
def playlist():
    return render_template('/playlist/playlist.html')

@app.route('/search')
def search():
    return render_template('/search/search.html')

@app.route('/mypage')
def mypage():
    return render_template('/myPage/myPage.html')

# 플레이리스트 1개의 상세 목록보기(Read) API
@app.route('/getPlaylist', methods=['GET'])
def view_playlist():
    id_receive = request.args.get('id_give')
    print('id_receive:', id_receive)

    playlist_dict = db.playlists.find_one({'_id': ObjectId(id_receive)}) # _id를 기준으로 search
    playlist_json = parse_json(playlist_dict)
    return playlist_json

# dict를 json으로 바꿔주는 함수
def parse_json(data):
    return json.loads(json_util.dumps(data))

###홈
## 전체 플레이리스트 목록
@app.route('/list', methods=["GET"])
def allPlaylists():
    allLists = list(db.playlists.find({}, {'_id': False}))
    return jsonify({'data': allLists})

## 나의 플레이리스트 목록
@app.route('/mylist', methods=["GET"])
def myPlaylists():
    myLists = list(db.playlists.find({'user_name': session['user_name']}, {'_id': False}))
    return jsonify({'data': myLists})

## 회원가입 (비밀번호 암호화해서 저장하는 걸로 나중에 바꾸기)
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'GET':
        return render_template('signUp/signUp.html')
    else:
        newid_receive = request.form['newid_give']
        newpw_receive = request.form['newpw_give']
        newname_receive = request.form['newname_give']

        userinfo = {
            'user_id': newid_receive,
            'user_pw': newpw_receive,
            'user_name': newname_receive
        }

        if not (newid_receive and newpw_receive and newname_receive):
            return jsonify({'msg': '모두 입력해주세요'})
        else:
            db.users.insert_one(userinfo)
            return jsonify({'msg': '회원가입 완료'})

        
## 로그인 (비밀번호 암호화 방식이면 나중에 변경 필요)
@app.route('/login', methods = ['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('/login/login.html')
    else:
        id_receive = request.form['id_give']
        pw_receive = request.form['pw_give']
        user = db.users.find_one({'user_id':id_receive, 'user_pw':pw_receive})

        if user is None:
            return jsonify({'msg': '로그인에 실패했습니다'})
        else:
            session['user_id'] = id_receive     # 세션에 id 저장
            session['user_name'] = user['user_name']
            return jsonify({'msg': '로그인에 성공했습니다'})      # 임의

## 로그아웃
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('homework'))    # 맨 위 homework 함수로 가게됩니다(임의)


### 검색창
## 노래 검색
client_credentials_manager = SpotifyClientCredentials(client_id=SpotifyKey.id, client_secret=SpotifyKey.secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
@app.route('/searchAlbum', methods=['GET'])
def searchMusics():
    music_keyword = request.args.get('musicKeyword')
    print(music_keyword)
    # result = sp.search("let it be", limit=3, type='album')['albums']['items']
    result = sp.search(music_keyword, limit=30, type='album')['albums']['items']
    print(result)
    print('type:', type(result))
    return jsonify({'result': result})


## 검색한 노래가 담긴 플레이리스트 목록
@app.route('/search/playlists', methods=["GET"])
def searchPlaylists():
    keyword_receive = request.args.get('keyword_give')
    results = list(db.playlists.find({'playlist_music': {'$elemMatch': {'music_title': keyword_receive}}}, {'_id': False}))
    return jsonify({'data': results})

## 플레이리스트 선택을 위한 나의 플리 목록
@app.route('/search/select', methods=["GET"])
def selectPlaylist():
    myPlaylists = list(db.playlists.find({'user_name': session['user_name']}, {'_id': False}))
    return jsonify({'data': myPlaylists})

## 플레이리스트 선택 후 db에 노래 추가
@app.route('/search/select/add', methods=["POST"])
def addMusic():
    num_receive = int(request.form['num_give'])
    title_receive = request.form['title_give']
    artist_receive = request.form['artist_give']

    db.playlists.update_one({'playlist_num': num_receive}, {'$push': {'playlist_music': {'music_title': title_receive, 'music_artist': artist_receive}}});
    return jsonify({'msg': '플레이리스트에 노래 추가 완료!'})


### 마이페이지
## 마이페이지에서 새로운 플레이리스트 생성(받아오는 건 일단 제목만)
@app.route('/mypage/create', methods=["POST"])
def createPlaylist():
    title_receive = request.form['title_give']
    desc_receive = request.form['desc_give']
    num = db.playlists.count_documents({})
    listinfo = {
        'playlist_num': num + 1,
        'user_name': session['user_name'],
        'playlist_title': title_receive,
        'playlist_desc': desc_receive,
        'playlist_music': []
    }
    db.playlists.insert_one(listinfo)
    return jsonify({'msg': '플레이리스트 생성 완료!'})

@app.route('/mypage/delete', methods=['POST'])
def deletePLaylist():
    num_receive = int(request.form['num_give'])
    db.playlists.delete_one({'playlist_num': num_receive})
    for i in range(num_receive, db.playlists.count_documents({})+1):
        db.playlists.update_one({'playlist_num':i+1}, {'$set': {'playlist_num': i}})
    return jsonify({'msg': '플레이리스트 삭제 완료!'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
