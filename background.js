// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: 'app.html'});
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.req == "geturl") {
        sendResponse({reply:"reply from background"});
    }
});
