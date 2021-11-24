import time
from flask import Flask, request, make_response
from dbModel import *
from serializer import *
from flask import jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity
)
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///api.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)
# 設定 JWT 密鑰
app.config['JWT_SECRET_KEY'] = 'costshare'
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(seconds=3)

jwt = JWTManager(app)

with app.app_context():
    print('初始化資料庫')
    #db.drop_all()
    db.create_all()

@app.route('/time')
def get_current_time():
    print(app.config)
    return {'time': time.time() }

@app.route('/')
def index():
   return "hello raywe"
   
#註冊
@app.route('/user/signup', methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # get the post data
    post_data = request.get_json()
    # check if user already exists
    print(post_data)
    user = Member.query.filter_by(mem_email=post_data.get('mem_email')).first()
    if not user:

        print(post_data.get('mem_email'))
        try:
            user = Member(
                mem_email=post_data.get('mem_email'),
                mem_name=post_data.get('mem_name'),
                mem_pass=post_data.get('mem_pass'),
                mem_birth=datetime.strptime(
                    '2021-01-01 00:00:00', '%Y-%m-%d %H:%M:%S'),
                mem_enable='Y',
                updid=0
            )
            print(user)
            # insert the user
            db.session.add(user)
            db.session.commit()
            # generate the auth token
            responseObject = {
                'access_token': create_access_token(identity=user.mem_id),
                'refresh_token': create_refresh_token(identity=user.mem_id),
                'result': {'mem_id':user.mem_id,'mem_name':user.mem_name,'mem_email':user.mem_email}
            }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            errMsg =str(e)
            if('UNIQUE constraint failed: member.mem_name' in errMsg ):
                errMsg = '暱稱已被使用'

            responseObject = {
                'status': 'fail',
                'message': errMsg
            }
            return make_response(jsonify(responseObject)), 500
    else:
        responseObject = {
            'status': 'fail',
            'message': '此信箱已註冊帳號。',
        }
        return make_response(jsonify(responseObject)), 202

#登入
@app.route('/user/signin', methods=['POST'])
def signin():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    # get the post data
    post_data = request.get_json()
    print(post_data)
    try:
        # fetch the user data
        user = Member.query.filter_by(
            mem_email=post_data.get('mem_email')
        ).first()
        if user:
            if user.mem_pass == post_data.get('mem_pass'):
                print(user.mem_pass+';'+post_data.get('mem_pass'))
                responseObject = {
                    'access_token': create_access_token(identity=user.mem_id),
                    'refresh_token': create_refresh_token(identity=user.mem_id),
                    'result': {'mem_id':user.mem_id,'mem_name':user.mem_name,'mem_email':user.mem_email}
                }
                return make_response(jsonify(responseObject)), 200
            
        responseObject = {
            'status': 'fail',
            'message': '使用者不存在 或 密碼錯誤。'
        }
        return make_response(jsonify(responseObject)), 202
    except Exception as e:
        print(e)
        responseObject = {
            'status': 'fail',
            'message': e
        }
        return make_response(jsonify(responseObject)), 500

#取得所有行程
@app.route('/getProjects', methods=['GET'])
@jwt_required()
def getProjects():
    Projects = Project.query.join(Project.db_Project_ProjectMember, aliased=True).filter_by(mem_id=get_jwt_identity()).all()
    return jsonify([*map(project_serializer,Projects)])

#取得指定行程
@app.route('/getProject/<int:id>', methods=['GET'])
@jwt_required()
def getProject(id):
    project_info = Project.query.filter_by(prj_id=id).first()
    return jsonify(project_serializer(project_info))

#取得行程所有消費紀錄
@app.route('/getProjectCosts/<int:prj_id>', methods=['GET'])
def getProjectCosts(prj_id):
    ProjectCosts = ProjectCost.query.filter_by(prj_id=prj_id).all()
    print(ProjectCosts)
    print(id)
    return jsonify([*map(projectCost_serializer,ProjectCosts)])

#取得指定消費紀錄
@app.route('/project/<int:prj_id>/getProjectCost/<int:pc_id>', methods=['GET'])
@jwt_required()
def getProjectCost(prj_id,pc_id):
    Project_info = Project.query.filter_by(prj_id = prj_id ).first()
    ProjectMember_info = ProjectMember.query.filter_by(prj_id = prj_id,mem_id = get_jwt_identity()).first()
    if Project_info and ProjectMember_info:
        projectCost_info = ProjectCost.query.filter_by(pc_id=pc_id).first()
        if projectCost_info:
            return projectCost_serializer(projectCost_info)
        else:
            responseObject = {
            'status' : 'fail',
            'message' : '找不到消費紀錄。'
            }
            return make_response(jsonify(responseObject)), 404
        
    else:
        responseObject = {
            'status' : 'fail',
            'message' : '找不到行程 或 您沒有權限。'
        }
        return make_response(jsonify(responseObject)), 404

#會員紀錄更新
@app.route('/updMember', methods=['PATCH'])
@jwt_required()
def updMember():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    # get the post data
    post_data = request.get_json()
    Member_info = Member.query.filter_by(mem_id = get_jwt_identity()).first()
    if not Member_info:
        responseObject = {
                'status': 'fail',
                'message': 'Member does not exist or no authority.'
            }
        return make_response(jsonify(responseObject)), 404
    else:
        try:
            
            Member_info.mem_name = post_data.get('mem_name',Member_info.mem_name)
            Member_info.mem_pass = post_data.get('mem_pass',Member_info.mem_pass)
            Member_info.mem_birth = datetime.strptime(post_data.get('mem_birth',str(Member_info.mem_birth)), '%Y-%m-%d %H:%M:%S')
            Member_info.mem_enable = post_data.get('mem_enable',Member_info.mem_enable)

            db.session.add(Member_info)
            db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully update Member.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401

#新增行程
@app.route('/addProject', methods=['POST'])
@jwt_required()
def addProject():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    # get the post data
    post_data = request.get_json()
    print(post_data)
    try:
        Project_info = Project(
            prj_name = post_data.get('prj_name'),
            prj_sdate = datetime.strptime(post_data.get('prj_sdate'), '%Y-%m-%d'),
            prj_edate = datetime.strptime(post_data.get('prj_edate'), '%Y-%m-%d'),
            prj_status = '010',
            prj_mem = get_jwt_identity(),
            updid = get_jwt_identity()
        )
        ProjectMembers = post_data.get('db_Project_ProjectMember')
        print(ProjectMembers)
        if ProjectMembers :
            for item in ProjectMembers:
                Project_info.db_Project_ProjectMember.append(
                    ProjectMember(
                        mem_id = item.get('mem_id'),
                        pm_confirm = 'Y' if item.get('mem_id')== get_jwt_identity() else item.get('pm_confirm','N'),
                        #item.get('mem_id')==''?'Y':item.get('pm_confirm','N'),
                        updid = get_jwt_identity()
                    ))
                
        # insert the project
        db.session.add(Project_info)
        db.session.commit()
        
        responseObject = {
                'status': 'success',
                'message': 'Successfully create project.'
            }
        return make_response(jsonify(project_serializer(Project_info))), 201
    except Exception as e:
        print(e)
        responseObject={
            'status': 'fail',
            # 'Some error occurred. Please try again.'
            'message': str(e)
        }
        return make_response(jsonify(responseObject)), 401

#更新行程
@app.route('/updProject/<int:id>',methods=['PATCH'])
@jwt_required()
def updProject(id):
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    # get the post data
    post_data = request.get_json()
    Project_info = Project.query.filter_by(prj_mem = get_jwt_identity(),prj_id = id ).first()
    if Project_info:
        try:
            Project_info.prj_name = post_data.get('prj_name',Project_info.prj_name)
            Project_info.prj_sdate = datetime.strptime(post_data.get('prj_sdate',Project_info.prj_sdate.strftime("%Y-%m-%d")), '%Y-%m-%d')
            Project_info.prj_edate = datetime.strptime(post_data.get('prj_edate',Project_info.prj_edate.strftime("%Y-%m-%d")), '%Y-%m-%d')
            Project_info.prj_status = post_data.get('prj_status',Project_info.prj_status)

            new_db_Project_ProjectMember = post_data.get('db_Project_ProjectMember')
            if new_db_Project_ProjectMember :
                oldList = []          ## 空列表
                newList = []          ## 空列表
                for item in Project_info.db_Project_ProjectMember:
                    print(item)
                    oldList.append(item.mem_id)
                for item in new_db_Project_ProjectMember:
                    print(item)
                    newList.append(item.get('mem_id'))

                addList=set(newList).difference(set(oldList))
                delList=set(oldList).difference(set(newList))

                for item in addList:
                    Project_info.db_Project_ProjectMember.append(
                            ProjectMember(
                                mem_id = item,
                                pm_confirm = 'N',
                                updid = get_jwt_identity()
                            ))
                for item in delList:
                    ProjectMember_info = Project_info.db_Project_ProjectMember.filter_by(mem_id=item).first_or_404()
                    db.session.delete(ProjectMember_info)
                if addList:
                    Project_info.prj_status ='010'

            db.session.add(Project_info)
            db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully update project.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
                'status': 'fail',
                'message': 'Project does not exist or no authority.'
            }
        return make_response(jsonify(responseObject)), 404

