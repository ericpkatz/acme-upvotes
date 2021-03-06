const Sequelize = require('sequelize');
const { STRING, INTEGER } = Sequelize;
const conn = new Sequelize('postgres://localhost/acme_db');

const Product = conn.define('product', {
  name: STRING,
  upvoteCount: {
    type: INTEGER,
    defaultValue: 0
  }
});



const Upvote = conn.define('upvote', {
  productId: {
    type: INTEGER,
    allowNull: false
  }
});

Upvote.addHook('afterCreate', async(upvote)=> {
});

Upvote.belongsTo(Product);



const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  let [foo, bar] = await Promise.all([
    Product.create({ name: 'foo'}),
    Product.create({ name: 'bar'}),
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
    Upvote.create({ productId: bar.id })
  ]);

  bar = await Product.findByPk(bar.id);
  console.log(bar.upvoteCount);

};

syncAndSeed();
