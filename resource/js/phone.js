let list = []
let tabList = [];
let target = "전체"
let itemList = document.querySelector('.list')
let tabMenu = document.querySelector('.tab-menu');

fetch('/restAPI/phone.php')
.then(res => res.json())
.then(data => {
    if(data.statusCd == "200") {
        data.items.forEach(item => {
            list.push(item)
        })

        loadTab()
        load(target)
    } else {
        alert(data.statusMsg)
        location.href = '/'
    }
})

function loadTab() {
    list.forEach(item => {
        if(tabList.indexOf(item.deptNm) == -1) {
            tabList.push(item.deptNm)
        }

        tabList.sort();
    })

    $('.tab-menu').html(`<span class="sel">전체</span>`)

    tabList.forEach(item => {
        let span = `<span>${item}</span>`
        $('.tab-menu').append(span)
    })

    document.querySelectorAll('.tab-menu span').forEach(item => {
        item.addEventListener('click', e => {
            target = e.target.innerHTML;

            document.querySelectorAll('.tab-menu span').forEach(item1 => {
                item1.classList.remove('sel')
                if(item1.innerHTML == target) {
                    item1.classList.add('sel')
                }
            })

            $('.title').html(target)
            load(target)
        })
    })
}

function load(data) {
    if(data != '전체') {
        itemList.innerHTML = ""
        let div = document.createElement('div')
        div.classList.add('sec');
        div.innerHTML = `<h4 class="title my-4">${data}</h4>
                            <div class="lists">

                            </div>`
        itemList.appendChild(div)

        let li = div.querySelector('.lists')

        list.forEach(item => {
            if(item.deptNm == data) {
                let div1 = document.createElement('div')
                div1.classList.add('item')
                div1.innerHTML = `<span class="name">${item.name}</span>
                                  <span class="tel">${item.telNo}</span>`
                li.appendChild(div1)
            }
        })
    } else {
        list.sort((a, b) => {
            let aData = a.deptNm;
            let bData = b.deptNm;

            return aData > bData ? 1 : -1
        })

        itemList.innerHTML = ""
        tabList.forEach(item => {
            let div = document.createElement('div')
            div.classList.add('sec');
            div.innerHTML = `<h4 class="title my-4">${item}</h4>
                             <div class="lists">

                             </div>`
            itemList.appendChild(div)
            let li = div.querySelector('.lists')
            list.forEach(item1 => {
                if(item == item1.deptNm) {
                    let div1 = document.createElement('div')
                    div1.classList.add('item')
                    div1.innerHTML = `<span class="name">${item1.name}</span>
                                      <span class="tel">${item1.telNo}</span>`
                    li.appendChild(div1)
                }
            })
        })
    }
}