#刪除行程     
@app.route('/delProject/<int:id>', methods=['DELETE'])
@jwt_required()
def delProject(id):
    Project_info = Project.query.filter_by(prj_mem = get_jwt_identity(),prj_id = id ).first()
    if Project_info:
        try:
            db.session.delete(Project_info)
            db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully delete project.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                # 'Some error occurred. Please try again.'
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
            'status': 'fail',
            'message': 'Project does not exists or no authority.',
        }
        return make_response(jsonify(responseObject)), 202

#確認參與行程
@app.route('/project/<int:prj_id>/projectMemberConfirm', methods=['PATCH'])
@jwt_required()
def projectMemberConfirm(prj_id):
    print(prj_id)
    print(get_jwt_identity())
    ProjectMember_info = ProjectMember.query.filter_by(prj_id = prj_id,mem_id = get_jwt_identity()).first()
    if ProjectMember_info:
        try:
            ProjectMember_info.pm_confirm = 'Y'

            db.session.add(ProjectMember_info)
            db.session.commit()

            unConfirm = ProjectMember.query.filter_by(prj_id = prj_id, pm_confirm = 'N').first()
            print(unConfirm)
            if not unConfirm: 
                Project_info = Project.query.filter_by(prj_id = prj_id) .first()
                Project_info.prj_status ='020'
                db.session.add(Project_info)
                db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully update project member.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
                'status': 'fail',
                'message': 'Project member does not exist or no authority.'
            }
        return make_response(jsonify(responseObject)), 404

