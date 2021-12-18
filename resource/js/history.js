let date = document.querySelector('#date')
let content = document.querySelector('#content')
let tabMenu = document.querySelector('.tab-menu')
let selY = document.querySelector('.selY')

let id = "";
let target = "";
let list = [];
let year = [];

window.addEventListener('load', () => {
    if(localStorage.getItem('data') == null) {
        list = [];
    } else {
        list = JSON.parse(localStorage.getItem('data'))
        load()
    }
})

// 등록팝업

$('.enBtn').on('click', function() {
    date.value = ""
    content.value = ""
    date.style.border = "1px solid #ced4da"
    content.style.border = "1px solid #ced4da"
    $('#myModal').modal('show');
})

$('.clE').on('click', function() {
    $('#myModal').modal('hide');
})

$('.enroll').on('click', function() {
    if(date.value != "" && content.value != "") {
        let y = date.value.split('-')
        
        let data = {
            date : date.value,
            y : y[0],
            m : y[1],
            d : y[2],
            content : content.value
        }

        list.push(data)
        list.sort((a, b) => {
            let dateA = new Date(a['date']).getTime();
            let dateB = new Date(b['date']).getTime();
            return dateA > dateB ? 1 : -1;
        })
        
        localStorage.setItem('data', JSON.stringify(list))
        list = JSON.parse(localStorage.getItem('data'))
        localStorage.setItem('select', data.y)
        $('#myModal').modal('hide');

        load()

    } else {
        if(date.value == "") {
            date.style.border = "2px solid #f00"
        } else {
            date.style.border = "2px solid #0f0"
        }

        if(content.value == "") {
            content.style.border = "2px solid #f00"
        } else {
            content.style.border = "2px solid #0f0"
        }
    }
})

function load() {

    // 가져온 데이터에서 년도만 중복없이 추출하기
    year = []
    list.forEach(item => {
        if(year.indexOf(Number(item.y)) == -1)
            year.push(Number(item.y))

        year.sort((a, b) => {
            return b - a
        })
    })

    // 년도 탭 생성하기
    tabMenu.innerHTML = ""
    year.forEach(item => {
        let span = document.createElement('span')
        span.innerHTML = item+'년'
        tabMenu.appendChild(span)
    })

    let tabMenus = document.querySelectorAll('.tab-menu span')
    
    // 마지막에 선택한 탭 목록 불러오기, 없다면 탭 목록중 가장 처음
        
    target = localStorage.getItem('select')
    if(year.length > 0 && year.indexOf(Number(target)) == -1) {
        tabMenus[0].classList.add('sel')
        selY.innerHTML = tabMenus[0].innerHTML
        target = tabMenus[0].innerHTML.split('년')[0]
    } else if(year.length > 0) {
        tabMenus.forEach(item => {
            if(item.innerHTML == target+'년') {
                item.classList.add('sel')
            }
        })
        selY.innerHTML = target+'년'
    } else {
        selY.innerHTML = '연혁을 등록해주세요.'
    }
    
    // 선택한 탭 목록 생성
    $('.history .list').html("")
    list.forEach((item, idx) => {
        if(item.y == target) {
            let div = `<div class="item">
                            <span class="date">${item.m + '.' + item.d}</span>
                            <p style="margin: 0;">${item.content}</p>
                            <span class="btns">
                            <button data-id="${idx}" class="edit" data-bs-toggle="modal" data-bs-target="#edit">수정</button>
                                <button data-id="${idx}" class="del" data-bs-toggle="modal" data-bs-target="#del">삭제</button>
                            </span>
                        </div>`
            $('.history .list').append(div)
        }
    })

    // 탭을 바꿀때 마다 목록 재생성
    tabMenus.forEach(item => {
        item.addEventListener('click', e => {
            $('.history .list').html("")

            tabMenus.forEach(item => {
                item.classList.remove('sel')
            })

            e.target.classList.add('sel')
            selY.innerHTML = e.target.innerHTML
            localStorage.setItem('select', e.target.innerHTML.split('년')[0])
            target = e.target.innerHTML.split('년')[0]

            list.forEach((item, idx) => {
                if(item.y == target) {
                    let div = document.createElement('div')
                    div.classList.add('item')
                    div.innerHTML = `<span class="date">${item.m + '.' + item.d}</span>
                                    <p>${item.content}</p>
                                    <span class="btns">
                                        <button data-id="${idx}" class="edit" data-bs-toggle="modal" data-bs-target="#edit">수정</button>
                                        <button data-id="${idx}" class="del" data-bs-toggle="modal" data-bs-target="#del">삭제</button>
                                    </span>`
                    $('.history .list').append(div)
                }
            })

            // 삭제팝업

            document.querySelectorAll('.del').forEach(item => {
                item.addEventListener('click', e => {
                    id = Number(e.target.dataset.id)
                    $('#del').modal('show');
                })
            })

            $('.clD').on('click', function() {
                $('#del').modal('hide');
            })

            // 수정팝업

            document.querySelectorAll('.edit').forEach(item => {
                item.addEventListener('click', e => {
                    id = Number(e.target.dataset.id)
                    $('#edit').modal('show');
                })
            })

            $('.clEd').on('.click', function() {
                $('#edit').modal('hide')
            })
        })
    })

    document.querySelectorAll('.del').forEach(item => {
        item.addEventListener('click', e => {
            id = Number(e.target.dataset.id)
            $('#del').modal('show');
        })
    })

    $('.clD').on('click', function() {
        $('#del').modal('hide');
    })

    // 수정팝업

    document.querySelectorAll('.edit').forEach(item => {
        item.addEventListener('click', e => {
            id = Number(e.target.dataset.id)
            $('#editdate').val(list[id].date);
            $('#editcontent').val(list[id].content);
            $('#edit').modal('show');
        })
    })

    $('.clEd').on('.click', function() {
        $('#edit').modal('hide')
    })
}

// 삭제팝업

document.querySelectorAll('.del').forEach(item => {
    item.addEventListener('click', e => {
        id = Number(e.target.dataset.id)
        $('#del').modal('show');
    })
})

$('.clD').on('click', function() {
    $('#del').modal('hide');
})

$('.delete').on('click', function() {
    $('#del').modal('hide');
    list.splice(id, 1)
    localStorage.setItem('data', JSON.stringify(list))
    load()
})

// 수정팝업

document.querySelectorAll('.edit').forEach(item => {
    item.addEventListener('click', e => {
        id = Number(e.target.dataset.id)
        $('#editdate').val(list[id].date);
        $('#editcontent').val(list[id].content);
        $('#edit').modal('show');
    })
})

$('.clEd').on('.click', function() {
    $('#edit').modal('hide')
})

$('.editOk').on('click', function() {
    $('#edit').modal('hide')
    let targetDate = $('#editdate').val();
    let targetContent = $('#editcontent').val();
    let ymd = targetDate.split('-')
    list[id].date = targetDate;
    list[id].content = targetContent;
    list[id].y = ymd[0];
    list[id].m = ymd[1];
    list[id].d = ymd[2];

    localStorage.setItem("data", JSON.stringify(list))
    load()
})