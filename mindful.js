vex.defaultOptions.className = 'vex-theme-plain';

function countdown(seconds) {
  $('.countdown').html(seconds);
  if (seconds > 0) {
    setTimeout(function(){
      seconds--;
      countdown(seconds);
    }, 1000);
  }
}

function showDialog() {
  var useCases = [
    "I want to put on some long-form content.",
    "I want to research a specific topic.",
    "I'm lonely.",
    "I'm bored.",
    "I'm tired.",
    "I don't feel good."
  ]

  var html = "";

  for (var useCase of useCases) {
    html += "<li><input type=\"radio\" name=\"useCase\">" + useCase + "</li>"
  }

  var cooldown = 30;

  vex.dialog.open({
    message: 'Why are you here?',
    input: "<form><ul>"+html+"</ul></form>",
    afterOpen: function($vexContent) {
      $('.vex').css({'z-index': '999999999999'})
      $('.vex-dialog-buttons').hide();
      $('.vex-dialog-form').append('<div class="countdown"></div>');
      countdown(cooldown);
      setTimeout(function(){
        $('.countdown').hide();
        $('.vex-dialog-buttons').show();
      }, cooldown * 1000);
    },
    showCloseButton: false,
    escapeButtonCloses: false,
    overlayClosesOnClick: false,
    callback: function(data) {
      if (data === false) {
        window.location.replace("https://unsplash.it/2000/1000/?random");
      }
    }
  });

  chrome.storage.local.set({ 'due' : (now.getTime() + 30*60000) }, function() {
    if(chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    } else {
      console.log('saved time')
    }
  });
}

now = new Date();

chrome.storage.local.get(null,function(results) {
  if(chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    if (results['due'] == 'undefined' || now.getTime() >= results['due']) {
      console.log('show');
      showDialog();
    } else {
      console.log('Dialog due in ' + ((results['due'] - now.getTime())/60000) + ' minutes');
    }
  }
});
