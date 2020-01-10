const API_ROOT = " http://localhost:3000/projects ";
let $itemList = document.getElementById('item-list');

function getListData() {
    let options = {
        url: API_ROOT,
        method: "GET",
        success: function(res) {
            renderUserList(res);
        },
        fail: function(error) {
            console.log('ERROR');
        }
    };
    ajax(options);
}

function renderUserList(data) {
    if (!Array.isArray(data) && !data instanceof Array) {
        return false;
    }

    $itemList.innerHTML = data.reduce((acc, cur) => {
        return acc += `<tr data-id='${cur.id}'>
                  <td>${cur.name}</td>
                  <td ><div class="description">${cur.description}</div></td>
                  <td>${cur.endTime}</td>
                  <td>${cur.status}</td>
                  <td><button id='btn'>删除</button></td>
              </tr>`;
    }, '');
}

getListData();