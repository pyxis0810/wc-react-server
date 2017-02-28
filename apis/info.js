var express = require('express');
var router = express.Router();
var InfoModel = require('../models/info');
var config = require('../config');

var googleMapsClient = require('@google/maps').createClient({
  key: config.googleMap.apiKey
});

router.get('/', function(req, res, next) {
  InfoModel.findOne().sort({ created_at: -1 }).exec(function(err, info) {
    if (err) { return next(err); }

    var address = info.address.ko;

    googleMapsClient.geocode({
      address: address
    }, function(err, response) {
      if (!err) {
        var location = response.json.results[0].geometry.location;
        info.location = location;
        res.json({
          location: location,
          address: info.address,
          transportation: info.transportation,
          place: info.place,
          date: info.date,
          time: info.time,
          profiles: info.profiles,
          comment: info.comment
        });
      }
    });
  });
});

router.post('/', function(req, res, next) {
  var Info = new InfoModel({
    address: {
      ko: '서울시 강남구 논현로 662',
      en: '662, Nonhyeon-ro, Gangnam-gu, Seoul, Republic of Korea'
    },
    place: {
      ko: '헤리츠 2층 아그니스홀',
      en: 'Heritz 2F Agnes Hall'
    },
    transportation: {
      bus: [147, 240, 241, 401, 463, 3412, 3414, 4211, 6411],
      subway: {
        ko: '7호선 학동역 하차 3번출구 바로앞 위치',
        en: 'Hak-dong Station(LINE 7) EXIT 3'
      }
    },
    date: '2017-03-25',
    time: '12:30',
    profiles: {
      groom: {
        firstname: {
          ko: '기환',
          en: 'Kihwan'
        },
        lastname: {
          ko: '조',
          en: 'Cho'
        },
        parents: ['조송휘', '임영숙'],
        title: '차남',
        phone: '010-8919-0801',
        email: 'pyxis0810@gmail.com'
      },
      bride: {
        firstname: {
          ko: '수경',
          en: 'Sukyung'
        },
        lastname: {
          ko: '임',
          en: 'Im'
        },
        parents: ['임홍근', '이윤영'],
        title: '장녀',
        phone: '010-3939-2013',
        email: 'tnrudvip@gmail.com'
      }
    },
    comment: {
        ko: '오랜 기다림 속에서 저희 두사람, 한마음 되어 참된 사랑의 결실을 이루게 되었습니다. 부디 오셔서 저희의 앞날을 축복해 주시고 격려해 주시면 더없는 기쁨이 되겠습니다.',
        en: 'The honor of your presence is requested at the marriage of'
    }
  });

  Info.save(function(err, info) {
    if (err) { return next(err); }

    res.json(info);
  });
});

module.exports = router;