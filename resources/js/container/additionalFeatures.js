/*
 * Copyright (c) 2011, salesforce.com <http://salesforce.com> , inc.
 * Author: Akhilesh Gupta
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided 
 * that the following conditions are met:
 * 
 *    Redistributions of source code must retain the above copyright notice, this list of conditions and the 
 *    following disclaimer.
 *  
 *    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and 
 *    the following disclaimer in the documentation and/or other materials provided with the distribution. 
 *    
 *    Neither the name of salesforce.com <http://salesforce.com> , inc. nor the names of its contributors may be used to endorse or 
 *    promote products derived from this software without specific prior written permission.
 *  
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED 
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR 
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED 
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING 
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */
 
function saveUserPic() {
    navigator.camera.getPicture(onPicSuccess, onPicFail, { quality: 50 }); 
}

function showContactPicture(contactId) {
    var existingPic = StorageManager.getLocalValue(contactId + '__pic');
    if (existingPic) {
    	existingPic = "data:image/jpeg;base64," + existingPic;
    } else {
    	existingPic = staticRsrcUrl + '/images/userPicwBorder.png';
    }
   	$j('#photo_div img').attr('src', existingPic);
}

function onPicSuccess(imageData) {
	ManageUserSession.getApiClient().addAttachment('ContactViewer-UserPhoto', listView.selectedContactId, imageData);
    StorageManager.setLocalValue(listView.selectedContactId + '__pic', imageData);
    showContactPicture(listView.selectedContactId);
}

function onPicFail(message) {
    console.log('Pic Failed because: ' + message);
}

$j(function() {
	$j('#photo_div img').enableTap().click(saveUserPic);
	if (typeof sforce.Client != 'undefined') {
		sforce.Client.prototype.addAttachment = function(name, parentId, base64Content, success, error, complete) {
			var url = getBaseUrl() + '/services/apexrest/cvapi?action=insertSObject&sobject=Attachment',
				attachment = {"Name": name, "ParentId": parentId, "Body": base64Content};
			this.ajax('POST', url, attachment, success, error, complete);
		}
	}
});