#拒絕參與行程
@app.route('/project/<int:prj_id>/projectMemberCancel', methods=['DELETE'])
@jwt_required()
def projectMemberCancel(prj_id):
    print(prj_id)
    ProjectMember_info = ProjectMember.query.filter_by(prj_id = prj_id,mem_id = get_jwt_identity()).first()
    print(ProjectMember_info)
    if ProjectMember_info:
        try:
            db.session.delete(ProjectMember_info)
            db.session.commit()

            unConfirm = ProjectMember.query.filter_by(prj_id = prj_id, pm_confirm = 'N')
            if not unConfirm: 
                Projrct_info = Project.query.finter_by(prj_id = prj_id) .first()
                Projrct_info.prj_status ='020'
                db.session.add(Project_info)
                db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': '成功取消參與行程.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401

    else:
        responseObject = {
            'status': 'fail',
            'message': 'Project cost does not exists or no authority.',
        }
        return make_response(jsonify(responseObject)), 202

#新增消費紀錄
@app.route('/addProjectCost', methods=['POST'])
@jwt_required()
def addProjectCost():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    # get the post data
    post_data = request.get_json()
    print(post_data)
    print(get_jwt_identity())
    projectMember_info = ProjectMember.query.filter_by(mem_id = get_jwt_identity() ,prj_id = post_data.get('prj_id',0) ).first()
    print(projectMember_info)
    if projectMember_info:
        try:
            ProjectCost_info = ProjectCost(
                prj_id = projectMember_info.prj_id,
                pc_status = '110', #消費確認中
                pc_name = post_data.get('pc_name'),
                pc_date = datetime.strptime(str(post_data.get('pc_date')), '%Y-%m-%d'),
                pc_amount = post_data.get('pc_amount'),
                pc_mem = get_jwt_identity(),
                updid = get_jwt_identity()
            )

            db_ProjectCost_CostDetail = post_data.get('db_ProjectCost_CostDetail')
            if db_ProjectCost_CostDetail :
                for item in db_ProjectCost_CostDetail:
                    print(item)
                    ProjectCost_info.db_ProjectCost_CostDetail.append(
                        CostDetail(
                            mem_id = item.get('mem_id'),
                            pm_type = item.get('pm_type'),
                            pm_amt = item.get('pm_amt'),
                            pm_item = item.get('pm_item',''),
                            pm_confirm = 'N',
                            updid = get_jwt_identity()
                        ))
            # insert the projectCost
            db.session.add(ProjectCost_info)
            db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully create projectCost.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
            'status' : 'fail',
            'message' : '找不到行程 或 您沒有權限。'
        }
        return make_response(jsonify(responseObject)), 404

