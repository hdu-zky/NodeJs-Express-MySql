
var hostUrl = 'http://192.168.0.109:3000';
// $(".header ul li").click(function (e){
//     // alert('asd');
//     $(this).siblings('li').removeClass("active");
//     $(this).addClass("active");
// });
// 搜索书
function searchBook() {
    $('#searchBook').prop('disabled', true);
    var keyWord = $('#inputBook').val();
    window.location.href = '/search/'+keyWord;
    $('#searchBook').prop('disabled', false);
    checkState(pIndex, pageCount);
}
