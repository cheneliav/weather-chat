var fetch = function () {
 
var city =  $('#city').val();
    $.ajax({
      method: "GET",
      
       url:"http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=d703871f861842b79c60988ccf3b17ec",
      success: function(data) {
        app.createCity(data.name,Math.round(data.main.temp-272.15));
        //  debugger;

      },
      error: function(jqXHR, textStatus, errorThrown) {
        app.createError();
        
      }
    }); 
  };


///////////////////////////////////////////////////////////////////////App
  var WeatherChatApp = function () {
    
    var cityArray = [];
  

//////////////////////////////////////////LocalStorage
  var STORAGE_ID = 'weatherchat';
    var saveToLocalStorage = function () {
      localStorage.setItem(STORAGE_ID, JSON.stringify(cityArray));
    }
    var getFromLocalStorage = function () {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    }
    
    cityArray = getFromLocalStorage();
//////////////////////////////////////////LocalStorage end

    var _renderCities = function () {
    
      var $enteriesCity = $('.enteries-city');
  
      $enteriesCity.empty();
     
      for (var i = 0; i < cityArray.length; i += 1) {
        var city = cityArray[i];
        var date = Date();

        // var commentsContainer = '<div class="comments-container">' + '<ul class=comments-list></ul>' +
        //   '<input type="text" class="comment-name">' +
        //   '<button class="btn btn-sm btn-success add-comment">Add Comment</button> </div>';

        var commentsContainer = '<div class="comments-container">' + 
        '<ul class=comments-list></ul>' + 
        '<div class="input-group mb-3">'+
        '<input type="text" class="form-control comment-name" id = "commentId"  aria-describedby="basic-addon2">'+
        '<div class="input-group-append">'+   
          '<button class="btn btn-success add-comment" type="button">Add Comment</button>'+
          '</div> </div> '+
          '</div>';

  
        $enteriesCity.append('<div class="city rounded" >' 
        + '<div class="header">'
        + '<h3>'+city.cityName +'</h3> <br/>'
        + '<a role="button" class="remove-city"> <i class="fa fa-trash"></i> </a>'
        + '</div>'
        + '<p>'+city.cityTemp +'&#176 c  ' + city.cityDate +'</p> <br/>'
         + commentsContainer + '</li>' + '</div>');
      }
    }
  /////////////////////////////////
    var _renderComments = function () {

      $('.comments-list').empty();
  
      for (var i = 0; i < cityArray.length; i += 1) {

        var city = cityArray[i];

        var $enteriesCity = $('.enteries-city').find('.city').eq(i);
  
        for (var j = 0; j < city.comments.length; j += 1) {
          
          var comment = city.comments[j];
        
          $enteriesCity.find('.comments-list').append(
            '<li class="comment">' + comment.text +
            '</li>'
          );
        };
      };
    };
  
    ///////////////////////////////////create
    var createCity = function (cityName,cityTemp) {
      var cityDate = Date();
      var City = { cityName: cityName ,
                   cityTemp: cityTemp,
                   cityDate: cityDate,
                   comments: [] }
      cityArray.unshift(City);
      saveToLocalStorage();

      _renderCities();
      _renderComments();
    };
  
    var removeCity = function ($clickedCity, index) {
      cityArray.splice(index, 1);
      $clickedCity.remove();
      saveToLocalStorage();
    };
    ///////////////////////////////////createComment
     var createComment = function (text, cityIndex) {
      var comment = { text: text };


      cityArray[cityIndex].comments.push(comment);
      saveToLocalStorage();

      _renderComments();
    };
    ///////////////////////////////////createError
    var createError = function () { 
      // $('.enteries-city').prepend('<p>City not found!!!!!</p>' );
     $('.not-found').text('City not found!!!!').show();
    };

     ///////////////////////////////////sortArray
     var sortArray = function (sortBy) { 
      
      switch(sortBy) {
        case '1':
        cityArray.sort(function(a,b){
          var dateA=new Date(a.cityDate); 
          var dateB=new Date(b.cityDate);
          return dateB-dateA;});
            break;
        case '2':
        cityArray.sort(function(a,b){
          return a.cityTemp-b.cityTemp;});
            break;
        case '3':
        cityArray.sort(function(a,b){
          var nameA=a.cityName.toLowerCase(); 
          var nameB=b.cityName.toLowerCase();
          if (nameA < nameB) 
            {return -1; }
          if (nameA > nameB)
            {return 1;}
            return 0;
          });
            break;    
    }
    saveToLocalStorage();
    _renderCities();
    _renderComments();

    };
  
    //  invoke the render method on app load
    _renderCities();
    _renderComments();
  
    return {
      createCity: createCity,
      removeCity: removeCity,
      createComment: createComment,
      createError: createError,
      sortArray: sortArray
     
    };
  };

  var app = WeatherChatApp();


///////////////////////////////////////////////////////////////////////////////main
  $('.find-temp-btn').on('click', function () {
    event.preventDefault(); //press enter
    $('.not-found').hide();
    fetch();
    $('#city').val('');
    });

    $('.enteries-city').on('click', '.add-comment', function () {
      // var text = $(this).siblings('.comment-name').val();
      var text = $(this).closest('.comments-container').find('.comment-name').val();

      var cityIndex = $(this).closest('.city').index();
      app.createComment(text, cityIndex);
      $(this).closest('.comments-container').find('.comment-name').val('');
    });  

    $('.enteries-city').on('click', '.remove-city', function () {
      
      var $clickedCity = $(this).closest('.city');
      var index = $(this).closest('.city').index();
      
      app.removeCity($clickedCity, index);
    });


    $('.sort-btn').on('click', function () {
      event.preventDefault(); //press enter
      $('.not-found').hide();
      var sortBy = $('.sotr-select').val();
      app.sortArray(sortBy);
  
      });
    