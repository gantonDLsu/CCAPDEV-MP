$(".button-post").on("click", function(){
    $("#getaction").attr("action", "posting");
});
$(".button-cancel").on("click", function(){
   $("#getaction").attr("action", "canceling");
});
$(".button-draft").on("click", function(){
    $("#getaction").attr("action", "drafting");
});

