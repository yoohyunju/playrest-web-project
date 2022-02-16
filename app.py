from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

from pymongo import MongoClient

client = MongoClient('mongodb://test:test@localhost', 27017)  # id:password
# client = MongoClient('localhost', 27017)
db = client.makingproject


## HTML 화면 보여주기
@app.route('/')
def homework():
    return render_template('/home/index.html')


@app.route('/playlist')
def getPlaylist():
    return render_template('playlist.html')


## 회원가입 (비밀번호 암호화해서 저장하는 걸로 나중에 바꾸기)
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'GET':
        return render_template('index.html')
    else:
        newid_receive = request.form['newid_give']
        newpw_receive = request.form['newpw_give']
        newname_receive = request.form['newname_give']

        userinfo = {
            'user_id': newid_receive,
            'user_pw': newpw_receive,
            'user_name': newname_receive,
            'user_like': []
        }

        if not (newid_receive and newpw_receive and newname_receive):
            return jsonify({'msg': '모두 입력해주세요'})
        else:
            db.users.insert_one(userinfo)
            return jsonify({'msg': '회원가입 완료'})

        
## 로그인 (세션에 남기는 기능은 추후 구현 예정 / 비밀번호 암호화 방식이면 나중에 변경 필요)
@app.route('/login', methods = ['POST'])
def login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    user = db.users.find_one({'user_id':id_receive, 'user_pw':pw_receive})

    if user is None:
        return jsonify({'msg': '로그인에 실패했습니다'})
    else:
        return jsonify({'msg': '로그인에 성공했습니다'})


'''
# 주문하기(POST) API
@app.route('/order', methods=['POST'])
def save_order():
    name_receive = request.form['name_give']
    count_receive = request.form['count_give']
    address_receive = request.form['address_give']
    phone_receive = request.form['phone_give']

    doc = {
        'name': name_receive,
        'count': count_receive,
        'address': address_receive,
        'phone': phone_receive
    }
    db.orders.insert_one(doc)

    return jsonify({'result': 'success', 'msg': '주문 완료!'})


# 주문 목록보기(Read) API
@app.route('/order', methods=['GET'])
def view_orders():
    orders = list(db.orders.find({}, {'_id': False}))
    return jsonify({'result': 'success', 'orders': orders})

'''
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
