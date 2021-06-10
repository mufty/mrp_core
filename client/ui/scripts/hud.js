$(function() {
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
            default:
                break;
        }
    });
});