#更新消費紀錄
@app.route('/project/<int:prj_id>/updProjectCost/<int:pc_id>', methods=['PATCH'])
@jwt_required()
def updProjectCost(prj_id,pc_id):
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    # get the post data
    post_data = request.get_json()
    print(post_data)
    ProjectMember_info = ProjectMember.query.filter_by(prj_id = prj_id,mem_id = get_jwt_identity()).first()
    ProjectCost_info = ProjectCost.query.filter_by(pc_id = pc_id).first()
    print(ProjectMember_info)
    print(ProjectCost_info)
    if ProjectMember_info and ProjectCost_info:
        try:
            ProjectCost_info.pc_status = post_data.get('pc_status',ProjectCost_info.pc_status)
            ProjectCost_info.pc_name = post_data.get('pc_name',ProjectCost_info.pc_name)
            ProjectCost_info.pc_date = datetime.strptime(post_data.get('pc_date',str(ProjectCost_info.pc_date)), '%Y-%m-%d')
            ProjectCost_info.pc_amount = post_data.get('pc_amount',ProjectCost_info.pc_amount)
            ProjectCost_info.updid = get_jwt_identity()

            new_db_ProjectCost_CostDetail = post_data.get('db_ProjectCost_CostDetail')
            if new_db_ProjectCost_CostDetail :
                for item in new_db_ProjectCost_CostDetail:
                    if item.get('mem_id', None) and item.get('pm_type',None):
                        old_item = ProjectCost_info.db_ProjectCost_CostDetail.filter_by(mem_id=item['mem_id'],pm_type=item['pm_type']).first()
                        if(old_item):
                            old_item.pm_amt = item.get('pm_amt',old_item.pm_amt)
                            old_item.pm_item = item.get('pm_item',old_item.pm_item)
                            old_item.pm_confirm = item.get('pm_confirm',old_item.pm_confirm)
                            old_item.updid = get_jwt_identity()
                        else:
                            ProjectCost_info.db_ProjectCost_CostDetail.append(
                                CostDetail(
                                    mem_id = item.get('mem_id'),
                                    pm_type = item.get('pm_type'),
                                    pm_amt = item.get('pm_amt'),
                                    pm_item = item.get('pm_item',''),
                                    pm_confirm = 'N',
                                    updid = get_jwt_identity()
                                )
                            )
                
                oldList = []          ## 空列表
                newList = []          ## 空列表
                oldType1 = list(filter(lambda x: x.pm_type == '1', ProjectCost_info.db_ProjectCost_CostDetail.all()))
                newType1 = list(filter(lambda x: x['pm_type'] == '1', new_db_ProjectCost_CostDetail))
                for item in oldType1:
                    print('old')
                    print(item)
                    oldList.append(item.mem_id)
                for item in newType1:
                    print('new')
                    print(item)
                    newList.append(item.get('mem_id'))

                delList=set(oldList).difference(set(newList))
                print(delList)
                for item in delList:
                    print(item)
                    CostDetail_info = ProjectCost_info.db_ProjectCost_CostDetail.filter_by(mem_id=item,pm_type='1').first_or_404()
                    db.session.delete(CostDetail_info)
                
                oldList = []          ## 空列表
                newList = []          ## 空列表
                oldType2 = list(filter(lambda x: x.pm_type == '2', ProjectCost_info.db_ProjectCost_CostDetail.all()))
                newType2 = list(filter(lambda x: x['pm_type'] == '2', new_db_ProjectCost_CostDetail))
                for item in oldType2:
                    oldList.append(item.mem_id)
                for item in newType2:
                    newList.append(item.get('mem_id'))

                delList=set(oldList).difference(set(newList))
                print(delList)

                for item in delList:
                    print(item)
                    CostDetail_info = ProjectCost_info.db_ProjectCost_CostDetail.filter_by(mem_id=item,pm_type='2').first_or_404()
                    db.session.delete(CostDetail_info)

            db.session.add(ProjectCost_info)
            db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully update project cost.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
                'status': 'fail',
                'message': '行程不存在 或 沒有權限'
            }
        return make_response(jsonify(responseObject)), 404

