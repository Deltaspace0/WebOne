function fixY() {
    this.value = this.value.replace(/\,/g, ".").replace(/[^\d\.\-]/g, "");
    while (this.value.lastIndexOf('-') > 0) {
        this.value = this.value.substr(0, this.value.lastIndexOf('-'));
    }
    let x = parseFloat(this.value);
    while (x > 5 || x < -3) {
        this.value = this.value.substr(0, this.value.length - 1);
        x = parseFloat(this.value);
    }
    while ((this.value[0] == '-' && (this.value[1] == '.' || this.value.lastIndexOf('.') > 2)) || (this.value[0] != '-' && (this.value[0] == '.' || this.value.lastIndexOf('.') > 1))) {
        this.value = this.value.substr(0, this.value.lastIndexOf('.'));
    }
}
document.querySelector("#y-textinput").onkeyup = fixY;

function validateX() {
    let inputs = document.getElementsByName("x-values[]");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            console.log("checked x[i] = "+inputs[i].value);
            return true;
        }
    }
    return false;
}

function validateR() {
    let inputs = document.getElementsByName("r-values[]");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            console.log("checked r[i] = "+inputs[i].value);
            return true;
        }
    }
    return false;
}

function validateY() {
    let val = document.getElementById('y-textinput').value;
    console.log("y-textinput: "+val);
    if (val === null || val === undefined || val === "") {
        return false;
    }
    return true;
}

const resultTableOriginalHTML = document.getElementById('result-table').innerHTML;
document.querySelectorAll('input[value="Всё удалить"]')[0].addEventListener('click', function() {
    document.getElementById('result-table').innerHTML = resultTableOriginalHTML;
});

$('#input-form').on('submit', function (event) {
    event.preventDefault();
    if (!(validateX() & validateY() & validateR())) {
        alert("Не все данные введены.");
        return;
    }
    console.log($(this).serialize());
    $.ajax({
        url: 'main.php',
        method: 'post',
        dataType: 'json',
        data: $(this).serialize() + '&timezone=' + new Date().getTimezoneOffset(),
        beforeSend: function () {
            $('.button').attr('disabled', 'disabled');
        },
        success: function (data) {
            $('.button').attr('disabled', false);
            if (!data.success) {
                return;
            }
            $('#result-table').append(`<tr><td>${data.currentTime}</td><td>${data.executionTime}</td><td>${data.xValue}</td><td>${data.yValue}</td><td>${data.rValue}</td><td>${data.hit ? "Есть" : "Нет"}</td></tr>`);
        }
    });
});
