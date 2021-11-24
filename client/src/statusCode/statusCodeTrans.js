export const codeTrans = (code) => {
    switch(code){
        case '010' :
            return '參與確認中';
        case '020' :
            return '成行';
        case '090' :
            return '帳務確認中';
        case '099' :
            return '結束';
        case '110' :
            return '確認中';
        case '199' :
            return  '完成';
        case '210' :
            return '好友確認中';
        case '299' :
            return '好友確認完成';
        default:
            return 'not found';
    }
}

export const confirmTrans = (flag) => {
    return flag ? '待確認':'已確認';
    //switch(flag){
    //    case 'Y' :
    //        return '已確認';
    //    case 'N' :
    //        return '待確認';
    //    default:
    //        return 'not found';
    //}
}