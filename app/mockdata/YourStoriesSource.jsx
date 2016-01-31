var mockData = [
    {
        id: 1,
        title: "Spice and Wolf",
        description: "A travelling merchant meets a wolf-deity",
        lastupdated: "2016-01-01",
        passagesCount: 10,
    },
    {
        id: 2,
        title: "Save the date!",
        description: "It’s a perfectly normal evening, and you have a quiet dinner planned with one of your friends",
        lastupdated: "2016-01-01",
        passagesCount: 20,
    }
];


var YourStoriesSource = {
    fetch() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(mockData);
            }, 250);
        })
    }
}

export default YourStoriesSource;