#刪除消費紀錄
@app.route('/project/<int:prj_id>/delProjectCost/<int:pc_id>', methods=['DELETE'])
@jwt_required()
def delProjectCost(prj_id,pc_id):
    ProjectMember_info = ProjectMember.query.filter_by(prj_id = prj_id,mem_id = get_jwt_identity()).first()
    ProjectCost_info = ProjectCost.query.filter_by(pc_id = pc_id).first()
    if ProjectCost_info and ProjectMember_info:
        try:
            db.session.delete(ProjectCost_info)
            db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully delete project cost.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401

    else:
        responseObject = {
            'status': 'fail',
            'message': 'Project cost does not exists or no authority.',
        }
        return make_response(jsonify(responseObject)), 202
 
#確認消費明細
@app.route('/project/<int:prj_id>/projectCost/<int:pc_id>/projectCostConfirm', methods=['PATCH'])
@jwt_required()
def projectCostConfirm(prj_id,pc_id):
    print(prj_id)
    print(get_jwt_identity())
    CostDetail_list = CostDetail.query.filter_by(pc_id = pc_id,mem_id = get_jwt_identity())
    if CostDetail_list:
        try:
            for item in CostDetail_list:
                item.pm_confirm = 'Y'
                db.session.add(item)
            db.session.commit()

            unConfirm = CostDetail.query.filter_by(pc_id = pc_id, pm_confirm = 'N').first()
            print(unConfirm)
            if not unConfirm: 
                ProjectCost_info = ProjectCost.query.filter_by(prj_id = prj_id,pc_id=pc_id) .first()
                ProjectCost_info.pc_status ='199'
                db.session.add(ProjectCost_info)
                db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': '成功確認消費明細'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
                'status': 'fail',
                'message': 'Project Cost does not exist or no authority.'
            }
        return make_response(jsonify(responseObject)), 404

@app.route('/updCostDetail', methods=['PATCH'])
@jwt_required()
def updCostDetail():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    # get the post data
    post_data = request.get_json()
    CostDetail_info = CostDetail.query.filter_by(pc_id = post_data.get('pc_id'),
                                                 mem_id= get_jwt_identity(),
                                                 pm_type=post_data.get('pm_type')).first_or_404()
    if CostDetail_info:
        try:
            CostDetail_info.pm_confirm = post_data.get('pm_confirm',CostDetail_info.pm_confirm)
            CostDetail_info.updid = get_jwt_identity()

            db.session.add(CostDetail_info)
            db.session.commit()

            responseObject = {
                    'status': 'success',
                    'message': 'Successfully update cost detail.'
                }
            return make_response(jsonify(responseObject)), 201
        except Exception as e:
            print(e)
            responseObject={
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
                'status': 'fail',
                'message': 'Cost detail does not exist or no authority.'
            }
        return make_response(jsonify(responseObject)), 404

@app.route('/login1', methods=['POST'])
def login1():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    username=request.json.get('username', None)
    password=request.json.get('password', None)

    if username != 'test' or password != 'test':
        return jsonify({"msg": "Bad username or password"}), 401

     # Use create_access_token() and create_refresh_token() to create our
    # access and refresh tokens
    ret={
        'access_token': create_access_token(identity=username),
        'refresh_token': create_refresh_token(identity=username)
    }
    return jsonify(ret), 200

@app.route('/getMember', methods=['GET'])
@jwt_required()
def getMember():
    expected="查無使用者"
    memberItem=Member.query.all()
    return jsonify([*map(member_serializer1,memberItem)])

@app.route('/getReactMember', methods=['GET'])
@jwt_required()
def getReactMember():
    expected="查無使用者"
    memberItem=Member.query.all()
    return jsonify([*map(reactMember_serializer,memberItem)])

@app.route('/getProjectMembers/<int:prj_id>', methods=['GET'])
@jwt_required()
def getPrjectMembers(prj_id):
    expected="查無使用者"
    print(prj_id)
    projectMembers=ProjectMember.query.filter_by(prj_id=prj_id).all()
    return jsonify([*map(reactProjectMember_serializer,projectMembers)])

#取得行程所有消費紀錄
@app.route('/getProjectCosts1/<int:prj_id>', methods=['GET'])
@jwt_required()
def getProjectCosts1(prj_id):
    ProjectCosts = ProjectCost.query.filter_by(prj_id=prj_id).all()
    print(ProjectCosts)
    print(id)
    return jsonify([*map(projectCost_serializer,ProjectCosts)])

if __name__ == '__main__':
    app.run(debug=True)
