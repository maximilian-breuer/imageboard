var faker = require('faker');

var database = { images: []};

for ( var i = 1; i<= 50; i++) {
  database.images.push({
    id: ""+i,
    source: "https://source.unsplash.com/1600x9"+(10+i),
    tags: [faker.animal.cat(), faker.animal.cat()],
    date: faker.time.recent()
  });
}

console.log(JSON.stringify(database));
