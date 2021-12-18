let page = 1
let nihs;

fetch('/xml/nihList.xml')
.then(res => res.text())
.then(data => {
    let parser = new DOMParser();
    let xml = parser.parseFromString(data, "text/xml");

    nihs = Array.from(xml.querySelectorAll("item")).map(nih => ({
        id: parseInt(nih.querySelector("sn").innerHTML),
        no: parseInt(nih.querySelector('no').innerHTML),
        name : nih.querySelector('ccbaMnm1').innerHTML.split('[')[2].split(']')[0],
        kdcd : nih.querySelector('ccbaKdcd').innerHTML,
        ctcd : nih.querySelector('ccbaCtcd').innerHTML,
        asno : nih.querySelector('ccbaAsno').innerHTML
    }))

    albumLoad(page, nihs)
    let pages = pagination(nihs.length, 8, 10, page)
    $('#pagination').html(pages)
})

async function albumLoad(page, list) {
    page = page || 1;
    $('.status .box .list').html("");
    let limit = 8
    let start = (page-1) * limit;
    let end;
    if(start + limit > list.length) {
        end = list.length
    } else {
        end = start + limit
    }
    
    for(let i = start; i<end; i++) {
        let url = `/xml/detail/${list[i].kdcd}_${list[i].ctcd}_${list[i].asno}.xml`
        await fetch(url)
        .then(res => res.text())
        .then(data => {
            
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "text/xml")
            let imgURL;
            let img = new Image();

            img.onload = function() {
                imgURL = img.src;

                let item = `<div class="item col-3">
                                <div class="card">
                                    <img src="${imgURL}" class="card-img-top"></img>
                                    <div class="card-body">
                                        <h5 style="margin: 0;" class="card-title">${list[i].name}</h5>
                                    </div>
                                </div>
                            </div>`
                $('.status .box .list').append(item)
            }

            img.onerror = function() {
                img.src = "/resource/img/noimage.png"
            }

            img.src = `/xml/nihcImage/${xml.querySelector('imageUrl').innerHTML}`;
        })
    }

    let pages = pagination(nihs.length, 8, 10, page)
    $('#pagination').html(pages)
}

$('#pagination').on('click', '.page-link', function(e) {
    e.preventDefault();
    page = $(this).attr("href");
    page = Number(page)
    albumLoad(page, nihs)
})

function pagination(total, item, block, page) {
    var total = total ? total : 0
    var item = item ? item : 10;
    var block = block ? block : 10;
    var curPage = page ? page : 1;

    var totalPage = Math.ceil(total/item);
    var totalBlock = Math.ceil(totalPage / block);
    var curBlock = Math.ceil(curPage / block);
    var firstPage = ((curBlock - 1) * block) + 1
    var lastPage = Math.min(totalPage, curBlock * block);
    var prevBlock = curBlock - 1;
    var nextBlock = curBlock + 1;
    var prevBlockPage = prevBlock * block;
    var nextBlockPage = nextBlock * block - (block - 1);

    $('.total-cnt').html("총 " + total + '건');
    $('.curpage').html(page + 'p')
    $('.endpage').html(totalPage + "p")

    var paginationblock = "<ul style='margin: 0;' class='pagination justify-content-center'>";

	if( curPage > 1 ) paginationblock += "<li class='page-item'><a class='page-link' href='1'>&laquo;</a></li>";
	else paginationblock +=  "<li class='page-item disabled'><a class='page-link' href='1' tabindex='-1' aria-disabled='true'>&laquo;</a></li>";

	if( prevBlock > 0 ) paginationblock += "<li class='page-item'><a class='page-link' href='" + prevBlockPage + "'>&lt;</a></li>";
	else paginationblock += "<li class='page-item disabled'><a class='page-link' href='#!' tabindex='-1' aria-disabled='true'>&lt;</a></li>";

	for ( var i=firstPage; i <= lastPage; i++ ) {
		if(i != curPage) paginationblock +=  "<li class='page-item'><a class='page-link' href='" + i + "'>" + i + "</a></li>";
		else paginationblock +=  "<li class='page-item active' aria-current='page'><a class='page-link' href='#!'>" + i + "</a></li>";
	}

	if( nextBlock <= totalBlock ) paginationblock += "<li class='page-item'><a class='page-link' href='" + nextBlockPage + "'>&gt;</a></li>";
	else paginationblock +=  "<li class='page-item disabled'><a class='page-link' href='#!' tabindex='-1' aria-disabled='true'>&gt;</a></li>";
	
	if( curPage < totalPage ) paginationblock += "<li class='page-item'><a class='page-link' href='" + totalPage + "'>&raquo;</a></li>";
	else paginationblock +=  "<li class='page-item disabled'><a class='page-link' href='#!' tabindex='-1' aria-disabled='true'>&raquo;</a></li>";

	paginationblock += "</ul>";

	return paginationblock;
}