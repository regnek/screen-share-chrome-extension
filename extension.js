chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    switch (message && message.type) {
        // Our web app sent us a "getUserScreen" request.
        case 'getUserScreen':
            handleGetUserScreenRequest(message.sources, sender.tab, sendResponse);
            break;

        // Our web app sent us a request we don't recognize.
        default:
            handleUnrecognizedRequest(sendResponse);
            break;
    }

    return true;
});

function handleGetUserScreenRequest(sources, tab, sendResponse) {
    chrome.desktopCapture.chooseDesktopMedia(sources, tab, streamId => {
        // The user canceled our request.
        if (!streamId) {
            sendResponse({
                type: 'error',
                message: 'Failed to get stream ID'
            });
        }

        // The user accepted our request.
        sendResponse({
            type: 'success',
            streamId: streamId
        });
    });
}

function handleUnrecognizedRequest(sendResponse) {
    sendResponse({
        type: 'error',
        message: 'Unrecognized request'
    });
}