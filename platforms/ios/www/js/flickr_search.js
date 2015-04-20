window.flickr_search = function(keyword, callback) {
  var url;
  if (typeof window.flickr_key !== 'undefined') {
    url = "https://api.flickr.com/services/rest?method=flickr.photos.search&per_page=10&text='" + keyword + "'&api_key=" + window.flickr_key + "&format=json";
    return $.ajax({
      url: url,
      dataType: "html",
      cache: false,
      success: function(data, textStatus) {
        var d, photos;
        data = data.replace(/^jsonFlickrApi\(/, '');
        data = data.replace(/\)$/, '');
        d = JSON.parse(data);
        photos = d['photos']['photo'];
        return callback(photos.map(function(photo) {
          return "http://farm" + photo['farm'] + ".staticflickr.com/" + photo['server'] + "/" + photo['id'] + "_" + photo['secret'] + ".jpg";
        }));
      },
      error: function(xhr, textStatus, errorThrown) {
        return alert("error " + textStatus);
      }
    });
  }
};
