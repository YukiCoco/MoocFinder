//全局变量
var coursesJson;
const headers = { //抓包得到的Header
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGlrdS54dWV4aWJhby50ZWNoL2FwaS9tb2JpbGUvSW5kZXgvYXBwTG9naW4iLCJpYXQiOjE1NzAxMDYyMDksImV4cCI6MTg4NTQ2NjIwOSwibmJmIjoxNTcwMTA2MjA5LCJqdGkiOiJ5cGt0MU00RW5hQ0pZaG5mIiwib3BlbklkIjoib1JFNXIxREljaVlCRVNtLVRnUWhMUTNuZDZ4VSIsIndlY2hhdF9pZCI6Im9SRTVyMURJY2lZQkVTbS1UZ1FoTFEzbmQ2eFUiLCJ1bmlvbmlkIjoib3EySG8xWEdMZ0R6UFl2RjgwaGdSaUlfZVpacyIsImdvbmd6aG9uZyI6InpodWtlYmFvIn0.kDO4nz_pCUoMutY01YtkfpjFtXwp9ie19odhHrKegZY'
}
var courseId;

$(document).ready(function(){
    $('.modal').modal(); //消息弹窗
  });

$('form').submit(function () { 
    return false; //不刷新
});

function search(){
    showProgressBar();
    var data = {
        keyword : $('#input-name').prop('value')
    };
    if($('#rad-zhihuishu').prop('checked')){
        data['id'] = 8727;
    } else{
        data['id'] = 8728;
    }
    $.post("https://tiku.xuexibao.tech/api/mobile/Index/getGoods", data,
        function (response, textStatus, jqXHR) {
            $('#course-search-result').empty();
            coursesJson = response;
            loadCourses(coursesJson);
            $('#nav').empty(); //清除导航
            addNavItem('搜索结果','showCourses');
        },
        "json"
    );
    hideProgressBar();
}
/**
 * @param  {json} courses 加载课程内容
 */
function loadCourses(courses) {
    $('#course-search-result').empty();
    var model = "";
    $.ajax({
        type: "GET",
        async: false, //非异步获取 下面会用到
        url: "parts/course-card.html",
        dataType: "html",
        success: function (response) {
            model = response; //获取模版
        },
        error: function(jqXHR,textStatus,errorThrown){
            console.log(errorThrown);
        }
    });
    for (let index = 0; index < courses.length; index++) {
        const element = courses[index];
        var courseCard = $(model);
        courseCard.find('#course-title').text(element['_goods_name']);
        courseCard.find('#course-img').attr('src', element['_goods_img']);
        courseCard.find('#course-publisher').text('出版社：' + element['_press']);
        courseCard.find('#course-authers').text('作者：' + element['_author']);
        courseCard.find('#course-tags').text(element['classify']);
        courseCard.find('#course-id').text(index); //注入id
        $('#course-search-result').append(courseCard);
    }
}

function showCourseDetail(ele){
    showProgressBar();
    //你爸爸的爸爸233
    var id = $(ele).parent().parent().siblings('span').text();
    var model = "";
    var detail;
    courseId = coursesJson[id]['id']; //先获取课程id 查答案用得到
    //获取detail model
    $.ajax({
        type: "GET",
        async: false, //非异步获取 下面会用到
        url: "parts/course-detail.html",
        dataType: "html",
        success: function (response) {
            model = response; //获取模版
        },
        error: function(jqXHR,textStatus,errorThrown){
            console.log(errorThrown);
        }
    });
    data = {
        id : coursesJson[id]['id']
    }
    var courseDetail = $(model);
    //获取内容
    $.ajax({
        type: "POST",
        url: "https://tiku.xuexibao.tech/api/mobile/Index/goodsDetail",
        data: data,
        async: false,
        headers : headers, //填入抓包的Header
        success: function (response) {
            detail = response;
        },
        error: function(jqXHR,textStatus,errorThrown){
            console.log(errorThrown);
        }
    });

    addNavItem('课程内容');
    $('#course-search-result').empty();
    for (let index = 0; index < detail['free']['file'].length; index++) {
        const element = detail['free']['file'][index];
        var option = $('<option></option>').text(element['name']).val(index);
        courseDetail.find('#course-selector').append(option);
    }

    courseDetail.find('#course-detail-img').attr('src', coursesJson[id]['_goods_img']);
    courseDetail.find('#course-detail-title').text(coursesJson[id]['_goods_name']);
    courseDetail.find('#course-detail-authors').text('作者：' + coursesJson[id]['_author']);
    courseDetail.find('#course-detail-press').text('出版社：' + coursesJson[id]['_press']);
    $('#course-search-result').append(courseDetail);

    hideProgressBar();
}

//回到页面展示Courses
function showCourses(){
    $('#nav').empty();
    addNavItem('搜索结果','showCourses');
    loadCourses(coursesJson);
}

//添加导航内容
function addNavItem(str,funcName){
    if(funcName == null){
        $('#nav').append('<a class="breadcrumb mouse-pointer">' + str + '</a>');
    } else{
        $('#nav').append('<a class="breadcrumb mouse-pointer" onclick="' + funcName + '()">' + str + '</a>');
    }
    $('#nav-divider').removeClass('hidden');
}

function searchAnwser(){
    data = {
        goods_id : courseId,
        index : Number($(":selected").val()),
        content : $('#course-input').prop('value')
    }
    console.log('id:' + courseId);
    var result;
    $.ajax({
        type: "POST",
        headers : headers,
        url: "https://tiku.xuexibao.tech/api/mobile/Index/searchQuestion",
        data: data,
        async: false,
        success: function (response) {
            result = response;
        },
        error: function(jqXHR,textStatus,errorThrown){
            showToast(errorThrown);
        }
    });
    if(result['error'] != 0){
        showToast(result['msg'],'error');
        return;
    }
    showToast('共找到' + result['data'].length + '个答案');
    var anwserItem = $(".answer-item-temple"); //指向Courses模版
    $('#answer-content').empty();
    anwserItem.removeClass('hidden');
    anwserItem.removeClass('answer-item-temple');
    for (let index = 0; index < result['data'].length; index++) {
        const element = result['data'][index];
        anwserItem.find('.question').text('题目：' + element['question']);
        anwserItem.find('.anwser').text('答案：' + element['answer']);
        $(anwserItem).clone().appendTo('#answer-content'); //从第一个模版Clone出来
    }
    anwserItem.addClass('answer-item-temple');
    anwserItem.addClass('hidden'); //把模版隐藏
    //$('.answer-content').css('display','inline');
}

function showToast(msg,msgtype) {
    if(msgtype == 'error'){
        M.toast({html: '<i class="material-icons"> error </i>' + msg,classes: 'toast-warning'}) //出错
        return;
    }
    M.toast({html: '<i class="material-icons">done</i>' + msg})
}

function giveMeCola(){

}

function showProgressBar() {
    $('.progress').removeClass('hidden');
}

function hideProgressBar() {
    $('.progress').addClass('hidden');
}

//跳转回原页面
//Time machine！
function timeJump() {
    location.reload();
}