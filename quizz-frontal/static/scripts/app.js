'use strict';

var allData, dataQuestions;

$(function() {

var nonBreakable = function(html) {
    var characters = ['?', '!', ':', ';'];
    var newHtml = html || '';
    for (var i = 0; i < characters.length; ++i) {
        newHtml = newHtml.replace(
            new RegExp('\\s+[' + characters[i] + ']', 'g'),
            '&nbsp;' + characters[i]
        );
    }
    return newHtml;
}

// var allData, dataQuestions;

$.ajax({
    url           : 'static/datas_frontal.json',
    dataType      : 'json'
}).done(function (data) {

    console.log(data)

        if (data.items.length) {

            data.items.forEach(function(v,i) {
                if (v.image && v.image !== '') v.image = 'static/upload/'+v.image;
                
                v.question = nonBreakable(v.question);

                var ok = [];
                v.answers.forEach(function(a,j) {
                    a.id = (j + 1);
                    if (a.isOk) ok.push(a.id);
                    a.text = nonBreakable(a.text);
                });
                v.ok = ok.join();

                v.titleIsOk = nonBreakable(v.titleIsOk);
                v.textIsOk = nonBreakable(v.textIsOk);

                v.titleIsNop = nonBreakable(v.titleIsNop);
                v.textIsNop = nonBreakable(v.textIsNop);
            });

            data.txtQuizOk = nonBreakable(data.txtQuizOk);
            data.txtQuizNop = nonBreakable(data.txtQuizNop);
            data.tweetPartage = nonBreakable(data.tweetPartage);

            allData = data;
            dataQuestions = data.items;


            function loadQuestion() {
              $.get('static/question.mst', function(template) {
                var rendered = Mustache.render(template, data);
                $('#wrapper').html(rendered);
                init();
              });
            }
            loadQuestion();
        }


}).fail(function (jqXHR, textStatus) {
    console.log(jqXHR);
    console.log(textStatus);
});


function init() {

    var currentIdx = 1,
        currentScore = 0,
        answers = {},
        currentAnswers = [],
        $allQuestions = $('.question'),
        questionN = $allQuestions.length - 1,
        wrapH = $('#wrapper').outerHeight();

    $('.indicator__inner__current').text(String(currentIdx));
    $('.indicator__inner__max, .result__score__inner__max').text(String(questionN));

    $('.result__score__inner__current').text(String(currentScore));
    //$('.result__score').css('height', $('.result__score').width());

    var isAnswered = function(idx) {
        return answers[idx] != null;
    };

    var answer = function(questionIdx, answerIdx) {
        if (currentAnswers.indexOf(answerIdx) >= 0) { return; }

        currentAnswers = currentAnswers.concat([answerIdx]).sort();

        var $question = $($allQuestions.get(questionIdx - 1)),
            ok = $question.find('.question__bottom__result__ok')
                          .attr('rel').replace(' ', '').split(',').sort();

        var end = function(win) {
            answers[questionIdx] = currentAnswers;
            $question.find('.question__bottom__answers').css('display', 'none');
            $question.find('.question__bottom__result').css('display', 'block');
            $question.find('.question__bottom__result__' + (win ? 'ok' : 'ko'))
                .css('display', 'block');

            // console.log(currentScore)
            // console.log(currentIdx)
            // console.log(questionN)
            // console.log(questionN)

            currentAnswers = [];
            currentScore += win ? 1 : 0;
            let text_score;
            if(currentScore <= 4 ){
                text_score = "Vous êtes un «fafologue» en devenir, l’extrême droite vous intéresse mais tout n’est pas encore très clair… lisez Frontal!"
            }
            else if(currentScore <= 7 ){
                text_score = "Vous êtes un «fafologue» confirmé, continuez à lire Frontal pour passer au niveau supérieur."
            }
            else {
                text_score = "Vous êtes un «fafologue» expert, vous lisez Frontal avec régularité, continuez pour rester à la page !"
            }
            $('.result__score__inner__current').text(String(currentScore));
            // $('.result__text__ok').css('display', currentScore > questionN * 0.75 ? 'block' : 'none');
            // $('.result__text__ko').css('display', currentScore > questionN * 0.75 ? 'none' : 'block');
            $('.result__text__ok').css('display', 'block').text(String(text_score));



            $('.next-button').removeClass('next-button--hidden');

            $question.find('x-gif').removeAttr('stopped');
        };

        if (ok.indexOf(answerIdx) < 0) {
            end(false);
        } else {
            if (_.isEqual(ok, currentAnswers)) {
                end(true);
            } else {
                $('.overlay-message').animate({
                    opacity : 1
                }, {
                    duration : 300,
                    done : function() {
                        setTimeout(function() {
                            $('.overlay-message').animate({ opacity : 0 }, { duration : 300 });
                        }, 400);
                    }
                });
            }
        }
    };

    $allQuestions.each(function() {
        var $this = $(this),
            $answers = $this.find('.question__bottom__answers__answer'),
            answerHeight = 100 / Math.ceil($answers.length),
            $title = $this.find('.question__top__title span');

        var toggleColors = function() {
            var nbrAnswere = dataQuestions[(currentIdx-1)].ok.replace(' ', '').split(',').length;
            if (nbrAnswere > 1) $(this).toggleClass('selected');
        };

        $answers.css('height', String(answerHeight) + '%')
        $answers.on('click', function() {
                    toggleColors.bind(this)();
                    //$(this).addClass('selected');
                    answer(currentIdx, $(this).attr('rel'));
                })
                .on('mousedown', toggleColors).on('mouseup', toggleColors)
                .on('touchstart', toggleColors).on('touchend', toggleColors);
    });

    $('.next-button').on('click', function() { 
        nextSectionDown();
    });

    $('.result__tweet__link').on('click', function(event) {
        event.preventDefault();

        var url = encodeURIComponent(window.location !== window.parent.location ? document.referrer : document.location.href),
            baseText = $(this).attr('rel'),
            text = encodeURIComponent(baseText.replace('XX', 'J\'ai fait ' + String(currentScore) +
                                                             '/' + String($allQuestions.length - 1) +
                                                             ' au quiz de @libe. '+allData.textResultTweet)),
            link = 'https://twitter.com/intent/tweet?original_referer=' + '' + '&text=' + text + ' ' + url;

        window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
    });

    $('.reload').on('click', function() {
        document.location.reload(true);
    });

    $('.expand-button').on('click', function() {
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement ) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            $(this).find('i').removeClass('fa-expand').addClass('fa-compress');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            $(this).find('i').removeClass('fa-compress').addClass('fa-expand');
        }
    });

    function nextSectionDown() {
        var ret = isAnswered(currentIdx);
        if (ret) {
            ++currentIdx;
            if (currentIdx < $allQuestions.length) {
                $('.indicator__inner__current').text(String(currentIdx));
            }
            $('#wrapper').css('transform', 'translate3d(0px, -'+(wrapH*(currentIdx-1))+'px, 0px)');
            $('.next-button').addClass('next-button--hidden');
            $('.indicator').addClass(function() { return currentIdx === $allQuestions.length ? 'indicator--hidden' : ''; });
        }
    }

    $(window).resize(function() {
        wrapH = $('#wrapper').outerHeight();
        $('#wrapper').css('transform', 'translate3d(0px, -'+(wrapH*(currentIdx-1))+'px, 0px)');
    });

}


});
