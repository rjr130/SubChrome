app.factory('androidapps', function() {

    var all_ = [
        { 
            "id": "com.facebook.katana",
            "img": "https://lh5.ggpht.com/_XklY7dK6yGsYt53X15RIp7-tbdjWMwQwl_iUAcW-uSq_8zAprmywdn5DQfBHvxZurs1=w300-rw",
            "name": "Facebook"
        },
        { 
            "id": "thevoxelagents.puzzleretreat",
            "img": "https://lh6.ggpht.com/9z5Z-pZHyyow0nUlhfgfwqlNcyjlabLgch84klUVyLl0okW3GJhTXBkLxXdCywKE2Q=w300-rw",
            "name": "Puzzle Retreat",
            "perms": {
                

            }
        }
    ];

  return {
    all: function(){ return all_; },
    query: function(term){
    	return all_.filter(function(app){
            return app.name.toLowerCase().indexOf(term.toLowerCase()) != -1;
        });
	}
  }
});