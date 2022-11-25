let action;

$(".button-post").on("click", function(){
    action = "posting";
});
$(".button-cancel").on("click", function(){
    action = "canceling";
});
$(".button-draft").on("click", function(){
    action = "drafting";
});

function actionCheck (act){
    switch(act){
        case "posting":
            return act;
        case "canceling":
            return act;
        default:
            return act;
    }  
}
