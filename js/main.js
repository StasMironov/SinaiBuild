"use strict";

//===== Function check element ==========//
jQuery.fn.exists = function () {
  return $(this).length;
};

document.addEventListener("DOMContentLoaded", function (event) {
  if ($('.index-slider').exists()) {
    try {
      var projectContent = new Swiper('.index-slider', {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        touchRatio: 0,
        breakpoints: {
          1920: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
            touchRatio: 1
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
            touchRatio: 1
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  function ObjAd(element, place) {
    var adObj = $(element).html();
    var out = adObj;
    document.querySelector(place).innerHTML = out;
    $(element).html('');
  }

  if ($('#aside').exists()) {
    try {
      var breakpoint = window.matchMedia('(min-width:769px)');

      if (!breakpoint.matches === true) {
        ObjAd('#aside', '#insert');
      }
    } catch (err) {
      console.log(err);
    }
  }
});
$(function () {
  function rangeSlider(block, min, max, steps, input, parent) {
    if ($(block).exists()) {
      try {
        var slider = document.querySelector(block);
        noUiSlider.create(slider, {
          start: [min, max],
          connect: true,
          step: steps,
          format: wNumb({
            decimals: 0
          }),
          range: {
            'min': min,
            'max': max
          }
        });
        var handle = $(block).closest(parent);
        var skipValues = [$(handle).find('.building-filter__up'), $(handle).find('.building-filter__low')];
        slider.noUiSlider.on('update', function (values, i) {
          $(skipValues[i]).text(values[i]);
          $(input).val(values);
        });
        return slider;
      } catch (err) {
        console.log(err);
      }
    }
  }

  function checkVal(bloc, rangeBloc, sendBbox) {
    var inputVal = $(rangeBloc).closest('.flats-calc__item').find('.flats-calc__block').data('min');

    if ($(bloc).val() != '') {
      inputVal = $(sendBbox).val();
      inputVal = inputVal.split(',');
      inputVal = inputVal[0];
    }

    return inputVal;
  }

  function checkInput(bloc, min, max, slider) {
    if ($(bloc).exists()) {
      calcPay(checkVal(bloc, '#price', '#send-result-price'), checkVal(bloc, '#donat', '#send-result-donat'), checkVal(bloc, '#period', '#send-result-period'), checkVal(bloc, '#savings', '#send-result-savings'));
      $(bloc).on('change', function () {
        if ($(this).val() > max) {
          slider.noUiSlider.set(max);
          $(this).val(max);
        } else if ($(this).val() < min || $(this).val() == 0) {
          slider.noUiSlider.set(min);
          $(this).val(min);
        } else {
          slider.noUiSlider.set($(this).val());
        }

        slider.noUiSlider.set([this.value, null]);
        slider.noUiSlider.on('update', function (values, handle) {
          $(bloc).val(values[0]);
        }); // let priceFlat = checkVal(bloc, '#price', '#send-result-price');
        // let firstDonat = checkVal(bloc, '#donat', '#send-result-donat');
        // let periodLoan = checkVal(bloc, '#period', '#send-result-period');

        calcPay(checkVal(bloc, '#price', '#send-result-price'), checkVal(bloc, '#donat', '#send-result-donat'), checkVal(bloc, '#period', '#send-result-period'), checkVal(bloc, '#savings', '#send-result-savings'));
      });
      slider.noUiSlider.on('slide', function (values, handle) {
        $(bloc).val(values[0]);
        calcPay(checkVal(bloc, '#price', '#send-result-price'), checkVal(bloc, '#donat', '#send-result-donat'), checkVal(bloc, '#period', '#send-result-period'), checkVal(bloc, '#savings', '#send-result-savings'));
      });

      if (bloc === '#flats-savings') {
        slider.noUiSlider.set(max);
      }
    }
  }

  function calcPay(priceF, donat, period) {
    var capital = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var monthPay = 0; // x

    var kofPay = 0; // k

    var priceFlat = priceF; // Стоимость квартиры

    var sumLoan; // Сумма займа

    var firstDonat = donat; // Первый взнос

    var periodLoan = period * 12; // Срок кредита

    var percentRate = 4.85 / 12 / 100; // Процентная ставка

    var percent = 0;
    var payment = 0; //Платёж

    var mCapital = 0; // Мат. капитал

    var sumCapital = capital; // Платёж мат.капитала

    sumLoan = priceFlat - firstDonat;

    if ($('[data-name="savings"]').prop("checked")) {
      kofPay = percentRate * Math.pow(1 + percentRate, periodLoan) / (Math.pow(1 + percentRate, periodLoan) - 1);
      kofPay = kofPay.toFixed(5);
      monthPay = Math.ceil(kofPay * sumLoan);
      percent = sumLoan * percentRate * (30 / 365);
      mCapital = sumCapital - (percent + monthPay);
      sumLoan = sumLoan - mCapital - monthPay;
      kofPay = percentRate * Math.pow(1 + percentRate, periodLoan) / (Math.pow(1 + percentRate, periodLoan) - 1);
      monthPay = Math.ceil(kofPay * sumLoan); //payment = percent + sumLoan + 
      //console.log(monthPay);
    } else {
      kofPay = percentRate * Math.pow(1 + percentRate, periodLoan) / (Math.pow(1 + percentRate, periodLoan) - 1);
      kofPay = kofPay.toFixed(5);
      monthPay = Math.ceil(kofPay * sumLoan);
      $('#calc-rezult').val(monthPay);
    } // kofPay = (percentRate * (Math.pow((1 + percentRate), periodLoan))) / ((Math.pow((1 + percentRate), periodLoan)) - 1);
    // kofPay = kofPay.toFixed(5);
    // monthPay = Math.ceil(kofPay * sumLoan);
    // $('#calc-rezult').val(monthPay);
    //console.log(monthPay);
    // console.log(priceFlat);
    // console.log(firstDonat);
    //console.log(monthPay);
    // console.log(sumLoan);

  }

  if ($('#btnUp').exists()) {
    var btn = $('#btnUp');
    $(window).scroll(function () {
      if ($(window).scrollTop() > 300) {
        btn.addClass('showBtn');
      } else {
        btn.removeClass('showBtn');
      }
    });
    btn.on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, '300');
    });
  }

  if ($('.menu__item--menu').exists()) {
    $('.menu__item--menu').on('click', function () {
      $(this).toggleClass('menu__item--active');
      var height = 0;
      $('.menu__ref').each(function () {
        height += $(this).outerHeight();
      });

      if ($('.menu__sub').hasClass('menu__sub--active')) {
        $('.menu__sub').removeClass('menu__sub--active').css({
          'max-height': 0
        });
      } else {
        $('.menu__sub').addClass('menu__sub--active').css({
          'max-height': height
        });
      }
    });
  }

  if ($('.burger').length > 0) {
    $('.burger').on('click', function () {
      $(this).toggleClass('burger--active');

      if ($('.overlay').exists()) {
        $('.overlay').toggleClass('overlay--show');
        $('html').css('overflow', 'hidden');

        if ($('.menu__item').exists()) {
          ScrollReveal().reveal('.menu__item', {
            delay: 100,
            interval: 100,
            origin: 'bottom'
          }, ScrollReveal().reveal('.share-bloc--header .share-bloc__items', {
            delay: 800,
            interval: 500,
            enter: 'left'
          }));
        }
      }
    });
  }

  if ($('.index__left').exists()) {
    $('.index__left').each(function (index) {
      //console.log(index)
      if (index % 2 == 0 && index != 0) {
        // console.log($('.index__left')[index]);
        ScrollReveal().reveal($('.index__left')[index], {
          //delay: 600,
          // interval: 3000
          enter: 'left',
          origin: 'left',
          duration: 1500,
          distance: '150px',
          easing: 'ease-in-out',
          mobile: false
        });
      } else if (index != 0 && index % 2 != 0) {
        ScrollReveal().reveal($('.index__left')[index], {
          //delay: 600,
          //interval: 3000,
          enter: 'right',
          origin: 'right',
          duration: 1000,
          distance: '150px',
          easing: 'ease-in',
          mobile: false
        });
      }
    });
  }

  if ($('.index__info').exists()) {
    // console.log($('.index__info'));
    ScrollReveal().reveal('.index__info', {
      delay: 600,
      //interval: 3000,
      distance: '150px',
      enter: 'bottom',
      origin: 'bottom',
      duration: 1000,
      easing: 'ease-in',
      mobile: false
    }, ScrollReveal().reveal('.index__right', {
      delay: 1500,
      //interval: 3000,
      distance: '150px',
      enter: 'bottom',
      origin: 'bottom',
      duration: 1000,
      easing: 'ease-in-out',
      mobile: false
    }));
  } // if ($('.index__right').exists()) {
  //     console.log($('.index__right'));
  //     ScrollReveal().reveal('.index__right', {
  //         delay: 600,
  //         //interval: 3000,
  //         distance: '150px',
  //         enter: 'bottom',
  //         origin: 'bottom',
  //         duration: 1000
  //     })
  // }


  if ($('.menu__close').exists()) {
    $('.menu__close').on('click', function () {
      $('.overlay').toggleClass('overlay--show');
      $('.burger').toggleClass('burger--active');
      $('html').css('overflow', 'auto');
      $('.menu__sub').removeClass('menu__sub--active').css({
        'max-height': 0
      });
    });
  }

  if ($('.header__item--menu').exists()) {
    $('.header__item--menu').on('mouseenter', function () {
      $(this).find('.header__link').addClass('header__link--hover');
    }); //mouseleave

    $('.header__item--menu').on('mouseleave', function () {
      $(this).find('.header__link').removeClass('header__link--hover');
    });
  }

  if ($('.overlay').exists()) {
    $('.overlay').click(function (e) {
      // console.log(e.target.className.indexOf('overlay'));
      if (e.target.className.indexOf('overlay') != -1) {
        $(this).toggleClass('overlay--show');
        $('.burger').toggleClass('burger--active');
        $('html').css('overflow', 'auto');
      }
    });
  }

  if ($('#price').exists()) {
    var min = $('#price').closest('.flats-calc__item').find('.flats-calc__block').data('min');
    var max = $('#price').closest('.flats-calc__item').find('.flats-calc__block').data('max');
    var slider = rangeSlider('#price', min, max, 10000, '#send-result-price', '.flats-calc__item');
    $('#flat-price').val(min);
    checkInput('#flat-price', min, max, slider);
  }

  if ($('#donat').exists()) {
    var _min = $('#donat').closest('.flats-calc__item').find('.flats-calc__block').data('min');

    var _max = $('#donat').closest('.flats-calc__item').find('.flats-calc__block').data('max');

    var _slider = rangeSlider('#donat', _min, _max, 1000, '#send-result-donat', '.flats-calc__item');

    $('#flats-donat').val(_min);
    checkInput('#flats-donat', _min, _max, _slider);
  }

  if ($('#period').exists()) {
    var _min2 = $('#period').closest('.flats-calc__item').find('.flats-calc__block').data('min');

    var _max2 = $('#period').closest('.flats-calc__item').find('.flats-calc__block').data('max');

    var _slider2 = rangeSlider('#period', _min2, _max2, 1, '#send-result-period', '.flats-calc__item');

    $('#flats-period').val(_min2);
    checkInput('#flats-period', _min2, _max2, _slider2);
  }

  if ($('#savings').exists()) {
    var _min3 = $('#savings').closest('.flats-calc__item').find('.flats-calc__block').data('min');

    var _max3 = $('#savings').closest('.flats-calc__item').find('.flats-calc__block').data('max');

    var _slider3 = rangeSlider('#savings', _min3, _max3, 1, '#send-result-savings', '.flats-calc__item');

    $('#flats-savings').val(_max3);
    checkInput('#flats-savings', _min3, _max3, _slider3);
  }

  if ($('.structure__items--projects').exists()) {
    $('.structure__items--projects').mCustomScrollbar({
      theme: "minimal-dark",
      mouseWheelPixels: 400
    });
  }

  if ($('.second-flats__items').exists()) {
    $(window).on('resize load', function () {
      if ($(this).width() >= 768) {
        $('.second-flats__items').mCustomScrollbar({
          theme: "minimal-dark",
          mouseWheelPixels: 400
        });
      }
    });
  } // $('#submit').on('click', function (event) {
  //     event.preventDefault();
  //     console.log($('.building-filter--second-flats'));
  // })


  $('[data-name="savings"]').on('click', function () {
    if ($(this).prop("checked")) {
      $('.flats-calc__row--savings').addClass('flats-calc__row--active');
      calcPay(checkVal('#flat-price', '#price', '#send-result-price'), checkVal('#flats-donat', '#donat', '#send-result-donat'), checkVal('#flats-period', '#period', '#send-result-period'), checkVal('#flats-savings', '#savings', '#send-result-savings'));
    } else {
      $('.flats-calc__row--savings').removeClass('flats-calc__row--active');
    }
  });

  function checkField(bloc) {
    var flag = 0;
    $(bloc).each(function () {
      if ($(this).val() == '') {
        flag++;
      }
    });

    if (flag != 0) {
      return false;
    } else {
      return true;
    }
  }

  if ($('.ads__slider').exists()) {
    try {
      var adsSlider = new Swiper('.ads__slider', {
        spaceBetween: 20,
        slidesPerView: 3,
        autoHeight: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar'
        },
        autoplay: {
          delay: 5000
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row',
            autoHeight: false,
            loop: false
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 20,
            loop: false
          },
          993: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          1920: {
            slidesPerView: 3,
            spaceBetween: 20
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.form-project').exists()) {
    var stateButton = 0;
    $('.form-project__field').each(function () {
      $(this).on('input change', function () {
        stateButton = checkField('.form-project__field');

        if (stateButton) {
          $('.call-help__btn').prop('disabled', false);
        } else {
          $('.call-help__btn').prop('disabled', true);
        }
      });
    });
  }

  if ($('#plan-slider').exists()) {
    try {
      var planSlider = new Swiper('#plan-slider', {
        spaceBetween: 20,
        slidesPerView: 'auto',
        loop: true,
        autoHeight: true,
        navigation: {
          nextEl: '.index-project__link--pf_next',
          prevEl: '.index-project__link--pf_prev'
        },
        pagination: {
          el: '.project-period__pagination',
          clickable: true
        },
        breakpoints: {
          1920: {
            spaceBetween: 20,
            slidesPerView: 4
          },
          1025: {
            spaceBetween: 20,
            slidesPerView: 4
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20 // touchRatio: 1,

          },
          993: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          992: {
            slidesPerView: 1.4,
            spaceBetween: 20
          },
          769: {
            slidesPerView: 1.4,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          621: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          620: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.certificate__slider').exists()) {
    try {
      var certificateSlider = new Swiper('.certificate__slider', {
        spaceBetween: 24,
        slidesPerView: 5,
        touchRatio: 0,
        slidesPerColumn: 2,
        slidesPerColumnFill: 'row',
        autoplay: {
          delay: 3000
        },
        breakpoints: {
          1025: {
            slidesPerView: 5,
            spaceBetween: 24
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
            touchRatio: 1
          },
          641: {
            slidesPerView: 4,
            spaceBetween: 24,
            touchRatio: 1
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 24,
            touchRatio: 1
          },
          501: {
            slidesPerView: 3,
            spaceBetween: 24,
            touchRatio: 1
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 10,
            touchRatio: 1,
            slidesPerColumn: 1
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
            touchRatio: 1,
            slidesPerColumn: 1
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.partner__slider').exists()) {
    try {
      var test = new Swiper('.partner__slider', {
        spaceBetween: 110,
        slidesPerView: 'auto',
        loop: true,
        autoplay: {
          delay: 5000
        },
        breakpoints: {
          1920: {
            spaceBetween: 110,
            slidesPerView: 'auto'
          },
          1301: {
            spaceBetween: 110,
            slidesPerView: 'auto'
          },
          1300: {
            spaceBetween: 40,
            slidesPerView: 4,
            loop: false
          },
          1025: {
            spaceBetween: 40,
            slidesPerView: 4
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row',
            touchRatio: 0
          },
          769: {
            slidesPerView: 4,
            spaceBetween: 40,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row',
            touchRatio: 0
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 18,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row',
            touchRatio: 0
          },
          501: {
            slidesPerView: 3,
            spaceBetween: 18,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row',
            touchRatio: 0
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 18,
            slidesPerColumn: 3,
            slidesPerColumnFill: 'row',
            touchRatio: 0
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 18,
            slidesPerColumn: 3,
            slidesPerColumnFill: 'row',
            touchRatio: 0
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.slider-flats').exists()) {
    try {
      var flatsSlider = new Swiper('.slider-flats', {
        slidesPerView: 1,
        spaceBetween: 10,
        touchRatio: 0,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: '.slider-flats__pagination',
          clickable: true,
          renderBullet: function renderBullet(index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          }
        },
        navigation: {
          nextEl: '.slider-flats__arrow--next',
          prevEl: '.slider-flats__arrow--prev'
        }
      });
    } catch (err) {
      console.log('Ошибка ' + err.name + ":" + err.message + "\n" + err.stack);
    }
  }

  if ($('#cost').exists()) {
    var _min4 = $('#cost').closest('.building-filter__col').find('.building-filter__range').data('min');

    var _max4 = $('#cost').closest('.building-filter__col').find('.building-filter__range').data('max');

    rangeSlider('#cost', _min4, _max4, 100000, '#send-result-сost', '.building-filter__col');
  }

  if ($('#area').exists()) {
    var _min5 = $('#area').closest('.building-filter__col').find('.building-filter__range').data('min');

    var _max5 = $('#area').closest('.building-filter__col').find('.building-filter__range').data('max');

    rangeSlider('#area', _min5, _max5, 10, '#send-result-area', '.building-filter__col');
  }

  if ($('#distance').exists()) {
    var _min6 = $('#distance').closest('.building-filter__col').find('.building-filter__range').data('min');

    var _max6 = $('#distance').closest('.building-filter__col').find('.building-filter__range').data('max');

    rangeSlider('#distance', _min6, _max6, 10, '#send-result-distance', '.building-filter__col');
  }

  if ($('.burger-filter').exists()) {
    $('.burger-filter').on('click', function () {
      $(this).toggleClass('burger-filter--active');
      $('.building-filter').toggleClass('building-filter--active');
    });
  }

  if ($('.project-period__list').exists()) {
    $('.project-period__list').mCustomScrollbar({
      theme: "dark",
      mouseWheelPixels: 90
    });
  }

  $(window).on('resize load', function () {
    $('.structure__menu').width($('.structure__items').width());
  });

  if ($('.structure__map--projects').exists()) {
    try {
      fixMap('#map-projects', '.structure__note', '.structure__inner');
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.structure__map--step-build').exists()) {
    try {
      fixMap('#map-projects', '.mf-edge', '.structure__inner');
    } catch (err) {
      console.log(err);
    }
  }

  function fixMap(map, edge, parentMap) {
    var $window = $(window),
        $target = $(map),
        $h = $target.offset().top;
    $window.on('scroll', function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > $h) {
        $target.addClass("map-fixed");
        var wt = $(window).scrollTop();
        var wh = $(window).height();
        var et = $(edge).offset().top;
        var eh = $(edge).outerHeight();
        var dh = $(document).height();

        if (wt + wh >= et || wh + wt == dh || eh + et < wh) {
          $(map).removeClass("map-fixed");
          $(parentMap).addClass('map-end');
        } else {
          $(map).addClass("map-fixed");
          $(parentMap).removeClass('map-end');
        }

        return;
      } else {
        $target.removeClass("map-fixed");
      }

      return;
    });
  }

  if ($('.filter-menu').length > 0) {
    var temp = $('.structure__menu li')[$('.group li').length - 1];
    $(temp).find('a').css('padding-right', '0px');
    var $el,
        leftPos,
        newWidth,
        $mainNav = $("#example-one");
    $mainNav.append("<li id='magic-line'></li>");
    var $magicLine = $("#magic-line");
    $magicLine.width($(".current_page_item").width()).css("left", $(".current_page_item a").position().left).data("origLeft", $magicLine.position().left).data("origWidth", $magicLine.width());
    $("#example-one li a").on('click', function () {
      $el = $(this);
      leftPos = $el.position().left;
      newWidth = $el.parent().width();
      $magicLine.stop().animate({
        left: leftPos,
        width: newWidth
      });
    });
    $('.filter-menu li').each(function () {
      $(this).on('click', function () {
        $(this).find('input').prop('checked', true);

        if ($(this).find('input').is(':checked')) {
          $(this).addClass('current_page_item').siblings().removeClass('current_page_item');
        }
      });
    });
  }

  lightGallery(document.getElementById('lightgallery-cer'));
  lightGallery(document.getElementById('certificate__gallery'));

  if ($('.content--project').exists()) {
    var items = document.querySelector('.content--project');
    lightGallery(items, {
      "selector": ".project__img"
    });
  }

  if ($('.index-content__txt').exists()) {
    try {
      var truncate = document.querySelectorAll(".index-content__txt");

      for (var _i = 0; _i < truncate.length; _i++) {
        $clamp(truncate[_i], {
          clamp: 4,
          // Число строк
          useNativeClamp: false
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.index-project__content').exists() && $('.index-project__img').exists()) {
    try {
      var projectContent = new Swiper('.index-project__content', {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: '.project-pagination',
          clickable: true
        }
      });
      var projectImg = new Swiper('.index-project__img', {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.index-project__link--next',
          prevEl: '.index-project__link--prev'
        }
      });
      projectContent.controller.control = projectImg;
      projectImg.controller.control = projectContent;
      $('.swiper-wrapper').resize(function () {
        $('.index__special').height($('.index-content').height());
      });
    } catch (err) {
      console.log('Ошибка ' + err.name + ":" + err.message + "\n" + err.stack);
    }
  }

  if ($('.index-project__example').exists()) {
    try {
      var projectEx = new Swiper('.index-project__example', {
        slidesPerView: 3,
        spaceBetween: 20,
        effect: 'slide',
        loop: true,
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.index-project__arr--next',
          prevEl: '.index-project__arr--prev'
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.index-certificate__cer').exists()) {
    try {
      var _projectCer = new Swiper('.index-certificate__cer', {
        slidesPerView: 4,
        spaceBetween: 42,
        effect: 'slide',
        loop: true,
        autautoplay: {
          delay: 1000,
          disableOnInteraction: false
        },
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.index-project__arr--snext',
          prevEl: '.index-project__arr--sprev'
        },
        breakpoints: {
          922: {
            slidesPerView: 4,
            spaceBetween: 42,
            autoplay: false
          },
          769: {
            slidesPerView: 4,
            spaceBetween: 42,
            autoplay: false
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 42,
            autoplay: false
          },
          601: {
            autoplay: false
          },
          501: {
            slidesPerView: 3,
            spaceBetween: 42
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 8
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.index-example__slider').exists()) {
    try {
      var _projectCer2 = new Swiper('.index-example__slider', {
        slidesPerView: 1,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.index-project__arr--ex_next',
          prevEl: '.index-project__arr--ex_prev'
        },
        pagination: {
          el: '.inner-slider__num--example',
          type: "custom",
          renderCustom: function renderCustom(swiper, current, total) {
            var i = current ? current : 0;
            return "<span>".concat(("" + i).slice(-2), "</span>") + "/<span>".concat(("" + total).slice(-2), "</span>");
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.index-news__slider').exists()) {
    try {
      var projectCer = new Swiper('.index-news__slider', {
        slidesPerView: 3,
        spaceBetween: 40,
        loop: true,
        pagination: {
          el: '.index-news__pagination',
          type: 'progressbar'
        },
        breakpoints: {
          1920: {
            slidesPerView: 3,
            spaceBetween: 40
          },
          769: {
            slidesPerView: 3,
            spaceBetween: 40
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16
          },
          501: {
            slidesPerView: 1,
            spaceBetween: 16
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 16
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.index__slider').exists()) {
    try {
      var breakpoint = window.matchMedia('(min-width:641px)');
      var mySwiper;

      var breakpointChecker = function breakpointChecker() {
        if (breakpoint.matches === true) {
          if (mySwiper !== undefined) mySwiper.destroy(true, true);
          return;
        } else if (breakpoint.matches === false) {
          return enableSwiper();
        }
      };

      var enableSwiper = function enableSwiper() {
        mySwiper = new Swiper('.index__slider', {
          slidesPerView: 1,
          spaceBetween: 16,
          a11y: true,
          keyboardControl: true,
          grabCursor: true,
          effect: 'slide',
          slidesPerColumn: 3,
          // autoHeight: true,
          pagination: {
            el: '.index__pag',
            clickable: true
          },
          breakpoints: {
            1920: {
              slidesPerColumn: 3,
              spaceBetween: 16
            },
            640: {
              slidesPerColumn: 1,
              slidesPerView: 1,
              spaceBetween: 16
            },
            320: {
              slidesPerColumn: 1,
              slidesPerView: 1,
              spaceBetween: 16
            }
          }
        });
      };

      breakpoint.addListener(breakpointChecker);
      breakpointChecker();
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.button').exists()) {
    try {
      (function () {
        var btnBg = document.querySelectorAll('.button');

        var _loop = function _loop(_i2) {
          btnBg[_i2].addEventListener('mousemove', function (e) {
            var event = e;
            this.classList.add('button-bg');
            bgMove(btnBg[_i2], event);
          });

          btnBg[_i2].addEventListener('mouseleave', function () {
            this.classList.remove('button-bg');
          });
        };

        for (var _i2 = 0; _i2 < btnBg.length; _i2++) {
          _loop(_i2);
        }
      })();
    } catch (err) {
      console.log(err);
    }
  }

  function bgMove(bloc, e) {
    var target = bloc.getBoundingClientRect();
    var x = e.clientX - target.left - 90;
    var y = e.clientY - target.top - 90;
    bloc.style.backgroundPosition = '0 0,0 0,' + x + 'px ' + y + 'px,0 0';
  }

  if ($('.index-certificate__unique').exists()) {
    try {
      setHeaderHeight('#lightgallery-cer .swiper-slide', '.index-certificate__unique');
      $(window).on('resize load', function () {
        setHeaderHeight('#lightgallery-cer .swiper-slide', '.index-certificate__unique');
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.certificate__cover').exists()) {
    try {
      setHeaderHeight('.certificate__slider ', '.certificate__cover');
      $(window).on('resize load', function () {
        setHeaderHeight('.certificate__slider ', '.certificate__cover');
      });
    } catch (err) {
      console.log(err);
    }
  }

  function setHeaderHeight(child, parent) {
    var height = $(child).height();
    $(parent).css({
      height: height + "px" // приравниванием высоту header'a к высоте абсолютного элемента

    });
  }

  if ($('.index-example').exists()) {
    try {
      createPag('.index-example');
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.index-inner').exists()) {
    try {
      createPag('.index-inner');
    } catch (err) {
      console.log(err);
    }
  } // $('.project-period__slider .swiper-menu').on('click', '.swiper-menu__item', function () {
  //     checkPag(this, projectCer);
  // });
  // $('.index-example .swiper-menu').on('click', '.swiper-menu__item', function () {
  //     checkPag(this, projecPeriod);
  // });
  // if ($('.index-example .swiper-menu').exists()) {
  //     try {
  //         $('.index-example .swiper-menu').on('click', '.swiper-menu__item', function () {
  //             checkPag(this, projectCer);
  //         });
  //     } catch (err) {
  //         console.log(err);
  //     }
  // }
  // if ($('.swiper-menu').exists()) {
  //     try {
  //         $('.swiper-menu').on('click', '.swiper-menu__item', function () {
  //             checkPag(this, projectImg);
  //         });
  //     } catch (err) {
  //         console.log(err);
  //     }
  // }
  // function checkPag(contecst, slider) {
  //     let contecsts = contecst;
  //     const index = $(contecsts).data('index');
  //     slider.slideTo(index);
  //     let temp = $(contecsts).attr('index', index);
  //     for (let i = 0; i < temp.length; i++) {
  //         $(contecsts).closest('.swiper-wrapper').find('.swiper-menu').each(function () {
  //             $(this).find('.swiper-menu__item').each(function () {
  //                 if ($(this).data('index') != index) {
  //                     $(this).removeClass('swiper-menu__item--active');
  //                 } else {
  //                     $(this).addClass('swiper-menu__item--active');
  //                 }
  //             });
  //         });
  //     }
  // }
  // function createPag(block) {
  //     console.log(block);
  //     let bloc = document.querySelector(block);
  //     let qtySlide = projectImg.slides.length;
  //     let parentEl = bloc.querySelectorAll('.swiper-menu');
  //     if (qtySlide > 0) {
  //         for (let i = 0; i < parentEl.length; i++) {
  //             for (let j = 0; j < qtySlide; j++) {
  //                 let itemSlide = document.createElement('div');
  //                 itemSlide.classList.add('swiper-menu__item');
  //                 itemSlide.setAttribute('data-index', j);
  //                 parentEl[i].appendChild(itemSlide);
  //                 if (j == 0) {
  //                     itemSlide.classList.add('swiper-menu__item--active');
  //                 }
  //             }
  //         }
  //     }
  // }


  function getCoords(elem) {
    var box = elem[0].getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      bottom: box.bottom + pageYOffset
    };
  }

  function moveModal() {
    var floorEl = $("[data-floor]");
    floorEl.each(function () {
      $(this).on('mousemove', function () {
        var top = getCoords($(this));
        var parent = getCoords($('.object__inner'));
        $('.module').addClass('module--active');
        var heightEl = $(this)[0].getBoundingClientRect().height;
        $('.module').css('top', top.top - $('.header').height() - heightEl / 2.9);
      });
      $(this).on('mouseleave', function () {
        $('.module').removeClass('module--active');
      });
    });
  }

  $(window).on('load', function () {
    if ($(this).width() >= 620) {
      moveModal();
    }
  });

  if ($('#map').length > 0) {
    var showAll = function showAll() {
      // then remove any previously-displayed marker groups
      overlays.clearLayers(); // create a new marker group

      var clusterGroup = new L.MarkerClusterGroup().addTo(overlays);
      layers.eachLayer(function (layer, index) {
        var marker = layer;
        var feature = marker.feature;
        marker.setIcon(L.icon(feature.properties.icon));
        clusterGroup.addLayer(layer);
        L.layerGroup().addTo(map);
      });
    };

    var showStations = function showStations() {
      var list = new Set();

      for (var i = 0; i < inputEl.length; i++) {
        if (inputEl[i].checked) {
          // console.log(list);
          list.add(inputEl[i].value);
        }
      } // then remove any previously-displayed marker groups


      overlays.clearLayers(); // create a new marker group

      var clusterGroup = new L.MarkerClusterGroup().addTo(overlays);
      layers.eachLayer(function (layer, index) {
        if (list.has(layer.feature.properties.name) == true) {
          var marker = layer;
          var feature = marker.feature;
          marker.setIcon(L.icon(feature.properties.icon));
          clusterGroup.addLayer(layer);
          L.layerGroup().addTo(map);
        } else if (list.has('all') == true) {
          var _marker = layer;
          var _feature = _marker.feature;

          _marker.setIcon(L.icon(_feature.properties.icon));

          clusterGroup.addLayer(layer);
          L.layerGroup().addTo(map);
        }
      });
    };

    L.mapbox.accessToken = 'pk.eyJ1IjoiYWRtaW5zaW5haSIsImEiOiJja2N2czJ2ejcwNzdoMzBtbDVneTh6NTNkIn0.pkiEoq-UDjbqvdDrB_zZCQ';
    var map = L.mapbox.map('map').setView([53.376457, 58.986727], 17.95).addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10'));

    if (map.scrollWheelZoom) {
      map.scrollWheelZoom.disable();
    }

    var overlays = L.layerGroup().addTo(map);
    var layers;
    L.mapbox.featureLayer().loadURL('./js/json/markers-project.geojson').on('ready', function (e) {
      layers = e.target;
      showStations();
      showAll();
    });
    var filters = document.getElementById('colors');
    var inputEl = filters.querySelectorAll('input');

    for (var i = 0; i < inputEl.length; i++) {
      inputEl[i].addEventListener('click', showStations);
    }
  }

  function createMap(mapBloc, itemEl) {
    if ($("#".concat(mapBloc)).exists()) {
      var centerMap = $("#".concat(mapBloc)).data('center');
      var markerArr = [];
      mapboxgl.accessToken = 'pk.eyJ1IjoiYWRtaW5zaW5haSIsImEiOiJja2N2czJ2ejcwNzdoMzBtbDVneTh6NTNkIn0.pkiEoq-UDjbqvdDrB_zZCQ';
      var flying = false;
      var mapCenter = centerMap;

      var _map = new mapboxgl.Map({
        container: mapBloc,
        //Без #
        style: 'mapbox://styles/mapbox/light-v10',
        center: mapCenter,
        zoom: 15.9,
        attributionControl: false
      });

      _map.scrollZoom.disable();

      var nav = new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true
      });

      if ($(itemEl).exists()) {
        var _temp = 0;

        try {
          var fly = function fly(i) {
            _map.flyTo({
              center: projectsData[i],
              zoom: 15.9,
              bearing: 0,
              essential: true // this animation is considered essential with respect to prefers-reduced-motion

            });

            _map.fire('flystart');

            return i;
          };

          $(itemEl).each(function () {
            var coordinatesData = $(this).data('coordinates');
            var el = document.createElement('div');
            var doc = new DOMParser().parseFromString('<svg width="80" height="80" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="rect" y="59" width="83.4386" height="83.4386" transform="rotate(-45 0 59)" fill="#40424C"/><path d="M68.2258 75.368V45.0131C68.2258 44.0275 67.4259 43.2275 66.4402 43.2275H52.1556C51.1699 43.2275 50.37 44.0275 50.37 45.0131V75.368" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>                <path d="M50.3699 53.9409H43.2276C42.242 53.9409 41.442 54.7409 41.442 55.7265V75.3679" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>                <path d="M77.1537 75.3679V55.7265C77.1537 54.7409 76.3538 53.9409 75.3682 53.9409H68.2258" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M54.8339 68.2256H63.7618" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M61.9763 68.2256V75.3679" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M56.6195 75.3679V68.2256" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M55.7267 56.6194H62.869" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M55.7267 61.976H62.869" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M55.7267 51.2627H62.869" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M46.7988 61.976H50.37" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M46.7988 68.2256H50.37" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M68.2258 61.976H71.797" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M68.2258 68.2256H71.797" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M78.9393 75.3679H39.6565" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', 'application/xml');
            el.appendChild(el.ownerDocument.importNode(doc.documentElement, true));
            el.className = 'marker';
            markerArr.push(el);
            new mapboxgl.Marker(el).setLngLat(coordinatesData) // sets a popup on this marker
            .addTo(_map);
          });
          var projectsData = [];
          $(itemEl).each(function (i) {
            markerArr[i].setAttribute('data-href', $(this).data('href'));

            if ($(this).data('coordinates') != undefined) {
              projectsData.push($(this).data('coordinates'));
            }

            $(this).hover(function () {
              fly(i);
              _temp = fly(i);
            });
          });

          _map.on('moveend', function (e) {
            if (flying) {
              markerArr[_temp].classList.add('marker--active');

              for (var _i3 = 0; _i3 < markerArr.length; _i3++) {
                if (_i3 != _temp) {
                  markerArr[_i3].classList.remove('marker--active');
                }
              }

              _map.fire('flyend');
            }
          });

          _map.on('flystart', function () {
            flying = true;
          });

          _map.on('flyend', function () {
            flying = false;
          });

          markerArr.forEach(function (element) {
            element.addEventListener('click', function () {
              var hrefPath = this.getAttribute('data-href');
              location = hrefPath;
            });
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  createMap('map-projects', '.structure__item');
  createMap('map-flat', '#map-flat');
  createMap('map-contacts', '#map-contacts');

  if ($('.form-project__field').exists) {
    $('.form-project__field').each(function () {
      var _this = this;

      $(this).on('mousemove', function () {
        $(_this).closest('.form-project__block').addClass('form-project__block--active');
      });
      $(this).on('mouseleave', function () {
        if (!$(_this).is(":focus") && !$(_this).val()) {
          $(_this).closest('.form-project__block').removeClass('form-project__block--active');
        }
      });
      $(this).on('blur', function () {
        if (!$(this).val()) {
          $(this).closest('.form-project__block').removeClass('form-project__block--active');
        }
      });
    });
  }

  if ($('.building-filter__wrp').length > 0) {
    $('.building-filter__wrp').each(function () {
      $(this).on('click', function () {
        var temp = $(this).parent().toggleClass('building-filter__case--active');
        $(this).closest('.building-filter__col').siblings().find('.building-filter__case').removeClass('building-filter__case--active');
        $('.building-filter__case').each(function (index) {
          if ($(this)[0] != temp[0] && $(this)[0].classList.contains('building-filter__case--active')) {
            $(this)[0].classList.remove('building-filter__case--active');
          }
        });
      });
      $(this).next('.building-filter__select').mCustomScrollbar({
        theme: "minimal-dark",
        mouseWheelPixels: 90
      });
    });
    $(document).click(function (e) {
      var elem = $('.building-filter__case');

      if (e.target != elem[0] && !elem.has(e.target).length) {
        elem.removeClass('building-filter__case--active');
      }
    });
  }

  if ($('.filter-sort__wrp').length > 0) {
    $('.filter-sort__wrp').each(function () {
      $(this).on('click', function () {
        $(this).parent().toggleClass('filter-sort__case--active');
      });
      $(this).next('.filter-sort__select').mCustomScrollbar({
        theme: "dark",
        mouseWheelPixels: 90
      });
    });
    $(document).click(function (e) {
      var elem = $('.filter-sort__case');

      if (e.target != elem[0] && !elem.has(e.target).length) {
        elem.removeClass('filter-sort__case--active');
      }
    });
  }

  if ($('.filter-sort__unit').exists()) {
    $('.filter-sort__unit').each(function () {
      var dataVal = 0;
      var dataSlide = 0;
      $(this).on('click', function () {
        $('.filter-sort__text').text($(this).text());
        $('.filter-sort__case').removeClass('filter-sort__case--active');
        dataVal = $(this).find('input').data('period');
      });
    });
  }

  if ($('.building-filter__unit').length > 0) {
    $('.building-filter__unit').each(function () {
      $(this).on('click', function () {
        $(this).closest('.building-filter__case').find('.building-filter__text').text($(this).text());
        $('.building-filter__case').removeClass('building-filter__case--active');
      });
    });
  }

  if ($('.project-period__bloc').length > 0) {
    $('.project-period__bloc').each(function () {
      $(this).on('click', function () {
        $(this).parent().toggleClass('project-period__box--active');
        $(this).closest('.building-filter__col').siblings().find('.project-period__box').removeClass('project-period__box--active');
      });
    });
  }

  if ($('.project-period__slider').exists()) {
    try {
      var _projecPeriod = new Swiper('.project-period__slider', {
        slidesPerView: '1',
        spaceBetween: 40,
        effect: 'fade',
        autoplay: {
          delay: 5000
        },
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: '.inner-slider__num',
          type: "custom",
          renderCustom: function renderCustom(swiper, current, total) {
            var i = current ? current : 0;
            return "<span>".concat(("" + i).slice(-2), "</span>") + "/<span>".concat(("" + total).slice(-2), "</span>");
          }
        },
        navigation: {
          nextEl: '.inner-slider__link--next',
          prevEl: '.inner-slider__link--prev'
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  if ($('.project-period__unit').exists()) {
    $('.project-period__unit').each(function () {
      var dataVal = 0;
      var dataSlide = 0;
      $(this).on('click', function () {
        $('.project-period__text').text($(this).text());
        $('.project-period__box').removeClass('project-period__box--active');
        dataVal = $(this).find('input').data('period');
        $('.project-period__slider .swiper-slide').each(function () {
          dataSlide = $(this).data('slide');

          if (dataSlide == dataVal) {
            projecPeriod.slideTo(dataSlide - 1);
            return false;
          }
        });
      });
    });
  }

  $(document).click(function (e) {
    var elem = $('.project-period__box');

    if (e.target != elem[0] && !elem.has(e.target).length) {
      elem.removeClass('project-period__box--active');
    }
  });

  if ($('.menu-content__inner').exists()) {
    try {
      $('a[href^="#"]').click(function () {
        var anchor = $(this).attr('href');
        $('html, body').animate({
          scrollTop: $(anchor).offset().top - 130
        }, 600);
      });
      var anchor = {
        el_menu: '.menu-content__inner:eq(0)',
        // Меню
        // Старт
        init: function init() {
          anchor.menu();
          $(document).scroll(function () {
            anchor.scolling();
          });
        },
        // Собираем якоря из меню
        menu: function menu() {
          anchor.links_arr = [];
          $('' + anchor.el_menu + ' a').each(function (i) {
            if ($(this).attr('href')) {
              if ($(this).attr('href').indexOf('#') != -1) {
                var resh = $(this).attr('href').indexOf('#'),
                    all = $(this).attr('href').length,
                    val = $(this).attr('href').substr(resh, all);
                anchor.links_arr[i] = $(this).attr('href') + '::' + val;
              }
            }
          });
        },
        scolling: function scolling() {
          anchor.links_arr.forEach(function (item) {
            var item_arr = item.split('::');

            if (anchor.inWindow('' + item_arr[1] + '').length > 0) {
              $('.menu-content__li').removeClass('menu-content__li--active');
              $('a[href="' + item_arr[0] + '"]').addClass('menu-content__li--active');
              return false;
            }
          });
        },
        // Проверка якоря в области видимости
        inWindow: function inWindow(s) {
          var scrollTop = $(window).scrollTop() - 70,
              windowHeight = $(window).height(),
              currentEls = $(s),
              result = [];
          currentEls.each(function () {
            var el = $(this),
                offset = el.offset();
            if (scrollTop <= offset.top && el.height() + offset.top < scrollTop + windowHeight) result.push(this);
          });
          return $(result);
        }
      };
      anchor.init();
    } catch (err) {
      console.log(err);
    }
  }

  $(window).on('resize load', function () {
    if ($(this).width() > 922) {
      fixBloc('.menu-content', '.menu-content__inner', true);
    }
  });
  fixBloc('.mf-fix', '.structure__inner', false);
  fixBloc('.mf-move', '.structure__inner', true);

  function fixBloc(bloc, target, fix) {
    if ($(bloc).exists()) {
      try {
        if (fix) {
          var $window = $(window),
              _$target = $(target),
              $h = _$target.offset().top;

          $window.on('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > $h) {
              _$target.addClass("mf-fixed");

              return;
            } else {
              _$target.removeClass("mf-fixed");
            }

            return;
          });
        } else {
          $target.removeClass("mf-fixed");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  if ($('.project-map__item').exists()) {
    $('.project-map__item').each(function () {
      $(this).on('click', function () {
        //  $(this).find('input').prop('checked', true);
        if ($(this).find('input').is(':checked')) {
          $(this).addClass('project-map__item--active');
        } else {
          $(this).removeClass('project-map__item--active');
        }
      });
    });
  }

  function createPag(block, swiperCont) {
    var bloc = document.querySelector(block);
    var qtySlide = swiperCont.slides.length;
    var parentEl = bloc.querySelectorAll('.swiper-menu');
    console.log(parentEl);

    if (qtySlide > 0) {
      for (var _i4 = 0; _i4 < parentEl.length; _i4++) {
        for (var j = 0; j < qtySlide; j++) {
          var itemSlide = document.createElement('div');
          itemSlide.classList.add('swiper-menu__item');
          itemSlide.setAttribute('data-index', j);

          if (j == 0) {
            itemSlide.classList.add('swiper-menu__item--active');
          }

          parentEl[_i4].appendChild(itemSlide);
        }
      }
    }
  }

  function checkPag(contecst, sliderBox, slider) {
    //console.log(contecst);
    //console.log(slider);
    var contecsts = contecst;
    var index = $(contecsts).data('index');
    slider.slideTo(index);
    var arrItem = $(sliderBox).find('.swiper-menu__item');

    for (var _i5 = 0; _i5 < arrItem.length; _i5++) {
      if ($(arrItem[_i5]).data('index') == index) {
        arrItem[_i5].classList.add('swiper-menu__item--active');
      } else {
        arrItem[_i5].classList.remove('swiper-menu__item--active');
      }
    }

    $(contecst).addClass('swiper-menu__item--active');
  }

  if ($('.inner-slider').exists()) {}

  if ($('.inner-slider').exists()) {
    try {
      var _projectImg = new Swiper('.inner-slider', {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.inner-slider__link--next',
          prevEl: '.inner-slider__link--prev'
        },
        pagination: {
          el: '.inner-slider__num',
          type: "custom",
          renderCustom: function renderCustom(swiper, current, total) {
            var i = current ? current : 0;
            return "<span>".concat(("" + i).slice(-2), "</span>") + "/<span>".concat(("" + total).slice(-2), "</span>");
          }
        },
        onTouchMove: function onTouchMove(projectImg, event) {
          alert(projectImg);
        }
      });

      createPag('.inner-slider', _projectImg);
      $('.inner-slider .swiper-menu').on('click', '.swiper-menu__item', function () {
        checkPag(this, '.inner-slider', _projectImg); // console.log($(this))
        // if ($(this).data('index') != index) {
        //     $(this).removeClass('swiper-menu__item--active');
        // } else {
        //     $(this).addClass('swiper-menu__item--active');
        // }
      });
    } catch (err) {
      console.log('Ошибка ' + err.name + ":" + err.message + "\n" + err.stack);
    }
  } // if ($('.project-period__slider').exists()) {
  //     createPag('.project-period__slider', projecPeriod);
  // }
  // //console.log(projecPeriod);

});