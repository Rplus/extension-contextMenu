// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// A generic onclick callback function.
function genericOnClick(info, tab) {

    // console.log('item ' + info.menuItemId + ' was clicked', info.linkUrl);
    console.log('info: ', info);
    // console.log('tab: ', tab);
    if (info.linkUrl) {

        console.log(123);

        var x = chrome.contextMenus.create({
            'title': 'Test img item',
            'parentId': info.menuItemId
        });
    }
}

var parent = chrome.contextMenus.create({
    'title': 'Test parent item',
    'contexts': ['page', 'link']
});

chrome.contextMenus.create({
    'title': '繁',
    'contexts': ['page', 'link'],
    'parentId': parent,
    'onclick': function (info, tab) {
        var url = info.linkUrl || info.pageUrl;
        window.open('http://translate.google.com/translate?sl=auto&tl=zh-TW&u=' + url);
    }
});

chrome.contextMenus.create({
    'title': 'open iframe',
    'contexts': ['frame'],
    'parentId': parent,
    'onclick': function (info, tab) {
        window.open(info.frameUrl);
    }
});

chrome.contextMenus.create({
    'title': 'open img',
    'contexts': ['image'],
    'onclick': function (info, tab) {
        function convertImgToBase64(url, callback, outputFormat){
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img,0,0);
                var dataURL = canvas.toDataURL();
                callback.call(this, dataURL);
                canvas = null;
            };
            img.src = url;
        }


        var imageUrl = info.srcUrl;
        convertImgToBase64(imageUrl, function(base64Img){
             var x = /\xff\xc2/.test(base64Img);
             console.log(base64Img, x);
        });
    }
});

chrome.contextMenus.create({
    'title': '譯: %s',
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
        var pattern_yt = /www\.youtube\.com\/watch/,
            url = info.linkUrl || info.pageUrl;
        if (!url || !pattern_yt.test(url)) {return; }
        window.open(url.replace(/\/watch\?v\=/,'/embed/').replace(/\&list/,'?list'));
    }
});