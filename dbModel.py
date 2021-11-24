from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db =SQLAlchemy()
class Member(db.Model): #會員資料表
    mem_id = db.Column(db.Integer, primary_key=True, autoincrement=True) #會員編號
    mem_email = db.Column(db.String(120), unique=True, nullable=False)   #會員帳號(mail)
    mem_name = db.Column(db.String(30), unique=True, nullable=False)     #顯示名稱
    mem_pass = db.Column(db.String(30), nullable=False)                  #密碼
    mem_birth = db.Column(db.DateTime, nullable=False)                   #生日
    mem_enable = db.Column(db.String(1),nullable=False)                  #啟用註記(Y/N)
    updid = db.Column(db.Integer, nullable=False)                        #異動人
    updtime = db.Column(db.DateTime, onupdate=datetime.now, default=datetime.now, nullable=False) #異動時間

    db_Member_Project = db.relationship("Project", backref="member", lazy='dynamic', cascade="all, delete-orphan")
    db_Member_Friends = db.relationship("Friends", backref="member", lazy='dynamic', cascade="all, delete-orphan")
    def __repr__(self):
        return 'Member Add ' + str(self.mem_id)+ ',' + str(self.mem_name) 

class Project(db.Model): #行程表
    prj_id = db.Column(db.Integer, primary_key=True, autoincrement=True)            #行程序號
    prj_name = db.Column(db.String(120), nullable=False)                            #行程名稱
    prj_sdate = db.Column(db.DateTime, nullable=False)                              #起始日期
    prj_edate = db.Column(db.DateTime, nullable=False)                              #結束日期
    prj_status = db.Column(db.String(3), nullable=False)                            #行程狀態(ref:Status[sta_id])
    prj_mem = db.Column(db.Integer, db.ForeignKey('member.mem_id'), nullable=False) #行程建立者
    updid = db.Column(db.Integer, nullable=False)                                   #異動人
    updtime = db.Column(db.DateTime, onupdate=datetime.now, default=datetime.now, nullable=False) #異動時間

    db_Project_ProjectMember = db.relationship("ProjectMember", backref="project" ,lazy='dynamic', cascade="all, delete-orphan")
    db_Project_ProjectCost = db.relationship("ProjectCost", backref="project", lazy='dynamic', cascade="all, delete-orphan")

    def __repr__(self):
        return 'Project Add '+str(self.prj_id)+','+str(self.prj_name) 

class ProjectMember(db.Model): #行程成員表
    prj_id = db.Column(db.Integer, db.ForeignKey('project.prj_id'), primary_key=True) #行程序號
    mem_id = db.Column(db.Integer, primary_key=True)                                  #會員帳號
    pm_confirm = db.Column(db.String(1), nullable=False)                              #確認情形(Y/N)
    updid = db.Column(db.Integer, nullable=False)                                     #異動人
    updtime = db.Column(db.DateTime, onupdate=datetime.now, default=datetime.now, nullable=False) #異動時間

    def __repr__(self):
        return 'ProjectMember Add '+str(self.prj_id)+','+str(self.mem_id) 

class ProjectCost(db.Model): #行程消費表
    prj_id = db.Column(db.Integer, db.ForeignKey('project.prj_id'))     #行程序號
    pc_id = db.Column(db.Integer, primary_key=True, autoincrement=True) #消費序號
    pc_status = db.Column(db.String(3), nullable=False)                 #消費狀態(ref:Status[sta_id])
    pc_name = db.Column(db.String(120), nullable=False)                 #消費店家
    pc_date = db.Column(db.DateTime, nullable=False)                    #消費日期
    pc_amount = db.Column(db.Integer,nullable=False)                    #消費金額
    pc_mem = db.Column(db.Integer, nullable=False)                      #消費建立者
    updid = db.Column(db.Integer, nullable=False)                       #異動人
    updtime = db.Column(db.DateTime, onupdate=datetime.now, default=datetime.now, nullable=False) #異動時間

    db_ProjectCost_CostDetail = db.relationship("CostDetail", backref="projectcost", lazy='dynamic', cascade="all, delete-orphan")

    def __repr__(self):
        return 'ProjectCost Add '+str(self.prj_id)+','+str(self.pc_id)+','+str(self.pc_name)

class CostDetail(db.Model): #消費明細表
    pc_id = db.Column(db.Integer, db.ForeignKey('project_cost.pc_id'), primary_key=True) #消費序號
    mem_id = db.Column(db.Integer, primary_key=True)    #會員帳號
    pm_type = db.Column(db.String(1), primary_key=True) #參與項目(1.墊付者 2.消費者)
    pm_amt = db.Column(db.Integer, nullable=False)      #金額
    pm_item = db.Column(db.String(120), nullable=False) #消費項目
    pm_confirm = db.Column(db.String(1),nullable=False) #消費情形(Y:已確認 N:待確認)
    updid = db.Column(db.Integer, nullable=False)       #異動人
    updtime = db.Column(db.DateTime, onupdate=datetime.now, default=datetime.now, nullable=False) #異動時間

    def __repr__(self):
        return 'CostDetail Add '+str(self.pc_id)+','+str(self.mem_id)+','+str(self.pm_item)+','+str(self.pm_amt)

class Friends(db.Model): #好友表
    mem_id = db.Column(db.Integer, db.ForeignKey('member.mem_id'), primary_key=True) #會員帳號
    fri_id = db.Column(db.Integer, primary_key=True)                                 #好友帳號
    fri_status = db.Column(db.String(3), nullable=False)                             #好友狀態
    updid = db.Column(db.Integer, nullable=False)                                    #異動人
    updtime = db.Column(db.DateTime, onupdate=datetime.now, default=datetime.now, nullable=False) #異動時間

    def __repr__(self):
        return 'Friends Add '+str(self.mem_id)+','+str(self.fri_id)

class Status(db.Model): #確認狀態代碼表
    sta_type = db.Column(db.String(1), primary_key=True) #狀態類別
    sta_id = db.Column(db.String(3), primary_key=True)   #狀態代碼
    sta_name = db.Column(db.String(30), nullable=False)  #狀態名稱
    updid = db.Column(db.Integer, nullable=False)        #異動人
    updtime = db.Column(db.DateTime, onupdate=datetime.now, default=datetime.now, nullable=False) #異動時間

    def __repr__(self):
        return 'Status Add '+str(self.sta_type)+','+str(self.sta_id)+','+str(self.sta_name)

if __name__ == '__main__':
    manager.run()