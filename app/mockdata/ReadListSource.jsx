var featured = [
  {
    id: 1,
    title: "Spice and Wolf",
    description: "A travelling merchant meets a wolf-deity"
  },
  {
    id: 2,
    title: "Save the date!",
    description: "It’s a perfectly normal evening, and you have a quiet dinner planned with one of your friends"
  }
]

var categories = [
  {
    id: 1,
    name: "Fantasy"
  },
  {
    id: 2,
    name: "Science Fiction"
  },
  {
    id: 3,
    name: "Thriller"
  },
  {
    id: 4,
    name: "Mystery"
  },
  {
    id: 5,
    name: "Horror"
  }
]

var ReadListSource = {
    fetchFeatured() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(featured);
            }, 250);
        })
    },

    fetchCategories() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(categories);
            }, 250);
        })
    }
}

export default ReadListSource;