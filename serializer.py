from dbModel import *
from datetime import datetime

def member_serializer(Member):
    return{
        'mem_id': Member.mem_id,
        'mem_email': Member.mem_email,
        'mem_name': Member.mem_name,
        'mem_pass': Member.mem_pass
    }
def reactMember_serializer(Member):
    return{

        'label': Member.mem_name,
        'value': Member.mem_id
    }
def reactProjectMember_serializer(ProjectMember):
    return{

        'label': Member.query.filter_by(mem_id=ProjectMember.mem_id).first().mem_name,
        'value': ProjectMember.mem_id
    }

def project_serializer(Projrct):
    return{
        'prj_id' : Projrct.prj_id,
        'prj_name' : Projrct.prj_name,
        'prj_sdate' : Projrct.prj_sdate.strftime("%Y-%m-%d"),
        'prj_edate' : Projrct.prj_edate.strftime("%Y-%m-%d"),
        'prj_status' : Projrct.prj_status,
        'prj_mem' : Projrct.prj_mem,
        'db_Project_ProjectMember' :[*map(projectmember_serializer,Projrct.db_Project_ProjectMember)]
        #'db_Project_ProjectCost' :[*map(projectCost_serializer,Projrct.db_Project_ProjectCost)]
        
    }

def projectmember_serializer(projectMember):
    return{
        'mem_id':projectMember.mem_id ,
        'mem_name' : Member.query.filter_by(mem_id=projectMember.mem_id).first().mem_name,
        'pm_confirm' :projectMember.pm_confirm
    }

def projectCost_serializer(projectCost):
    return{
        'prj_id':projectCost.prj_id,
        'pc_id':projectCost.pc_id ,
        'pc_status':projectCost.pc_status ,
        'pc_name':projectCost.pc_name ,
        'pc_date':projectCost.pc_date.strftime("%Y-%m-%d"),
        'pc_amount':projectCost.pc_amount ,
        'pc_mem':projectCost.pc_mem ,
        'updid':projectCost.updid ,
        'updtime':projectCost.updtime.strftime("%Y-%m-%d"),
        'db_ProjectCost_CostDetail':[*map(costDetail_serializer,projectCost.db_ProjectCost_CostDetail)]
    }
def costDetail_serializer(costDetail):
    return{
        'pc_id':costDetail.pc_id ,
        'mem_id':costDetail.mem_id ,
        'mem_name' : Member.query.filter_by(mem_id=costDetail.mem_id).first().mem_name,
        'pm_type':costDetail.pm_type ,
        'pm_amt':costDetail.pm_amt ,
        'pm_item':costDetail.pm_item ,
        'pm_confirm':costDetail.pm_confirm ,
        'updid':costDetail.updid ,
        'updtime':costDetail.updtime 
    }