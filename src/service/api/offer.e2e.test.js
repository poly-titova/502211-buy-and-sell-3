'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Книги`,
  `Разное`,
  `Животные`
];

const mockData = [
  {
    "categories": [
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
        "text": `А где блок питания?`
      },
      {
        "text": `Совсем немного... С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "categories": [
      `Разное`
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "type": `offer`,
    "sum": 54771,
    "comments": [
      {
        "text": `А где блок питания?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "categories": [
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
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      },
      {
        "text": `Оплата наличными или перевод на карту? А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `А сколько игр в комплекте?`
      }
    ]
  },
  {
    "categories": [
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
        "text": `А где блок питания? Вы что?! В магазине дешевле. А сколько игр в комплекте?`
      },
      {
        "text": `Вы что?! В магазине дешевле.`
      },
      {
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "categories": [
      `Разное`
    ],
    "description": `Товар в отличном состоянии. Если найдёте дешевле — сброшу цену. Это настоящая находка для коллекционера! Продаю с болью в сердце...`,
    "picture": `item14.jpg`,
    "title": `Куплю антиквариат.`,
    "type": `offer`,
    "sum": 32862,
    "comments": [
      {
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  const app = express();
  app.use(express.json());
  offer(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all offers`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First offer's title equals "Куплю породистого кота."`, () => expect(response.body[0].title).toBe(`Куплю породистого кота.`));

});

describe(`API returns an offer with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Куплю породистого кота."`, () => expect(response.body.title).toBe(`Куплю породистого кота.`));
});
describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    categories: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

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
    categories: [2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/offers/2`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer is really changed`, () => request(app)
    .get(`/offers/2`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const app = await createAPI();

  const validOffer = {
    categories: [3],
    title: `Это валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/20`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
  const app = await createAPI();

  const invalidOffer = {
    categories: [1, 2],
    title: `Это невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/20`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent offer`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/20`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's text is "Почему в таком ужасном состоянии?"`,
      () => expect(response.body[0].text).toBe(`Почему в таком ужасном состоянии?`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers/3/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/offers/3/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/20/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/2/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/offers/1/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/4/comments/100`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/20/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
