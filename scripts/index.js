const switcher = (function () {
    const buildingInfo = document.querySelector("#directory-info"),
        contactInfo = document.querySelector("#contact-info");
    let timeout;

    const pageSwitch = function () {
        let directoryVisible = buildingInfo.getAttribute('visible');
        if (directoryVisible == 'true') {
            buildingInfo.setAttribute('visible', 'false');
            contactInfo.setAttribute('visible', 'true');
            buildingInfo.style.opacity = 0;
            contactInfo.style.opacity = 1;
        }
        else {
            buildingInfo.setAttribute('visible', 'true');
            contactInfo.setAttribute('visible', 'false');
            buildingInfo.style.opacity = 1;
            contactInfo.style.opacity = 0;
        }
    };

    const autoSwitch = () => {
        timeout = setTimeout(function () {
            pageSwitch();
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                pageSwitch()
                clearTimeout(timeout);
            }, 10000)
        }, 20000);
    }

    return {
        autoSwitch
    }
})();

const scroller = (function () {
    const table = document.querySelector("#table");
    const scrollHeight = table.scrollHeight * 1.5;
    let currentPos = 0;
    let down = true;
    var timeout;

    const beginScrolling = () => {
        timeout = scrollDown();
    }

    function scrollDown() {
        if (down) {
            if (currentPos < scrollHeight) {
                currentPos++;
                table.scrollTo(0, currentPos);
                clearTimeout(timeout);
                setTimeout(scrollDown, 7);
                // console.log("DOWN " + currentPos);
            }
            else {
                down = false;
                clearTimeout(timeout);
                setTimeout(scrollDown, 10);
                // console.log("DOWN END " + currentPos);
            }
        }
        else {
            if (currentPos > 0) {
                currentPos -= 3;
                table.scrollTo(0, currentPos);
                clearTimeout(timeout);
                setTimeout(scrollDown, 1);
                // console.log("UP " + currentPos);
            }
            else {
                down = true;
                clearTimeout(timeout);
                // console.log("UP END " + currentPos);
            }
        }
    }

    return {
        beginScrolling
    }
})();

const scrollThenSwitch = function () {

    const begin = () => {
        scroller.beginScrolling();
        switcher.autoSwitch();
    }

    const run = () => {
        begin();
        setInterval(begin, 55000);
    }

    return {
        run
    }
}();

const fillInInfo = (function () {
    var csv;

    // Reads the csv file
    function readCSVFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4)
                if (rawFile.status === 200 || rawFile.status == 0)
                    csv = rawFile.responseText;

        }
        rawFile.send(null);
    }

    // Reads the csv (Pipe delimited) format and updates both 2D arrays
    function updateData() {
        let rows = csv.split("\n");
        let table = document.querySelector("#table");
        let tenantDataRow = document.querySelector(".floor");
        let prevFloor = "NO";

        rows.forEach((r) => {
            let row = r.split("|"),
                currFloor = row[0],
                officeNum = row[1],
                tenantName = row[2];
            if (currFloor != prevFloor) {
                let floorNumContainer = table.children[0].cloneNode(true);
                floorNumContainer.children[0].innerHTML = currFloor;
                floorNumContainer.children[0].style.borderTop = 'solid 1px #fff';
                floorNumContainer.children[0].style.borderBottom = 'solid 1px #fff';
                floorNumContainer.classList.remove('display-none');
                table.appendChild(floorNumContainer);
                prevFloor = currFloor;
            }

            let tenantDataContainer = tenantDataRow.cloneNode(true);
            tenantDataContainer.classList.remove('display-none')
            tenantDataContainer.children[0].children[0].innerHTML = officeNum;
            tenantDataContainer.children[1].children[0].innerHTML = tenantName;

            table.append(tenantDataContainer);

        });
    };

    const begin = () => {
        readCSVFile("data/data.csv");
        updateData();
    }

    return {
        begin
    }
})();

window.onload = function () {
    fillInInfo.begin();
    setTimeout(scrollThenSwitch.run, 5000);
}