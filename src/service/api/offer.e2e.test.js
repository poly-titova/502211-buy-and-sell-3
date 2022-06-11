'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `OK1nlU`,
    "category": [
      `Журналы`,
      `Игры`,
      `Книги`
    ],
    "description": `Если товар не понравится — верну всё до последней копейки. Таких предложений больше нет! Кажется, что это хрупкая вещь. Не пытайтесь торговаться. Цену вещам я знаю.`,
    "picture": `item04.jpg`,
    "title": `Куплю породистого кота.`,
    "type": `sale`,
    "sum": 28764,
    "comments": [
      {
        "id": `fokpWk`,
        "text": `А где блок питания?`
      },
      {
        "id": `1taug0`,
        "text": `Совсем немного... С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "id": `5nnopP`,
    "category": [
      `Разное`
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "type": `offer`,
    "sum": 54771,
    "comments": [
      {
        "id": `L82MZM`,
        "text": `А где блок питания?`
      },
      {
        "id": `SWwx8a`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `lGOtBF`,
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "id": `6rR9az`,
    "category": [
      `Книги`,
      `Животные`,
      `Разное`
    ],
    "description": `Не пытайтесь торговаться. Цену вещам я знаю. Две страницы заляпаны свежим кофе. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "picture": `item15.jpg`,
    "title": `Продам отличную подборку фильмов на VHS.`,
    "type": `offer`,
    "sum": 33475,
    "comments": [
      {
        "id": `UM-GTK`,
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `Ljr3er`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `IniHWg`,
        "text": `Оплата наличными или перевод на карту? А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `b-LNf6`,
        "text": `А сколько игр в комплекте?`
      }
    ]
  },
  {
    "id": `eHJ61z`,
    "category": [
      `Журналы`,
      `Книги`,
      `Животные`,
      `Разное`
    ],
    "description": `Даю недельную гарантию. Не пытайтесь торговаться. Цену вещам я знаю. Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item02.jpg`,
    "title": `Куплю породистого кота.`,
    "type": `sale`,
    "sum": 59400,
    "comments": [
      {
        "id": `mRs3Iy`,
        "text": `А где блок питания? Вы что?! В магазине дешевле. А сколько игр в комплекте?`
      },
      {
        "id": `HuqZrg`,
        "text": `Вы что?! В магазине дешевле.`
      },
      {
        "id": `c01Bmp`,
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `NuxXbV`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `MD60Og`,
    "category": [
      `Разное`
    ],
    "description": `Товар в отличном состоянии. Если найдёте дешевле — сброшу цену. Это настоящая находка для коллекционера! Продаю с болью в сердце...`,
    "picture": `item14.jpg`,
    "title": `Куплю антиквариат.`,
    "type": `offer`,
    "sum": 32862,
    "comments": [
      {
        "id": `XDrBEE`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First offer's id equals "OK1nlU"`, () => expect(response.body[0].id).toBe(`OK1nlU`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/OK1nlU`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Куплю породистого кота."`, () => expect(response.body.title).toBe(`Куплю породистого кота.`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/5nnopP`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offer is really changed`, () => request(app)
    .get(`/offers/5nnopP`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();

  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/6rR9az`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`6rR9az`));

  test(`Offer count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/eHJ61z/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
