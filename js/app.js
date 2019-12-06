//全局变量
var coursesJson;
var Authorizations = [ //抓包得到的Token 因接口请求限制需要几个微信账号去绑定助课宝
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGlrdS54dWV4aWJhby50ZWNoL2FwaS9tb2JpbGUvSW5kZXgvYXBwTG9naW4iLCJpYXQiOjE1NzU2MzA5MzAsImV4cCI6MTg5MDk5MDkzMCwibmJmIjoxNTc1NjMwOTMwLCJqdGkiOiJ2VDlYZTkxcXRZaWMwamR3Iiwib3BlbklkIjoib1JFNXIxSTVFTzZEYVAydzYwbWRXUzhlLW16ayIsIndlY2hhdF9pZCI6Im9SRTVyMUk1RU82RGFQMnc2MG1kV1M4ZS1temsiLCJ1bmlvbmlkIjoib3EySG8xVy1iN2dzaUNoLXZPRlBWVk1NalVJOCIsImdvbmd6aG9uZyI6InpodWtlYmFvIn0.ed6ZRuQ9RCXVhDfE8QJiS_Bx7b9cDqNUGYO5hFAOMfA'
];
    
const headers = { 
    Authorization: Authorizations[0]
}

var courseId;

$(document).ready(function(){
    $('.modal').modal(); //消息弹窗初始化
  });

$('form').submit(function () { 
    return false; //表单提交不刷新
});

//音乐播放器
const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay : true,
    audio: [{
        name: 'ソリテュード',
        artist: '光宗信吉',
        url: 'https://yukino.nos-eastchina1.126.net/back-music.mp3',
        cover: 'https://yukino.nos-eastchina1.126.net/3234763211470293.jpeg',
    }]
});

/* 实力白写代码55555555555555555555555555555555555555
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
//@param  {json} courses 加载课程内容
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
    你爸爸的爸爸233
    var id = $(ele).parent().parent().siblings('span').text();
    var model = "";
    var detail;
    courseId = coursesJson[id]['id']; //先获取课程id 查答案用得到
    获取detail model
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
    获取内容
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
    console.log(detail);
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

回到页面展示Courses
function showCourses(){
    $('#nav').empty();
    addNavItem('搜索结果','showCourses');
    loadCourses(coursesJson);
}
*/

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
    $('#input-name').blur();
    showProgressBar();
    data = {
        goods_id : courseId,
        //index : Number($(":selected").val()),
        content : $('#input-name').prop('value')
    }
    //这里是利用了助课宝接口漏洞
    if($('#rad-zhihuishu').prop('checked')){
        data['goods_id'] = 28303;
    } else{
        data['goods_id'] = 7463;
    }
    var result;
    for (let index = 0; index < Authorizations.length; index++) {
        const element = {
            Authorization: Authorizations[index]
        }
        $.ajax({
            type: "POST",
            headers: element,
            url: "https://tiku.xuexibao.tech/api/mobile/Index/searchQuestion",
            data: data,
            async: false,
            success: function (response) {
                result = response;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showToast(errorThrown , 'error');
                return;
            }
        });
        if (result['error'] != 0) {
            if (result['msg'] == "您搜索次数太多啦，休息一下吧！") {
                //showToast('搜索接口达到阈值，尝试切换请求Token', 'error');
                //达到接口阈值
            } else {
                showToast(result['msg'], 'error'); //其他错误
                return;
            }
        } else{
            break; //请求成功
        }
        if(index == Authorizations.length){
            showToast('搜索接口达到阈值且无替换接口，请稍后再查询', 'error');
            return;
        }
    }
    showToast('共找到' + result['data'].length + '个答案');
    var anwserItem = $(".answer-item-temple"); //指向Courses模版
    $('#answer-content').empty();
    anwserItem.removeClass('hidden');
    anwserItem.removeClass('answer-item-temple');
    for (let index = 0; index < result['data'].length; index++) {
        const element = result['data'][index];
        
        anwserItem.find('.question').text(element['question']).prepend($('<b></b>').text('题目：'));
        anwserItem.find('.anwser').text(element['answer']).prepend($('<b></b>').text('答案：'));
        $(anwserItem).clone().appendTo('#answer-content'); //从第一个模版Clone出来
    }
    anwserItem.addClass('answer-item-temple');
    anwserItem.addClass('hidden'); //把模版隐藏
    //$('.answer-content').css('display','inline');
    hideProgressBar();
}

function showToast(msg,msgtype) {
    if(msgtype == 'error'){
        M.toast({html: '<i class="material-icons"> error </i>' + msg,classes: 'toast-warning'}); //出错
        hideProgressBar();
        return;
    }
    M.toast({html: '<i class="material-icons">done</i>' + msg})
}

function showProgressBar() {
    $('.progress').removeClass('hidden');
}

function hideProgressBar() {
    $('.progress').addClass('hidden');
}

//删除搜索内容
//Time machine！
function timeJump() {
    $('#answer-content').empty();
}