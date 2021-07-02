var angle = 0;
var digits = 0;
var counter = 0;

// Initialize random points on the circle, update # of digits
function init($param) {
    angle = Math.floor((Math.random() * 720) - 360);
    $("#circle2").rotate(angle, true);
    $("#container > p").html($param);
    if ($param != 1)
        $("#container > p").append("<br><h4>digits left</h4>");
    else
        $("#container > p").append("<br><h4>digit left</h4>");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(function() {
    let data = null;
    $.fn.rotationDegrees = function() {
        var matrix = this.css("-webkit-transform") ||
            this.css("-moz-transform") ||
            this.css("-ms-transform") ||
            this.css("-o-transform") ||
            this.css("transform");
        if (typeof matrix === 'string' && matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        } else {
            var angle = 0;
        }
        return angle;
    };

    let interval = null;

    jQuery.fn.rotate = function(degrees, immediate) {
        let clockwise = true;
        if (degrees <= 0) {
            clockwise = false;
        }

        if (interval != null) {
            clearInterval(interval);
            interval = null;
        }

        let increment = 1;
        if (!clockwise)
            increment = -1;

        let speed = getRandomInt(1, 30);

        if (!immediate) {
            let startDegrees = $(this).rotationDegrees() + increment;
            interval = setInterval(() => {
                $(this).css({
                    '-webkit-transform': 'rotate(' + startDegrees + 'deg)',
                    '-moz-transform': 'rotate(' + startDegrees + 'deg)',
                    '-ms-transform': 'rotate(' + startDegrees + 'deg)',
                    'transform': 'rotate(' + startDegrees + 'deg)'
                });
                startDegrees += increment;
            }, speed);
        } else {
            $(this).css({
                '-webkit-transform': 'rotate(' + degrees + 'deg)',
                '-moz-transform': 'rotate(' + degrees + 'deg)',
                '-ms-transform': 'rotate(' + degrees + 'deg)',
                'transform': 'rotate(' + degrees + 'deg)'
            });
        }

        return $(this);
    };

    function done(success) {
        let failed = false;
        if (success === false)
            failed = true;
        else if (success >= 1)
            failed = true;

        if (interval != null) {
            clearInterval(interval);
            interval = null;
        }

        $("#circle2").css('transform', 'rotate(0deg)');
        $("#circle").css('transform', 'rotate(0deg)');

        $('.minigame_lockpick').hide();
        let obj = {
            data: data.data,
            success: !failed
        };
        $.post(data.endEvent, JSON.stringify(obj));
        $.post('https://mrp_core/closeUI', JSON.stringify({}));
    }

    // Initialize random points on the circle, update # of digits
    function init($param) {
        angle = Math.floor((Math.random() * 720) - 360);
        $("#circle2").rotate(angle, true);
        $("#container > p").html($param);
        if ($param != 1)
            $("#container > p").append("<br><h4>digits left</h4>");
        else
            $("#container > p").append("<br><h4>digit left</h4>");
    }

    function startMinigame() {
        // %2 == 0 is clockwise, else counter-clockwise
        counter = 0;
        // # of digits, reach 0 => win
        digits = 5;
        // display
        init(digits);
        // store the randomly generated angle of the point
        angle = $("#circle2").rotationDegrees();
        // Initial circle spin on page load
        $("#circle").rotate(2880);
    }

    $(document).click(function() {
        let stop = false;
        // Current rotation stored in a variable
        var unghi = $('#circle').rotationDegrees();
        // If current rotation matches the random point rotation by a margin of +- 2digits, the player "hit" it and continues
        if (unghi > angle - 25 && unghi < angle + 25) {
            digits--;
            // If game over, hide the game, display end of game options
            if (!digits) {
                stop = true;
                done(digits);
            }
            // Else, add another point and remember its new angle of rotation
            else init(digits);
            angle = $("#circle2").rotationDegrees();
        }
        // Else, the player "missed" and is brought to end of game options
        else {
            stop = true;
            done(false);
        }

        if (!stop) {
            // No of clicks ++
            counter++;
            // spin based on click parity
            if (counter % 2) {
                $('#circle').rotate(-2880);
            } else $('#circle').rotate(2160);
        }
    });

    $('.minigame_lockpick').hide();

    $(document).keydown(function(e) {
        //on ESC close
        if (e.keyCode == 27 && data) {
            done(false);
        }
    });

    window.addEventListener('message', function(event) {
        data = event.data;
        switch (data.type) {
            case "lockpick":
                $('.minigame_lockpick').show();
                startMinigame();
                break;
            default:
                break;
        }
    });
});