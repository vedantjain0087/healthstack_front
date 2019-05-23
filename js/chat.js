$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $(".chat-window:last-child").css("margin-left");
    size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $("#chat_window_1").clone().appendTo(".container");
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $("#chat_window_1").remove();
});

$('#btn-chat').click(function () {
    data = {
        "sweat": "diabetes, coronary heart disease, myocardial infarction",
        "nausea": "hypertensive disease, diabetes, gastroesophageal reflux disease",
        "chest": "Indigiestion, heart attack, short of breath",
        "headache":"Hypertension, migraine, low blood pressure, dehydration, influenza"
    }
    temp = ` <div class="row msg_container base_sent">
    <div class="col-md-10 col-xs-10">
        <div class="messages msg_sent">
         <small>`+$('#btn-input').val()+`</small>
         <br>
            <time datetime="2009-11-13T20:00"><b style="color:black">You 1 min</b></time>
        </div>
    </div>
    <div class="col-md-2 col-xs-2 avatar">
        <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
    </div>
</div>`
    $('.msg_container_base').append(temp);
    user_input = $('#btn-input').val().split(' ');
    for (i of user_input) {
        for (key in data) {
            if (i == key) {
                html = `  <div class="row msg_container base_receive">
                <div class="col-md-2 col-xs-2 avatar">
                    <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
                </div>
                <div class="col-md-10 col-xs-10">
                    <div class="messages msg_receive">
                    <small>Hey, based on your input we have found follwing diseases `+ data[key]+`
                        </small>
                        <br>
                        <time datetime="2009-11-13T20:00"><b style="color:black">Healthstack BOT</b></time>
                    </div>
                </div>
            </div>`
                $('.msg_container_base').append(html);
            }
        }
    }
});
