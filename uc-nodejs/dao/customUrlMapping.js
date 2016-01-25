/**
 * Created by Administrator on 2015/9/8.
 */
var custom = {
    getNotice: "/AddAdAction!list.action",
    getTypeList: "/AddTypeAction!list.action",
    getFaqList: "/AddFaqAction!listByType.action",
    getFaqDetail: "/AddFaqAction!find.action",
    searchFAQ: "/AddFaqAction!query.action",
    
    getTypeParams: "/AddParamConfigAction!list.action",
    getQusList: "/AddQuestionAction!list.action",
    getQusDetail: "/AddQuestionAction!detail.action",
    submitQus: "/QuestionServlet",
    deleteQus: "/AddQuestionAction!delete.action",
    opScore: "/AddEvaluationAction!add.action"
};

module.exports = custom;