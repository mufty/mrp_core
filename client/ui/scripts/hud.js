$(function() {
    $('.popup').hide();

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
                                $('.popup').hide();
                                $.post('https://mrp_core/closeUI', JSON.stringify({}));
                                $.post(action.url, JSON.stringify({}), () => {});
                            });

                            $('.popup .actions').append(html);
                        }
                    }

                    $('.popup').css('display', 'inline-block');
                }
                break;
            default:
                break;
        }
    });
});