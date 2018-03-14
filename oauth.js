// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function getURL(action){
    chrome.extension.sendRequest(
            {
                req: "geturl",
                act: action
            },
                function(response)
                {
                    return response.reply;
                });
            }

window.onload = function() {
chrome.identity.getAuthToken({interactive: true}, function(token) {
      var init = {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        'contentType': 'json'
      };
      fetch(
          'https://www.google.com/m8/feeds/contacts/default/full?alt=json&v=3.0',
          init)
          .then((response) => response.json())
          .then(function(data) {
            let photoDiv = document.querySelector('#friendDiv');
            var contacts = [];
	          var data = data;
            	  for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
	    var contact = {
	      'name' : entry['title']['$t'],
	      'id' : entry['id']['$t'],
	      'emails' : [],
	      'phone': [],
	      'notes': (entry['content'])? entry['content']['$t'] : [],
	      'lead' : (entry['gContact$userDefinedField'])? customField(entry['gContact$userDefinedField'],'Lead Type') : [],
	      'first': (entry['gContact$userDefinedField'])? customField(entry['gContact$userDefinedField'],'First Contact') : [],
	      'last' : (entry['gContact$userDefinedField'])? customField(entry['gContact$userDefinedField'],'Last Contact') : [],
	      'next' : (entry['gContact$userDefinedField'])? customField(entry['gContact$userDefinedField'],'Next Contact') : []    
	    };
                  if (entry['gd$email']) {
	      var emails = entry['gd$email'];
	      for (var j = 0, email; email = emails[j]; j++) {
	        contact['emails'].push(email['address']);
	      }
	    }
	   
	          if (entry['gd$phoneNumber']) {
	      var phone = entry['gd$phoneNumber'];
	      for (var j = 0, number; number = phone[j]; j++) {
	        contact['phone'].push(number['$t']);
	      }
	    }
				  
	    if (!contact['name']) {
	      contact['name'] = " ";
	    }
	    contacts.push(contact);
   
       //Add divs contacts info
          var output = document.getElementById('container');
	
	  for (var j = 0, email; email = contact['emails'][j]; j++) {
	var div = document.createElement("div");

div.innerHTML =
    '<form id="form-'+ contact['id'] +'" onsubmit="handleFormSubmit(this)">\n'+
      '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
    '<input class="mdl-textfield__input" type="text" id="sample3" value="test">'+
    '<label class="mdl-textfield__label" for="sample3">Text...</label>'+
  '</div>'+
            '<label for="id"></label>\n'+
            '<input name="id" class="hidden" type="text" value="'+ contact['id'] +'">\n'+
            '<label for="handler"></label>\n'+
            '<input name="handler" class="hidden" type="text" value="updateContact">\n'+
            '<div>'+
            '<label for="Lead Type">Lead Type</label>\n'+
            '<select name="Lead Type" id="leadtype" disabled>\n'+
             '<option>'+ contact['lead'] + '</option>\n'+
             '<option>Call</option>\n'+
             '<option>Cold Call</option>\n'+
             '<option>Walk-in</option>\n'+
             '<option>Internet</option>\n'+
             '<option>Archive</option>\n'+
             '</select>\n'+
             '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
             '<label class="mdl-textfield__label" for="first">First Contact</label>'+
	         '<input class="mdl-textfield__input" type="date" id="first" value="' + contact['first'] + '">'+
	         '</div>'+
             '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
             '<label class="mdl-textfield__label" for="last">Last Contact</label>'+
	         '<input class="mdl-textfield__input" type="date" id="last" value="' + contact['last'] + '">'+
	         '</div>'+
             '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
             '<label class="mdl-textfield__label" for="first">Next Contact</label>'+
	         '<input class="mdl-textfield__input" type="date" id="next" value="' + contact['next'] + '">'+
	         '</div>'+
            '</div>'+
         '<div>'+
     '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
     '<label class="mdl-textfield__label" for="name">Name</label>'+
	 '<input class="mdl-textfield__input" type="text" id="name" value="' + contact['name'] + '">'+
	 '</div>'+
     '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
	 '<input class="mdl-textfield__input" type="text" id="phone" value="' + contact['phone'] + '">'+
     '<label class="mdl-textfield__label" for="phone">Phone</label>'+
	 '</div>'+
     '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
	 '<input class="mdl-textfield__input" type="text" id="email" value="' + contact['emails'] + '">'+
     '<label class="mdl-textfield__label" for="email">Email</label>'+
	 '</div>'+
     '</div>'+
         '<div style="float:left; width:80%;">\n'+
          '<label for="Notes">Notes</label>\n'+
          '<textarea name="Notes" class="uk-textarea" id="ctextarea" rows="3" placeholder="" disabled>' + contact['notes'] + '</textarea>\n'+
          '<tr><td><button type="submit" id="save-'+ contact['id'] + '" class="uk-button pure-button" style="display:none; height:30px; width: 85px; margin:2px;">Save</button></td></tr>\n'+
          '<tr><td><button type="reset" id="cancel-'+ contact['id'] + '" onclick="resetContact('+ contact['id'] +')" class="uk-button pure-button" style="display:none; height:30px; width: 85px; margin:2px;">Cancel</button></td></tr>\n'+
         '</div>\n'+
       '<div class="buttonborder">\n'+
       '<table style="float: right;">\n'+
       '<tr><td><button type="button" id="edit"   onclick="editContact('+ contact['id'] + ')"class="uk-button-primary pure-button" style="height:30px; width: 85px; margin:2px;">Edit</button></td></tr>\n'+
       '<tr><td><button type="button" id="remove" onclick="removeContact('+ contact['id'] + ')" class="uk-button-war pure-button" style="height:30px; width: 85px; margin:2px;">Remove</button></td></tr>\n'+
       '<tr><td><button type="button" id="delete" onclick="deleteContact('+ contact['id'] + ')" class="uk-button-danger pure-button" style="height:30px; width: 85px; margin:2px;">Delete</button></td></tr>\n'+
       '</table>\n'+
      '</div>\n'+
      '</form> \n';
		  
        div.className += 'mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp mdl-cell--8-col-tablet cardpadding';		  
	  }
	  output.appendChild(div);             
                
                  
       }
      
          });
    });
};

function customField(fields, field){
 // Logs the value of all the custom fields for contact
        for (var i = 0; i < fields.length; i++) {
          if (fields[i]['key'] == field) {
           return fields[i]['value'];  
          }
        }


}
