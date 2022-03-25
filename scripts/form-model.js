const formId = "1FAIpQLSc03o2glNj2DpuipxJsfqdZcU-UpCpzeu7-x8m1lGv0DD87-w";
const entry1 = "entry.791343280";
const entry2 = "entry.847895956";
const entry3 = "entry.1249386301";
const entry4 = "entry.2073569407";

const getPath = formId => `https://docs.google.com/forms/d/e/${ formId }/formResponse`;

const postToGoogleDB = function (data){
    const path = getPath(formId);
    const url = getURL(path, data);
    sendRequest('POST', url)
        .then(responseEvent);
}

const getURL = function(path, params){
    const url = new URL(path);
    for(let key in params){
        url.searchParams.set(key, params[key]);
    }
    return url;
}

const initRequest = function(verb, url){
    const init = new Object();
    init.method = verb;
    init.mode = 'no-cors';
    return new Request(url, init);
}

const sendRequest = async function(verb, url) {
    const request = initRequest(verb, url);
    const response = await fetch(request);
    return response;
}

const responseEvent = response => alert('Message sent!');