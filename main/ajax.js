window.ajax = function(options) {
    var option = {
        url: options.url || '',
        method: options.method.toLocaleUpperCase() || 'GET',
        headers: options.headers || '',
        data: options.data || null,
        onSuccess: options.success || function(result) {},
        onFail: options.fail || function(error) {}
    };

    var xhr = new XMLHttpRequest();
    xhr.open(option.method, option.url, true);
    if (option.method === 'POST' || option.method === 'PUT') {
        xhr.setRequestHeader('content-type', 'application/json');
        option.data = JSON.stringify(option.data);
    }

    xhr.onerror = () => option.onFail(xhr.status);
    xhr.onload = () => option.onSuccess(JSON.parse(xhr.responseText));
    xhr.send(option.data);

}