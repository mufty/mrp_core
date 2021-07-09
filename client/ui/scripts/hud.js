$(function() {
    $('.popup').hide();
    $('.eye').hide();

    $(document).keydown(function(e) {
        //on ESC close
        if (e.keyCode == 27) {
            $('.popup').hide();
            $.post('https://mrp_core/closeUI', JSON.stringify({}));
        }
    });

    window.addEventListener('message', function(event) {
        var data = event.data;
        switch (data.type) {
            case "showCounter":
                if (data.timer) {
                    $('.timer').css('display', 'inline-block');

                    let currentTS = Date.now();
                    let countTo = currentTS + data.timer;

                    let startTimer = () => {
                        currentTS = Date.now();
                        let diff = countTo - currentTS;
                        if (diff >= 0) {
                            let perc = (diff / data.timer) * 100;
                            let radius = $('.radial-timer circle.complete').attr('r');
                            let circumference = 2 * Math.PI * radius;
                            let strokeDashOffset = circumference - ((perc * circumference) / 100);
                            $('.radial-timer circle.complete').css('stroke-dashoffset', strokeDashOffset);
                            //$('.fuel-progress .percentage').text(Math.round(data.fuelLevel) + "%");
                            setTimeout(() => {
                                startTimer();
                            }, 100);
                        } else {
                            //end
                            $('.timer').hide();
                            if (data.timerAction) {
                                //post to action
                                $.post(data.timerAction, JSON.stringify({}));
                            }
                        }
                    };

                    startTimer();
                }
                break;
            case "showPopup":
                if (data.message) {
                    $('.popup .message').html(data.message);

                    $('.popup .actions').empty();
                    if (data.actions && data.actions.length > 0) {
                        for (let action of data.actions) {
                            let html = '<a href="#">' + action.text + '</a>';
                            html = $(html);
                            html.click((event) => {
                                let data = {};
                                $('.popup .message :input').each(function() {
                                    data[$(this).attr('name')] = $(this).val();
                                });
                                $('.popup').hide();
                                $.post('https://mrp_core/closeUI', JSON.stringify({}));
                                $.post(action.url, JSON.stringify(data), () => {});
                            });

                            $('.popup .actions').append(html);
                        }
                    }

                    $('.popup').css('display', 'inline-block');
                }
                break;
            case "showEye":
                $('.eye').show();
                break;
            case "hideEye":
                $('.eye').hide();
                break;
            case "thirdeyeAdd":
                if (!$('.eye #' + data.id).length) {
                    let html = '<div class="action"><a id="' + data.id + '">' + data.text + '</a></div>';
                    html = $(html);
                    html.find('a').click((event) => {
                        $.post('https://mrp_core/closeEye', JSON.stringify({}));
                        $.post(data.action, JSON.stringify(data), () => {});
                    });

                    $('.eye').append(html);
                }
                break;
            case "thirdeyeRemove":
                if ($('.eye #' + data.id).length) {
                    $('.eye #' + data.id).parent().remove();
                }
                break;
            default:
                break;
        }
    });
});