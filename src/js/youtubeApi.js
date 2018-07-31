/**
 * List a YouTube HTTP API resource.
 *
 * @param {string} resource - The path of the resource.
 * @param {object} params - The API parameters.
 * @param {function} success - The function to be called on success.
 *
 * @return {Void}
 */

function youtubeAPI(resource, params, success) {
  params.key = settingsView.apiKey;

  let requestUrl = 'https://www.googleapis.com/youtube/v3/' + resource + '?' + $.param(params);

  if (useTor) {
    tor.request(requestUrl, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        success(JSON.parse(body));
      } else {
        showToast('Unable to connect to the Tor network. Check the help page if you\'re having trouble setting up your node.');
        console.log(err);
        console.log(res);
        console.log(body);
        loadingView.seen = false;
      }
    });
  } else {
    $.getJSON(
      requestUrl,
      success
    ).fail((xhr, textStatus, error) => {
      showToast('There was an error calling the YouTube API.');
      console.log(error);
      console.log(xhr);
      console.log(textStatus);
      loadingView.seen = false;
    });
  }


}

/**
 * Use youtube-dl to resolve a video.
 *
 * @param {string} videoId - The video Id to get info from.
 * @param {function} callback - The function called on success with the info.
 *
 * @return {Void}
 */
function youtubedlGetInfo(videoId, callback) {

  let url = 'https://youtube.com/watch?v=' + videoId;
  let options = ['--all-subs', '--write-subs'];

  ytdl.getInfo(url, options, function(err, info) {
    if (err) {
      showToast(err.message);
      loadingView.seen = false;
      console.log(err);
      console.log(info);
      return;
    }

    console.log('Success');
    callback(info);
  });
}
