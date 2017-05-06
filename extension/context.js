/* global chrome, console, Image */
// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// A generic onclick callback function.
// function genericOnClick (info, tab) {
//   // console.log('item ' + info.menuItemId + ' was clicked', info.linkUrl);
//   console.log('info: ', info);
//   // console.log('tab: ', tab);
//   if (info.linkUrl) {
//     console.log(123);
//     chrome.contextMenus.create({
//       'title': 'Test img item',
//       'parentId': info.menuItemId
//     });
//   }
// }

var parent = chrome.contextMenus.create({
  'title': '1. My context menus',
  'contexts': ['page', 'link']
});

chrome.contextMenus.create({
  'title': '`. get Twitter text',
  'contexts': ['page', 'link'],
  'parentId': parent,
  'onclick': (info, tab) => {
    let url = tab.url.split('?utm')[0];

    chrome.tabs.create({'url': `data:text/html;charset=utf-8,<meta charset="utf-8"><textarea style="font-size: 3em; width: 50vw; height: 50vh;">
${tab.title}%0A
by ${new Date().toJSON().split('T')[0]}%0A
${url}%0A
#f2etw
</textarea>`,
      'index': tab.index + 1});
  }
});

chrome.contextMenus.create({
  'title': '1. 繁',
  'contexts': ['page', 'link'],
  'parentId': parent,
  'onclick': function (info, tab) {
    var url = info.linkUrl || info.pageUrl;
    window.open('https://translate.google.com/translate?sl=auto&tl=zh-TW&u=' + url);
  }
});

chrome.contextMenus.create({
  'title': '2. FB',
  'contexts': ['page', 'link'],
  'parentId': parent,
  'onclick': function (info, tab) {
    var url = info.linkUrl || info.pageUrl;
    if (/www\.facebook\.com/.test(url)) {
      window.open(url.replace(/www\.facebook\.com/, 'm.facebook.com'));
    } else if (/m\.facebook\.com/.test(url)) {
      var personalUrl = url.match(/story_fbid=(\d+)&id=(\d+)/);

      if (personalUrl) {
        window.open('https://www.facebook.com/' + personalUrl[2] + '/posts/' + personalUrl[1]);
      } else {
        window.open(url.replace(/m\.facebook\.com/, 'www.facebook.com'));
      }
    }
  }
});

chrome.contextMenus.create({
  'title': '3. open iframe',
  'contexts': ['frame'],
  'parentId': parent,
  'onclick': function (info, tab) {
    window.open(info.frameUrl);
  }
});

chrome.contextMenus.create({
  'title': '4. Twitter',
  'contexts': ['page', 'link'],
  'parentId': parent,
  'onclick': function (info, tab) {
    var url = info.linkUrl || info.pageUrl;
    if (/\/\/twitter\.com/.test(url)) {
      window.open(url.replace(/twitter\.com/, 'mobile.twitter.com'));
    } else if (/mobile\.twitter\.com/.test(url)) {
      window.open(url.replace(/mobile\.twitter\.com/, 'twitter.com'));
    }
  }
});

chrome.contextMenus.create({
  'title': 'open img',
  'contexts': ['image'],
  'onclick': function (info, tab) {
    function convertImgToBase64 (url, callback, outputFormat) {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL();
        callback.call(this, dataURL);
        canvas = null;
      };
      img.src = url;
    }

    var imageUrl = info.srcUrl;
    convertImgToBase64(imageUrl, function (base64Img) {
      var x = /\xff\xc2/.test(base64Img);
      console.log(base64Img, x);
    });
  }
});

chrome.contextMenus.create({
  'title': '1. 譯: %s',
  'contexts': ['selection'],
  // 'parentId': parent,
  'onclick': function (info, tab) {
    console.log(info, tab);
    window.open('http://cdict.net/?q=' + info.selectionText, 'CDICT');
  }
});

chrome.contextMenus.create({
  'title': 'Youtube embed',
  'contexts': ['page', 'link'],
  'parentId': parent,
  'targetUrlPatterns': ['*://www.youtube.com/watch*'],
  'onclick': function (info, tab) {
    console.log(info, tab);
    var pattern_yt = /www\.youtube\.com\/watch/;
    var url = info.linkUrl || info.pageUrl;
    if (!url || !pattern_yt.test(url)) { return; }
    window.open(url.replace(/\/watch\?v\=/, '/embed/').replace(/\&list/, '?list'));
  }
});
