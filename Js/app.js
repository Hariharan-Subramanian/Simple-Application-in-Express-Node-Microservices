var seatLimit = 120;
var seat = [];
var selectedSeat = [],
    bookedSeats = [];
var userObj, isselectionstart = false;

/* Creating Seat object */
function createSeatFn() {
    if (localStorage.getItem('confirmedSeat') != null) {
        bookedSeats = JSON.parse(localStorage.getItem('confirmedSeat'));
    }
    for (var i = 0; i < seatLimit; i++) {
        seat[i] = new seatClass()
        seat[i].seatNo = i;
        if ($.inArray(i, bookedSeats) > -1) {
            seat[i].seatMode = 2;
            $('#seat' + i).removeClass('seatmode0').addClass('seatmode2')
        }
    }
}
var logintemplate, registertemplate, reservetemplate, bookedtemplate,reserve_history;
$(document).ready(function() {
    /* Underscore Js Configuration  */
    _.templateSettings = {
        evaluate: /\{\%(.+?)\%\}/g,
        interpolate: /\{\{(.+?)\}\}/g
    };
    if (typeof logintemplate == 'undefined') {
        logintemplate = render('login', {});
    }
    var mainwrapper = $('#content-wrapper');
    mainwrapper.html(logintemplate);
    loginfunctionality();
});

/* Updating user info*/
function updateUserlist() {
    //var allUser = localStorage.getItem('userinfo');
    if (typeof reserve_history == 'undefined') {
        reserve_history = render('reserve-history', {});
    }
    $('#content-wrapper').html(reserve_history);

    $.ajax({
        url: '/reservedHistory',
        error: function() {
            $('#info').html('<p>An error has occurred</p>');
        },
        dataType: 'json',
        success: function(data) {
            console.log(data)
            var demoTemplate = _.template($('#tableTmplate').html());
            var dataArray = data.reservedData;
            $('#userlist').empty();
            if (dataArray != null) {
                var newhtml = demoTemplate({ 'dataArray': dataArray });
                $('#userlist').append(newhtml);
            }            
        },
        type: 'GET'
    });   
    $('#backtoreserve').on('click', function() {
         renderReserve()
    });
}
/* login functionality */
function loginfunctionality() {
    $('#loginbtn').on('click', function() {
        loginCheck()
    });
    $('#registerbtn').on('click', function() {
        renderregister();
    });
}
function loginCheck() {
    console.log('loginCheck')
    $.ajax({
        url: '/login',
        data: {
            "name": $('#username').val(),
            "password": $('#pwd').val()
        },
        error: function() {
            $('#info').html('<p>An error has occurred</p>');
        },
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if(parseInt(data.status)==0){
                renderReserve();
            }            
        },
        type: 'POST'
    });
}

function renderregister() {
    if (typeof registertemplate == 'undefined') {
        registertemplate = render('Register', {});
    }
    var mainwrapper = $('#content-wrapper');
    mainwrapper.html(registertemplate)
    $('#registerOk').on('click', function() {
        $.ajax({
            url: '/register',
            data: {
                "name": $('#uname').val(),
                "password": $('#pword').val(),
                "mobileNo": $('#mobileno').val(),
                "id": $('#mail').val()
            },
            error: function() {
                $('#info').html('<p>An error has occurred</p>');
            },
            dataType: 'json',
            success: function(data) {
                renderReserve();
            },
            type: 'POST'
        });

    });
}

function renderReserve() {
    if (typeof reservetemplate == 'undefined') {
        reservetemplate = render('reserve', {});
    }
    var mainwrapper = $('#content-wrapper');
    mainwrapper.html(reservetemplate)

    /* Pushing seat label template in to HTML */
    var demoTemplate = _.template($('#seatnoTemp').html());
    var newhtml = demoTemplate();
    $('#seatnos').append(newhtml);

    /* Pushing view label template in to HTML */
    demoTemplate = _.template($('#seatTemp').html());
    newhtml = demoTemplate();
    $('#seatsView').append(newhtml);

    //updateUserlist();
    createSeatFn();

    /* Seat selection Handling */
    $('.seat-class').on('click', function() {
        if (isselectionstart && selectedSeat.length < userObj.seatCount) {
            var thisobj = $(this);
            var sno = parseInt(thisobj.attr('sid'));
            var mode = seat[sno].seatMode;
            switch (mode) {
                case 0:
                    seat[sno].seatMode = 1;
                    thisobj.removeClass('seatmode0').addClass('seatmode1')
                    selectedSeat.push(seat[sno].seatNo)
                    break;
                case 1:
                    seat[sno].seatMode = 0;
                    var index = selectedSeat.indexOf(seat[sno].seatNo);
                    if (index > -1) {
                        selectedSeat.splice(index, 1);
                    }
                    thisobj.removeClass('seatmode1').addClass('seatmode0')
                    break;
            }
        } else {
            alert('Enter above details / Seat limit exceeds');
        }
    });

    /* start Seat selection section  */

    $('#startSelection').on('click', function() {
        if ($('#usrname').val().length > 0 && $('#seattotal').val() > 0) {
            userObj = new userClass();
            userObj.userName = $('#usrname').val();
            userObj.seatCount = $('#seattotal').val();
            $('#usrname,#seattotal').prop('disabled', true);
            isselectionstart = true;
        } else {
            alert('Enter Name and Seat details');
        }
    });

    /* Booked History */
    
    $('#bookedhistory').on('click', function() {
         updateUserlist();  
    });   

    /* Confirm section Handling */

    $('#confirm').on('click', function() {
        if (userObj != null) {
            if (selectedSeat.length == userObj.seatCount) {
                var dummySeat = [];
                userObj.confirmedSeats = selectedSeat;
                bookedSeats = bookedSeats.concat(selectedSeat);
                userObj.storeSeatdata();

                localStorage.setItem('confirmedSeat', JSON.stringify(bookedSeats));                
                $.each(selectedSeat, function(key, item) {
                    $('#seat' + item).removeClass('seatmode0').addClass('seatmode2')
                });
                var userListInterval=setInterval(function(){
                    clearInterval(userListInterval)
                    updateUserlist();  
                },200)
            } else {
                alert('Select mentioned Seats');
            }
        } else {
            alert('Enter Name and Seat limit');
        }
    });
}
/*render Method*/
//var rendered_html = render('mytemplate', {});

function render(tmpl_name, tmpl_data) {
    if (!render.tmpl_cache) {
        render.tmpl_cache = {};
    }
    if (!render.tmpl_cache[tmpl_name]) {
        var tmpl_dir = '/views';
        var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

        var tmpl_string;
        $.ajax({
            url: tmpl_url,
            method: 'GET',
            async: false,
            success: function(data) {
                tmpl_string = data;
            }
        });

        render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
    }
    return render.tmpl_cache[tmpl_name](tmpl_data);
}
