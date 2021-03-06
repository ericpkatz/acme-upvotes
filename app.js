const redis = require('redis');
const client = redis.createClient();
const Sequelize = require('sequelize');
const { STRING, INTEGER, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize('postgres://localhost/acme_db');

const Product = conn.define('product', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING,
});

Product.prototype.upvoteCount = function(){
  return new Promise((res, rej)=> {
    client.get(`Product-${this.id}`, (err, value)=> {
      if(err){
        return rej(err);
      }
      res(value);
    });
  });
}


const Upvote = conn.define('upvote', {
  productId: {
    type: UUID,
    allowNull: false
  }
});

Upvote.addHook('afterCreate', async(upvote)=> {
  return new Promise((res, rej)=> {
    client.incr(`Product-${upvote.productId}`, (err)=> {
      if(err){
        return rej(err);
      }
      res();
    })
  });
});

Upvote.belongsTo(Product);


const flushRedis = ()=> {
  return new Promise((res, rej)=> {
    client.flushdb((err)=> {
      if(err){
        return rej(err);
      }
      res();
    });
  });
};

const syncAndSeed = async()=> {
  await flushRedis();
  await conn.sync({ force: true });
  let [foo, bar, bazz] = await Promise.all([
    Product.create({ name: 'foo'}),
    Product.create({ name: 'bar'}),
    Product.create({ name: 'bazz'}),
  ]);

  await Promise.all([
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: bar.id }),
    Upvote.create({ productId: foo.id }),
    Upvote.create({ productId: bazz.id })
  ]);

  console.log(await bar.upvoteCount());
  console.log(await foo.upvoteCount());

};

syncAndSeed();
