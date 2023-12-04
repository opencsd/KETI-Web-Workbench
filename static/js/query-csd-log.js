let temp_id = 1;
const queryHistory = [];

var totalContainerLog = [InterfaceContainerLog, MergingContainerLog, MonitoringContainerLog, offloadingContainerLog];
var totalCSDLog = [csd1Log, csd2Log, csd3Log, csd4Log, csd5Log, csd6Log, csd7Log, csd8Log];
let popover;

document.getElementById("pushdownButton").addEventListener("click", function () {
    const queryText = document.getElementById("queryTextarea").value.trim();

    const queryLogTableBody = document.getElementById("queryLogTableBody");

    if (queryText) {
        const shortenedQuery = queryText.length > 40 ? queryText.slice(0, 40) + "..." : queryText;
        queryHistory.push(shortenedQuery);

        const newRow = document.createElement("tr");
        const checkboxCell = document.createElement("td");
        checkboxCell.style.width = "5%";
        checkboxCell.style.textAlign = "center";
        const typeCell = document.createElement("td");
        typeCell.style.width = "5%";
        typeCell.style.textAlign = "center";
        const queryIDCell = document.createElement("td");
        queryIDCell.style.width = "1%";
        const queryCell = document.createElement("td");
        queryCell.style.width = "30%";
        const progressBarCells = [];
        const dummyButtonCell = document.createElement("td");
        dummyButtonCell.style.width = "5%";

        for (let i = 0; i < 4; i++) {
            const progressBarCell = document.createElement("td");
            progressBarCell.style.width = "12%";
            let width;
            let value;
            let max;
            let label;

            if(i==0){
                value = 2112;
                max = 6000;
            }else if(i==1){
                value = 800;
                max = 4000;
            }else if(i==2){
                value = 96;
                max = 200;
            }else{
                value = 13;
                max = 100;
            }

            label = value;
            width = (value / max) * 100;
            progressBarCell.innerHTML = `
                <div class="progress">
                    <div class="progress-bar" style="width: ${width}%" role="progressbar" aria-valuenow="${value}"
                        aria-valuemin="0" aria-valuemax="${max}" aria-label="${label}% Complete">
                        
                    </div>
                </div>
                <div style="text-align:center">
                    <h6 style="margin-top:5px; margin-bottom:0px;">${value}</h6>
                </div>
            `;
            progressBarCells.push(progressBarCell);
        }

        const dummyButton = document.createElement("td");
        dummyButton.innerHTML = `
            <span class="btn btn-link p-0 ssd_btn queryLogDetailClass" data-bs-toggle="popover" >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </span>
        `;
        $(document).ready(function(){
            $('[data-bs-toggle="popover"]').popover();
        });

        //각 옵션 버튼마다 id 부여 => 추후에 해당 데이터로 DB에 데이터 요청
        dummyButton.id = "queryLogOption" + temp_id;

        checkboxCell.innerHTML = `<input type="checkbox" class="form-check-input" name="form-type[]" value="1">`;
        newRow.appendChild(checkboxCell);

        // 쿼리 타입에 따라 아이콘 바꿔야함
        typeCell.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-rounded-letter-s" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-2a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1" />
        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
        </svg>`
        newRow.appendChild(typeCell);

        queryIDCell.textContent = temp_id;
        temp_id++;
        queryIDCell.style.textAlign = "center";
        newRow.appendChild(queryIDCell);

        queryCell.textContent = `${shortenedQuery}`;
        queryCell.style.backgroundColor = "#fcfdfe";
        newRow.appendChild(queryCell);

        for (let i = 0; i < 4; i++) {
            newRow.appendChild(progressBarCells[i]);
        }

        newRow.appendChild(dummyButtonCell);
        dummyButtonCell.appendChild(dummyButton);

        queryLogTableBody.appendChild(newRow);

        // 쿼리 로그 클릭 이벤트 발생 시 모달 로드 
        // dummyButton.querySelector('.queryLogDetailClass').addEventListener('click', function() {modalContentsLoad(dummyButton.id)});
        
        dummyButton.addEventListener('click', function() {
            if (popover) {
                popover.dispose(); // 기존 팝업 제거
            }
            popover = new bootstrap.Popover(dummyButton, {
                container: 'body',
                placement: 'right',
                trigger: 'manual',
                html: true,
                content: function () {
                    const popoverContent = document.createElement('div');
                    popoverContent.classList.add('text-center');
                    popoverContent.style.maxWidth = '200px';

                    const LogButton = document.createElement('button');
                    LogButton.setAttribute('type', 'button');
                    LogButton.classList.add('btn', 'btn-azure', 'd-block', 'mr-2');
                    LogButton.style.padding = '5px';
                    LogButton.style.width = '80px';
                    LogButton.style.marginBottom = '5px';
                    LogButton.textContent = 'LOG';
                    LogButton.addEventListener('click', function() {
                        modalContentsLoad(dummyButton.id);
                        popover.hide();
                    });

                    const DetailButton = document.createElement('button');
                    DetailButton.setAttribute('type', 'button');
                    DetailButton.classList.add('btn', 'btn-azure', 'd-block');
                    DetailButton.style.padding = '5px';
                    DetailButton.style.width = '80px';
                    DetailButton.textContent = 'DETAIL';
                    DetailButton.addEventListener('click', function() {
                        queryLogDetailLoad(dummyButton.id);
                        popover.hide()
                    });

                    popoverContent.appendChild(LogButton);
                    popoverContent.appendChild(DetailButton);

                    return popoverContent;
                }
            });
            popover.show();
        });
        
    } else {
        queryLogTableBody.textContent = "No query available.";
    }

    // document.getElementById("queryTextarea").value = "";
});

//모달 내용 로딩
function modalContentsLoad(b){
    $(function() {
        //CSD 로그 드롭박스 및 출력 데이터 초기화
        var CSDButton = document.getElementById("CSDButton");
        var CSDLog = document.getElementById("tab2");
        CSDButton.innerText = "CSD 1";
        CSDLog.innerHTML = totalCSDLog[0];
        
        //컨테이너 로그 드롭박스 및 출력 데이터 초기화
        var containerButton = document.getElementById("containerButton");
        var containerLog = document.getElementById("tab1");
        containerButton.innerText = "Interface Container"
        containerLog.innerHTML = totalContainerLog[0];

        // 모든 모달은 처음 띄워질 때 첫번째 탭 관련 정보만 시각화
        $("#containerButton").show();
        $("#CSDButton").hide();
        // $('.nav-tabs a:last').tab('hide');

        // 모달 띄우기(모든 탭 관련 정보 설정)
        $("#modal").modal("show");
        var modalDiv = $('#modal');
        modalDiv.modal({
            backdrop: true,
            show: true
        });
    });
    //CSD 1~8 ->
    for (let i = 1; i <= 8; i++) {
        document.getElementById("CSD" + i).addEventListener('click', function () {
            var CSDButton = document.getElementById("CSDButton");
            var csdLog = document.getElementById("tab2");
            CSDButton.innerText = "CSD " + i;
            csdLog.innerHTML = totalCSDLog[i-1];
        });
    };
    //Container 1~4
    var arr = ['Interface', "Merging", "Monitoring", "Offloading"];
    for (let i = 0; i < arr.length; i++) {
        document.getElementById(arr[i]).addEventListener('click', function () {
            var containerButton = document.getElementById("containerButton");
            var containerLog = document.getElementById("tab1");
            containerButton.innerText = arr[i] + " Container";
            containerLog.innerHTML = totalContainerLog[i];
        });
    };
}

//###모달 기능#####
// 1. 모달 닫기 
$("#modal #close").click(function () {
    $(function() {
        // Storage Engine, CSD tab 초기화
        var SEtab = document.getElementById("tab1-tab");
        var CSDtab = document.getElementById("tab2-tab");
        SEtab.ariaSelected = 'true';
        CSDtab.ariaSelected = 'false';

        // CSD 로그 드롭박스 및 출력 데이터 초기화
        var CSDButton = document.getElementById("CSDButton");
        var CSDLog = document.getElementById("tab2");
        CSDButton.innerText = "CSD Num";
        CSDLog.innerHTML = "";

        //컨테이너 로그 드롭박스 및 출력 데이터 초기화
        var containerButton = document.getElementById("containerButton");
        var containerLog = document.getElementById("tab1");
        containerButton.innerText = "Container"
        containerLog.innerHTML = "";

        $("#modal").modal("hide");
    });
});
// 2. 모달 드래그 
$(function () {
    $('.modal-dialog').draggable({
        handle: ".modal-header"
    });
});

// 3. 모달 탭 전환 
$('a[data-toggle="tab"]').click(function (e) {
        var targetTab = $(e.target).attr('href');
        // 탭 1로 전환 시 내용 업데이트
        if (targetTab === '#tab1') {
            $("#containerButton").show();
            $("#CSDButton").hide();

        } 
        // 탭 2로 전환 시 내용 업데이트
        else if (targetTab === '#tab2') {
            $("#containerButton").hide();
            $("#CSDButton").show();
        }
});

function queryLogDetailLoad(b) {
    $(function() {
        $("#queryLogDetail").modal("show");
        var modalDiv = $('#queryLogDetail');
        modalDiv.modal({
            backdrop: true,
            show: true
        });
    })
}