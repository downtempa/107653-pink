var panel = document.querySelector(".main-header__container");
var toggle = document.querySelector(".main-header__toggle");
var menu = document.querySelector(".main-nav__list");
var body = document.querySelector("body");

body.classList.add("js");

toggle.addEventListener("click", function (event) {
  event.preventDefault();
  panel.classList.toggle("main-header__container--menu-visible");
  menu.classList.toggle("main-nav__list--visible");
  toggle.classList.toggle("main-header__toggle--menu-visible");
});

ymaps.ready(function () {
  var myMap = new ymaps.Map('map', {
      center: [59.936111, 30.32196],
      zoom: 17,
      controls: []
    }, {
      searchControlProvider: 'yandex#search'
    }),
    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
      hintContent: 'Приезжай в гости!',
      balloonContent: 'Где-то здесь творит великий Кекс'
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#image',
      // Своё изображение иконки метки.
      iconImageHref: 'img/icon-map-marker.svg',
      // Размеры метки.
      iconImageSize: [36, 36],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset: [-15, -42]
    });
  myMap.geoObjects.add(myPlacemark);
});
