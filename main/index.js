const API_ROOT = "http://localhost:3000/projects";

let confirmPage = document.getElementsByClassName("confirm-page")[0];
let deleteId;
let newData;

function getListData() {
    let options = {
        url: API_ROOT,
        method: "GET",
        success: function(res) {
            updatePage(res);
        },
        fail: function(error) {
            console.log('ERROR');
        }
    };
    ajax(options);
}

function updatePage(data) {
    newData = data;
    renderUserList(data);
    changeStatus();
    let taskCount = calculateNumber(data);
    changeNumber(taskCount);
}

function renderUserList(data) {
    if (!Array.isArray(data) && !data instanceof Array) {
        return false;
    }
    let itemList = document.getElementsByClassName('item-list')[0];
    itemList.innerHTML = data.reduce((acc, cur) => {
        return acc += `<tr dataid='${cur.id}'>
                  <td>${cur.name}</td>
                  <td ><div class="description">${cur.description}</div></td>
                  <td>${cur.endTime}</td>
                  <td class='status'>${cur.status}</td>
                  <td><button class='delete-button'>删除</button></td>
              </tr>`;
    }, '');
}

function changeStatus() {
    let status = document.getElementsByClassName('status');
    for (let i = 0; i < status.length; i++) {
        switch (status[i].innerHTML) {
            case 'ACTIVE':
                status[i].style.color = '#666666';
                break;
            case 'PENDING':
                status[i].style.color = '#ee706d';
                break;
            case 'CLOSED':
                status[i].style.color = '#f7da47';
                break;
        }
    }
}

function calculateNumber(data) {
    let activeCount = 0;
    let pendingCount = 0;
    let closedCount = 0;
    data.forEach(task => {
        switch (task.status) {
            case 'ACTIVE':
                activeCount += 1;
                break;
            case 'PENDING':
                pendingCount += 1;
                break;
            case 'CLOSED':
                closedCount += 1;
                break;
        }
    });
    let allCount = activeCount + pendingCount + closedCount;
    let taskCount = [allCount, activeCount, pendingCount, closedCount];
    return taskCount;
}


function changeNumber(taskCount) {
    let cardNumbers = document.getElementsByClassName('card-number');
    taskCount.forEach(
        (count, index) => {
            if (index === 0) {
                cardNumbers[index].innerHTML = `<span class="number">${count}</span>`;
            } else {
                cardNumbers[index].innerHTML = `<span class="number">${count}</span>
                    <span class="percent">${taskCount[0]===0 ? 0 : Math.round((count / taskCount[0]) * 100)}% </span>`;
            }
        }
    )
}


function clickEvent(event) {
    let eventTarget = event.target;
    switch (eventTarget.className) {
        case 'delete-button':
            deleteId = eventTarget.parentElement.parentElement.getAttribute('dataid');
            deleteConfirmPage();
            break;
        case 'icon-cancle':
            canclePage();
            break;
        case 'confirm':
            deleteItemData(deleteId);
            newData = newData.filter(item => {
                return item.id != deleteId;
            });
            changeNumber(calculateNumber(newData));
            canclePage();
            break;
        case 'cancel':
            canclePage();
            break;
        case 'iconfont icon-asc':
            ascSort();
            break;
        case 'iconfont':
            decSort();
            break;
        default:
            break;
    }
}

function ascSort() {
    newData = newData.sort(function(a, b) {
        let timeA = Number(a.endTime.split('-').join(''));
        let timeB = Number(b.endTime.split('-').join(''));
        return timeA - timeB;
    });
    reloadPage();
    changeStatus();
    changeIconColor('asc');
}

function decSort() {
    newData = newData.sort(function(a, b) {
        let timeA = Number(a.endTime.split('-').join(''));
        let timeB = Number(b.endTime.split('-').join(''));
        return timeB - timeA;
    });
    reloadPage();
    changeStatus();
    changeIconColor('dec');
}

function reloadPage() {
    let itemList = document.getElementsByClassName('item-list')[0];
    var childs = itemList.childNodes;
    for (var i = childs.length - 1; i >= 0; i--) {  
        itemList.removeChild(childs[i]);
    }
    renderUserList(newData);
}

function changeIconColor(status) {
    let ascIcon = document.getElementsByClassName('icon-asc')[0];
    let decIcon = ascIcon.parentElement.children[2];
    switch (status) {
        case 'asc':
            ascIcon.style.color = '#308DFE';
            decIcon.style.color = '#aaa';
            break;
        case 'dec':
            decIcon.style.color = '#308DFE';
            ascIcon.style.color = '#aaa';
            break;
    }
}

function deleteConfirmPage() {
    confirmPage.style.display = "block";
}

function canclePage() {
    confirmPage.style.display = "none";
}

function deleteItem(id) {
    let itemList = document.getElementsByClassName('item-list')[0];
    let item = document.querySelector(`tr[dataid='${id}']`);
    itemList.removeChild(item);
}

function deleteItemData(id) {
    let options = {
        url: API_ROOT + "/" + id,
        method: "DELETE",
        success: function(res) {
            deleteItem(id);
        },
        fail: function(error) {
            console.log('ERROR');
        }
    };
    ajax(options);
}



function searchProject() {
    let x = document.getElementById("search-item").value;
    console.log(x);
    if (x) {
        let itemList = document.getElementsByClassName('item-list')[0];
        newData = newData.filter(
            item => item.name.search(x) !== -1
        );
        console.log(newData);
        reloadPage();
        changeStatus();
    }
}
getListData();